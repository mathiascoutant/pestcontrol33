import express from "express";
import {
  addProduct,
  fetchAllProducts,
  fetchProduct,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Routes pour les produits
router.post("/add", addProduct);
router.get("/", fetchAllProducts);
router.get("/:id", fetchProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/like", likeProduct);
router.post("/unlike", unlikeProduct);

export default router;
