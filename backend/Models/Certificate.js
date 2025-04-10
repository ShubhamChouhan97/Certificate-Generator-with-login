const mongoose = require("mongoose");
const CertificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batchIdInDb: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    certificatePath: { type: String, required: true },
    certificateId: { type: String, required: true ,unique: true },
    createdAt: { type: Date, default: Date.now },
  });
  
const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);
module.exports = Certificate;