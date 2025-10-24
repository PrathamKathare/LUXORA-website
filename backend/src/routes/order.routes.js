import { Router } from "express";
import {
  placeOrder,
  getOrderHistory,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, placeOrder);
router.route("/history").get(verifyJWT, getOrderHistory);
router.route("/all").get(verifyJWT, verifyRole(["admin"]), getAllOrders);
router.route("/:orderId/status").patch(verifyJWT, verifyRole(["admin"]), updateOrderStatus);

export default router;