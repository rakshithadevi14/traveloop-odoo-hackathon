import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllTrips,
  deleteTrip,
  getStats,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/trips", getAllTrips);
router.delete("/trips/:id", deleteTrip);

router.get("/stats", getStats);

export default router;
