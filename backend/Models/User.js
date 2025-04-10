const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      batchIdInDb: [
        { type: mongoose.Schema.Types.ObjectId,
           ref: 'Batch', 
           default: null 
      }
    ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    },
  );



const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;