import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/").post(
  verifyJWT,
  verifyRole(["admin"]),
  upload.single("image"),
  createProduct
);

router
  .route("/:productId")
  .put(verifyJWT, verifyRole(["admin"]), upload.single("image"), updateProduct)
  .patch(verifyJWT, verifyRole(["admin"]), upload.single("image"), updateProduct)
  .delete(verifyJWT, verifyRole(["admin"]), deleteProduct);

export default router;