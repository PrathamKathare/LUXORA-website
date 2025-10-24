import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const placeOrder = asyncHandler(async (req, res) => {
  const { address, items, total } = req.body;

  // Check if items are provided directly in the request
  if (items && items.length > 0) {
    // Direct order placement with provided items
    const orderItems = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total: total || orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      address,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  }

  // Fallback to cart-based order placement
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty and no items provided");
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const calculatedTotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    total: calculatedTotal,
    address,
  });

  await Cart.deleteOne({ _id: cart._id });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Order history fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "username email");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export { placeOrder, getOrderHistory, getAllOrders, updateOrderStatus };