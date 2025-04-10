const mongoose = require("mongoose");


const  batchSchema = new mongoose.Schema({
    batchId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    excelfileName: { type: String, required: true },
    templatefileName: { type: String, required: true },
    folderPath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    certificates:[
        { type: mongoose.Schema.Types.ObjectId,
                   ref: 'Certificate', 
                   default: null 
              }
    ], // Embedded certificates array
  });

const Batch = mongoose.models.BatchID || mongoose.model("Batch", batchSchema);
module.exports = Batch;