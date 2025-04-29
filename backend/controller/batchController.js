const User = require('../Models/User');
const Batch = require('../Models/Batch');

const getallbatch = async (req, res) => {
    const userId = req.session.userId; // Assuming you're saving userId in session

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized - No session found" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const batchIds = user.batchIdInDb; // Should be an array of ObjectId
       // console.log("batchIds", batchIds);

        // Find all batches whose _id is in batchIds array
        const batches = await Batch.find({
            _id: { $in: batchIds }
        });
        const cleanedBatches = batches.map(batch => {
            const batchObj = batch.toObject(); // Convert Mongoose document to plain JS object
            delete batchObj.__v;
            delete batchObj.userId;
            delete batchObj.certificates;
            delete batchObj.excelfileName;
            delete batchObj.templatefileName;
            return batchObj;
        });

      //  console.log("cleanedBatches", cleanedBatches);

        res.status(200).json(cleanedBatches);
    } catch (error) {
        console.error("Error fetching batches:", error);
        res.status(500).json({ message: "Server error" });
    }
};




const getallbatchCertificate = async (req, res) => {
const  batchId = req.body.id; // Assuming you're saving userId in session
//  console.log("batchId", batchId);

  try{
    const batch = await Batch.findById(batchId).populate('certificates');
    if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
    }

    const certificates = batch.certificates.map(cert => {
        const certObj = cert.toObject(); // Convert Mongoose document to plain JS object
        delete certObj.__v;
        delete certObj.userId;
        delete certObj.batchIdInDb;
        delete certObj.createdAt;
        delete certObj.fileName;
        return certObj;
    });

    // console.log("certificates", certificates);

    res.status(200).json(certificates);
  }catch(error){
    res.status(500).json({ message: "Server error" });
  }

};
module.exports = { getallbatch ,getallbatchCertificate};
