import express from "express";
import {
  addProduct,
  fetchAllProducts,
  fetchProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Route pour les produits
router.post("/add", addProduct);
router.get("/", fetchAllProducts);
router.get("/:id", fetchProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
