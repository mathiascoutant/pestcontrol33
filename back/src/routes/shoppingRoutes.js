import express from "express";
import {
  addShopping,
  getAllShoppingByUserId,
  removeShopping,
} from "../controllers/shoppingController.js";

const router = express.Router();

// Routes pour le panier
router.post("/add", addShopping);
router.get("/", getAllShoppingByUserId);
router.delete("/", removeShopping);

export default router;
