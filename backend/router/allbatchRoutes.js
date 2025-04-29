const express = require('express');
const router = express.Router();
const { getallbatch,getallbatchCertificate} = require('../controller/batchController');
router.get('/getallbatch',getallbatch);
router.post('/getallbatchCertificate',getallbatchCertificate);
module.exports = router;