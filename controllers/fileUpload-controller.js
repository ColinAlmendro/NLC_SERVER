const cloudinary = require("../utils/cloudinaryConfig");
const fs = require("fs");

const uploadFile = async (req, res, err) => {
	console.log("Uploading to Cloudinary...");
	try {
		// Check if the file was provided
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		console.log("Uploading to Cloudinary, file ok ...");
		// Upload file to Cloudinary
		const cloudinaryUploadResponse = await cloudinary.uploader.upload(
			req.file.path,
			{
				resource_type: "auto",
			},
			{
				folder: "NLC",
			}
		);
		return cloudinaryUploadResponse.status(200).json({
			success: true,
			message: "Uploaded on Cloudinary",
			data: cloudinaryUploadResponse,
		});
	} catch (error) {
		console.error(error);
		fs.unlinkSync(req.file.path);
		return null;
	}
};
//console.log("uploadFile", uploadfile);

module.exports = { uploadFile };
