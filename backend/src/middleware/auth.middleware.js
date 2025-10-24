import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Cookies:', req.cookies);
    console.log('Authorization header:', req.header("Authorization"));
    
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log('Extracted token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

    if (!token) {
      console.log('❌ No token found in request');
      throw new ApiError(401, "Unauthorized request");
    }

    console.log('Verifying token with secret...');
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('✅ Token decoded successfully:', decodedToken);
    
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.log('❌ User not found for token');
      throw new ApiError(401, "Invalid access token");
    }

    console.log('✅ User authenticated:', user.username, user.role);
    req.user = user;
    next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error.message);
    console.log('Error stack:', error.stack);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const verifyRole = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied. Insufficient permissions");
    }

    next();
  });
};

export { verifyJWT, verifyRole };