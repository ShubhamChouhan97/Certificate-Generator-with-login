const path = require('path');
const fs = require('fs/promises');
const xlsx = require('xlsx');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const convert = require('docx-pdf'); // You can replace with libreoffice-convert if needed

const TEMP_DIR = path.join(__dirname, '../uploads');

const uploadFiles = async (req, res, next) => {
  try {
    const excelFile = req.files.excelFile?.[0];
    const wordFile = req.files.templateFile?.[0];

    if (!excelFile || !wordFile) {
      throw new Error('Excel or Word file not uploaded');
    }

    const workbook = xlsx.readFile(excelFile.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

    if (jsonData.length === 0) {
      throw new Error('Excel file is empty or invalid');
    }

    const headers = Object.keys(jsonData[0]);
    const rows = jsonData;
    const templatePath = wordFile.path;

    const batchId = `batch_${Date.now()}`;
    const outputDir = path.join(TEMP_DIR, 'certificates', batchId);
    await fs.mkdir(outputDir, { recursive: true });

    const templateContent = await fs.readFile(templatePath);
    const certificates = [];

    for (const [index, row] of rows.entries()) {
      const data = row;

      const zip = new PizZip(templateContent);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      try {
        doc.render(data); // ✅ Replaced deprecated methods

        const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });

        const baseName = data[headers[0]] || `cert_${index + 1}`;
        const docxPath = path.join(outputDir, `temp_certificate_${baseName}.docx`);
        const pdfPath = path.join(outputDir, `certificate_${baseName}.pdf`);

        await fs.writeFile(docxPath, docxBuffer);

        // Convert DOCX to PDF
        await new Promise((resolve, reject) => {
          convert(docxPath, pdfPath, (err) => {
            if (err) {
              console.error(`Error converting DOCX to PDF for ${baseName}:`, err);
              reject(err);
            } else {
              resolve();
            }
          });
        });

        // Delete temporary DOCX file
        if (await fs.stat(docxPath).catch(() => false)) {
          await fs.unlink(docxPath);
        }

        const certInfo = {
          name: baseName,
          fileName: path.basename(pdfPath),
          path: `/uploads/certificates/${batchId}/${path.basename(pdfPath)}`
        };

        // ✅ Emit socket event
        req.app.get('io').emit('certificate-generated', certInfo);

        certificates.push(certInfo);
      } catch (error) {
        console.error(`Error generating certificate ${index + 1}:`, error);
        continue;
      }
    }

    if (certificates.length === 0) {
      throw new Error('No certificates generated successfully');
    }

    res.status(200).json({
      success: true,
      message: 'Certificates generated successfully',
      batchId,
      folderPath: `/uploads/certificates/${batchId}`,
      certificates,
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    next(error);
  }
};

module.exports = { uploadFiles };
