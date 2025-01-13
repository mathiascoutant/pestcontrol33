import express from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// Routes utilisateurs
router.get("/profile/:userId", protect, userController.getUserProfileById);
router.put("/", userController.updateUser);
router.get("/status", userController.getUserStatus);
router.delete("/", userController.deleteUser);
router.get("/", userController.getAllUsers);
router.delete("/delete", userController.deleteUserAdmin);

router.get("/some-route", (req, res) => {
  res.send("Réponse de la route GET");
});

export default router;
