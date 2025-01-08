import express from "express";
import {
  addDiscount,
  updateDiscount,
  deleteDiscount,
} from "../controllers/discountController.js";

const router = express.Router();

// Routes pour les réductions
router.post("/add", addDiscount);
router.put("/", updateDiscount);
router.delete("/", deleteDiscount);

export default router;
