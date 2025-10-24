import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCart);
router.route("/").post(addToCart);
router.route("/:productId").delete(removeFromCart);

export default router;