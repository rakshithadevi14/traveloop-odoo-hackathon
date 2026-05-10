import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  deleteMyAccount,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/change-password", protect, changePassword);
router.delete("/me", protect, deleteMyAccount);

export default router;
