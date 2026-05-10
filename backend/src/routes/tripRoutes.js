import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripBudget,
  updateTripBudget,
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getTripChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getTripNotes,
  createTripNote,
  updateTripNote,
  deleteTripNote,
} from "../controllers/tripController.js";

const router = express.Router();

router.use(protect);
router.get("/", getTrips);
router.post("/", createTrip);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.get("/:id/budget", getTripBudget);
router.put("/:id/budget", updateTripBudget);
router.get("/:id/expenses", getExpenses);
router.post("/:id/expenses", createExpense);
router.put("/:id/expenses/:expenseId", updateExpense);
router.delete("/:id/expenses/:expenseId", deleteExpense);
router.get("/:id/checklist", getTripChecklist);
router.post("/:id/checklist", createChecklistItem);
router.patch("/:id/checklist/:itemId", updateChecklistItem);
router.delete("/:id/checklist/:itemId", deleteChecklistItem);
router.get("/:id/notes", getTripNotes);
router.post("/:id/notes", createTripNote);
router.patch("/:id/notes/:noteId", updateTripNote);
router.delete("/:id/notes/:noteId", deleteTripNote);

export default router;
