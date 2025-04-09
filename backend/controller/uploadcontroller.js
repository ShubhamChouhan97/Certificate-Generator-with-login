const path = require('path');
const fs = require('fs/promises');
const xlsx = require('xlsx');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const convert = require('docx-pdf');
const { console } = require('inspector');

const TEMP_DIR = path.join(__dirname, '../uploads');

// Extract and validate uploaded files
const extractUploadedFiles = (req) => {
  const excelFile = req.files.excelFile?.[0];
  const wordFile = req.files.templateFile?.[0];

  if (!excelFile || !wordFile) {
    throw new Error('Excel or Word file not uploaded');
  }

  return { excelFile, wordFile };
};

// Read Excel and convert to JSON
const parseExcel = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

  if (jsonData.length === 0) {
    throw new Error('Excel file is empty or invalid');
  }

  return { headers: Object.keys(jsonData[0]), rows: jsonData };
};

// Create output directory
const createOutputDirectory = async () => {
  const batchId = `batch_${Date.now()}`;
  const outputDir = path.join(TEMP_DIR, 'certificates', batchId);
  await fs.mkdir(outputDir, { recursive: true });
  return { batchId, outputDir };
};

// Generate certificate DOCX
const generateCertificateDocx = (templateContent, data) => {
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(data);
  return doc.getZip().generate({ type: 'nodebuffer' });
};

// Convert DOCX to PDF
const convertDocxToPdf = (docxPath, pdfPath) => {
  return new Promise((resolve, reject) => {
    convert(docxPath, pdfPath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Handle each certificate generation
const generateSingleCertificate = async ({ row, headers, index, templateContent, outputDir, io, batchId }) => {
  try {
    const docxBuffer = generateCertificateDocx(templateContent, row);
    const baseName = row[headers[0]] || `cert_${index + 1}`;
    const docxPath = path.join(outputDir, `temp_certificate_${baseName}.docx`);
    const pdfPath = path.join(outputDir, `certificate_${baseName}.pdf`);

    await fs.writeFile(docxPath, docxBuffer);
    await convertDocxToPdf(docxPath, pdfPath);
    await fs.unlink(docxPath).catch(() => {}); // Silent fail if temp file delete fails

    const certInfo = {
      name: baseName,
      fileName: path.basename(pdfPath),
      path: `/uploads/certificates/${batchId}/${path.basename(pdfPath)}`
    };

    io.emit('certificate-generated', certInfo);
    return certInfo;
  } catch (err) {
    console.error(`Failed to generate certificate ${index + 1}`, err);
    return null;
  }
};

// Main background task (one-by-one processing)
const processCertificatesInBackground = async ({ headers, rows, templateContent, outputDir, io, batchId }) => {
  let successCount = 0;

  for (let index = 0; index < rows.length; index++) {
    const certInfo = await generateSingleCertificate({
      row: rows[index],
      headers,
      index,
      templateContent,
      outputDir,
      io,
      batchId
    });

    if (certInfo) successCount++;
  }

  io.emit('batch-completed', {
    batchId,
    total: rows.length,
    success: successCount,
    failed: rows.length - successCount
  });
};

// Main controller
const uploadFiles = async (req, res, next) => {
  try {
    const { excelFile, wordFile } = extractUploadedFiles(req);
    const { headers, rows } = await parseExcel(excelFile.path);
    const { batchId, outputDir } = await createOutputDirectory();
    const templateContent = await fs.readFile(wordFile.path);
    const io = req.app.get('io');

    // Respond immediately
    res.status(202).json({
      success: true,
      message: 'Certificate generation started in background',
      batchId,
      folderPath: `/uploads/certificates/${batchId}`,
      length: rows.length,

    });

    // Start background task
    processCertificatesInBackground({ headers, rows, templateContent, outputDir, io, batchId });

  } catch (error) {
    console.error('Certificate background processing error:', error);
    next(error);
  }
};

module.exports = { uploadFiles };
