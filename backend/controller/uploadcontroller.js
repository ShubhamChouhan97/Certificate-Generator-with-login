const path = require('path');
const fs = require('fs/promises');
const xlsx = require('xlsx');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const convert = require('docx-pdf');

const { v4: uuidv4 } = require('uuid');
const Batch = require('../Models/Batch');
const User = require('../Models/User');
const Certificate = require('../Models/Certificate');
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
const generateSingleCertificate = async ({ row, headers, index, templateContent, outputDir, io, batchId,newBatchId,userId }) => {
  try {
    const docxBuffer = generateCertificateDocx(templateContent, row);
    const baseName = row[headers[0]] || `cert_${index + 1}`;
    const docxPath = path.join(outputDir, `temp_certificate_${baseName}.docx`);
    const pdfPath = path.join(outputDir, `certificate_${baseName}.pdf`);

    await fs.writeFile(docxPath, docxBuffer);
    await convertDocxToPdf(docxPath, pdfPath);
    await fs.unlink(docxPath).catch(() => {}); // Silent fail if temp file delete fails

    const uniqueId = uuidv4().slice(0, 5);
    const certInfo = {
      name: baseName,
      certificateId: uniqueId,
      fileName: path.basename(pdfPath),
      path: `/uploads/certificates/${batchId}/${path.basename(pdfPath)}`
    };
    console.log(`Certificate generated: ${certInfo.name} (${certInfo.certificateId})`);
    const newCertificate = new Certificate({
      userId,
      batchIdInDb: newBatchId,
      name: certInfo.name,
      fileName: certInfo.fileName,
      betchId: batchId,
      certificatePath: certInfo.path,
      certificateId: certInfo.certificateId,
      createdAt: new Date()
    });
    await newCertificate.save();
    // Save the certificate info to the batch
    const batch = await Batch.findById(newBatchId);
    if (batch) {
      batch.certificates.push(newCertificate._id);
      await batch.save();
    } else {
      console.error(`Batch with ID ${batchId} not found`);
    }
    io.emit('certificate-generated', certInfo);
    return certInfo;
  } catch (err) {
    console.error(`Failed to generate certificate ${index + 1}`, err);
    return null;
  }
};

// Main background task (one-by-one processing)
const processCertificatesInBackground = async ({newBatch, headers, rows, templateContent, outputDir, io, batchId,newBatchId,userId }) => {
  let successCount = 0;

  for (let index = 0; index < rows.length; index++) {
    const certInfo = await generateSingleCertificate({
      row: rows[index],
      headers,
      index,
      templateContent,
      outputDir,
      io,
      batchId,
      newBatchId,
      userId
    });

    if (certInfo) successCount++;
  }
 
  newBatch.count = successCount;
  await newBatch.save();
  io.emit('batch-completed', {
    batchId,
    total: rows.length,
    success: successCount,
    failed: rows.length - successCount
  });
  return successCount;
};

// Main  controller
const uploadFiles = async (req, res, next) => {
  try {
    const userId = req.body.id; 
    const { excelFile, wordFile } = extractUploadedFiles(req);
    const { headers, rows } = await parseExcel(excelFile.path);
    const { batchId, outputDir } = await createOutputDirectory();
    const templateContent = await fs.readFile(wordFile.path);
    const io = req.app.get('io');
    
      const newBatch = new Batch({
        batchId,
        userId,
        excelfileName: excelFile.filename,
        templatefileName: wordFile.filename,
        folderPath: `/uploads/certificates/${batchId}`,
        certificates: [] // do not save now
      });
  // console that id of above object created
  const newBatchId= newBatch._id;
  await newBatch.save();
    // Save the newbatchid to the user database
  const user  = await User.findByIdAndUpdate(userId);
      user.batchIdInDb.push(newBatchId);
      await user.save();
    // Respond immediately
    res.status(202).json({
      success: true,
      message: 'Certificate generation started in background',
      batchId,
      folderPath: `/uploads/certificates/${batchId}`,
      length: rows.length,

    });

    // Start background task
    processCertificatesInBackground({ newBatch,headers, rows, templateContent, outputDir, io, batchId ,newBatchId,userId});
    user.batchCount++;
    await user.save();
  } catch (error) {
    console.error('Certificate background processing error:', error);
    next(error);
  }
};

module.exports = { uploadFiles };
