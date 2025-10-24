import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    console.log('Attempting Cloudinary upload for:', localFilePath);
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    });
    
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    console.log('Cloudinary upload successful:', response.secure_url);
    // Only delete file on successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    console.error('Cloudinary upload failed:', error.message);
    // Don't delete file on failure - let the calling function handle it
    return null;
  }
};

export { uploadOnCloudinary };