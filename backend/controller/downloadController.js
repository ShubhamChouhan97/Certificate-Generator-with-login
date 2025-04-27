const Batch = require("../Models/Batch");
const Certificate = require("../Models/Certificate");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const downloadBatchPath = async (req, res) => {
  try {
    const batchId = req.body.id;
   // console.log("Batch ID:", batchId);

    const batch = await Batch.findOne({ batchId: batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const folderPath = path.join(__dirname, "../", batch.folderPath);
   // console.log("Folder Path:", folderPath);

    // Check if directory exists
    if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Create archive and stream
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("error", (err) => {
      console.error("Error zipping folder:", err);
      res.status(500).send("Error creating zip");
    });

    archive.pipe(res); // Stream zip to client
    archive.directory(folderPath, false); // Add folder contents
    archive.finalize();
  } catch (error) {
    console.error("Error downloading batch:", error);
    res.status(500).send("Internal Server Error");
  }
};

const downloadCertificate = async (req, res) => {
    try {
        const certifiacteId = req.body.id;
      //  console.log("Certificate ID:", certifiacteId);
        // find the certificate in the database
        const certificate = await Certificate.findOne({ certificateId: certifiacteId });
        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }
        // get the folder path from the database
        const filePath = path.join(__dirname, "../", certificate.certificatePath);

         // downlaod the file in response
         res.download(filePath, (err) => {
            if (err) {
              console.error("Error downloading file:", err);
              res.status(500).send("Error downloading file");
            }
          });
        }catch{
            console.error("Error downloading certificate:", error);
            res.status(500).send("Internal Server Error");
        }
    }

module.exports = {
  downloadBatchPath,
  downloadCertificate,
};
