import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";


const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price image"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, cart || { items: [] }, "Cart fetched successfully"));
});




const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find((item) =>
    item.product.equals(productId)
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item added to cart successfully"));
});




const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter((item) => !item.product.equals(productId));
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

export { getCart, addToCart, removeFromCart };