
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const uploadController = require('../controller/uploadcontroller');

// Define directories
const excelDir = path.join(__dirname, '../uploads/excel');
const templateDir = path.join(__dirname, '../uploads/template');

// Create folders if they don't exist
// if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });
// if (!fs.existsSync(templateDir)) fs.mkdirSync(templateDir, { recursive: true });
function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
createDirIfNotExists(excelDir);
createDirIfNotExists(templateDir);


// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.xlsx', '.xls'].includes(ext)) {
      cb(null, excelDir);
    } else if (['.doc', '.docx'].includes(ext)) {
      cb(null, templateDir);
    } else {
      cb(new Error('Unsupported file type'), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post(
  '/uploaddata',
  upload.fields([
    { name: 'excelFile', maxCount: 1 },
    { name: 'templateFile', maxCount: 1 }
  ]),
  uploadController.uploadFiles
);

module.exports = router;
