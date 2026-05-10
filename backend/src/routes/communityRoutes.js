import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCommunityTrips,
  getCommunityTripById,
  likeCommunityTrip,
  copyCommunityTrip,
} from "../controllers/communityController.js";

const router = express.Router();

router.use(protect);
router.get("/", getCommunityTrips);
router.get("/:id", getCommunityTripById);
router.post("/:id/like", likeCommunityTrip);
router.post("/:id/copy", copyCommunityTrip);

export default router;
