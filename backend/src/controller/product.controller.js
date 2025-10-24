import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, stock, description } = req.body;

  if (!name || !price || !category || !stock) {
    throw new ApiError(400, "All fields are required");
  }

  let imageUrl = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"; // Default product image

  if (req.file) {
    console.log('File received:', req.file);
    const imageLocalPath = req.file.path;
    
    try {
      // Try Cloudinary upload first
      const image = await uploadOnCloudinary(imageLocalPath);
      if (image && image.secure_url) {
        imageUrl = image.secure_url;
        console.log('Using uploaded image from Cloudinary:', imageUrl);
      } else {
        // Fallback to local file serving
        const filename = req.file.filename;
        imageUrl = `http://localhost:8000/uploads/${filename}`;
        console.log('Cloudinary upload failed, using local file:', imageUrl);
        
        // Move file to permanent uploads directory
        const uploadsDir = './public/uploads';
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const sourcePath = imageLocalPath;
        const destPath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(sourcePath)) {
          fs.renameSync(sourcePath, destPath);
          console.log('File moved to:', destPath);
        } else {
          console.log('Source file not found:', sourcePath);
        }
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      // Clean up temp file if it still exists
      if (fs.existsSync(imageLocalPath)) {
        fs.unlinkSync(imageLocalPath);
      }
    }
  }

  const product = await Product.create({
    name,
    price,
    category,
    stock,
    description,
    image: imageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, price, category, stock, description } = req.body;

  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: { name, price, category, stock, description } },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (req.file) {
    console.log('Updating product with new image:', req.file);
    const imageLocalPath = req.file.path;
    
    try {
      // Try Cloudinary upload first
      const image = await uploadOnCloudinary(imageLocalPath);
      if (image && image.secure_url) {
        product.image = image.secure_url;
        console.log('Using uploaded image from Cloudinary:', image.secure_url);
      } else {
        // Fallback to local file serving
        const filename = req.file.filename;
        const imageUrl = `http://localhost:8000/uploads/${filename}`;
        console.log('Cloudinary upload failed, using local file:', imageUrl);
        
        // Move file to permanent uploads directory
        const uploadsDir = './public/uploads';
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const sourcePath = imageLocalPath;
        const destPath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(sourcePath)) {
          fs.renameSync(sourcePath, destPath);
          product.image = imageUrl;
          console.log('File moved to:', destPath);
        }
      }
      await product.save();
    } catch (error) {
      console.error('Error during image upload:', error);
      // Clean up temp file if it still exists
      if (fs.existsSync(imageLocalPath)) {
        fs.unlinkSync(imageLocalPath);
      }
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export { getAllProducts, createProduct, updateProduct, deleteProduct };