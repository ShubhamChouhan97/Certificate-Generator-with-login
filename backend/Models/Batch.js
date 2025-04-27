const mongoose = require("mongoose");
function formatDateTo12Hour(date) {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

const  batchSchema = new mongoose.Schema({
    batchId: { type: String, required: true, unique: true },
    count:{type:Number,default:null},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    excelfileName: { type: String, required: true },
    templatefileName: { type: String, required: true },
    folderPath: { type: String, required: true },
    createdAt: { 
      type: String, 
      default: () => formatDateTo12Hour(new Date()) 
    },
    certificates:[
        { type: mongoose.Schema.Types.ObjectId,
                   ref: 'Certificate', 
                   default: null 
              }
    ], // Embedded certificates array
  });

const Batch = mongoose.models.BatchID || mongoose.model("Batch", batchSchema);
module.exports = Batch;