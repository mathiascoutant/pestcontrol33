import express from "express";
import * as commentController from "../controllers/commentController.js";
const router = express.Router();

// Routes commentaires
router.get("/latest", commentController.getTenLatestComments);
router.post("/add", commentController.addComment);
router.get("/:productId", commentController.getAllCommentsByProductId);
router.delete("/", commentController.deleteComment);

export default router;
