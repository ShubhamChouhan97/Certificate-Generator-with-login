const express = require('express');
const router = express.Router();
const {downloadBatchPath,downloadCertificate} = require('../controller/downloadController');

router.post('/batchpath',downloadBatchPath);
router.post('/certifiacte',downloadCertificate);
module.exports = router;

