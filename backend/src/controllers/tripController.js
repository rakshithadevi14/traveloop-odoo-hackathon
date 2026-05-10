import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import asyncHandler from "../utils/asyncHandler.js";

const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    data: { trips },
  });
});

const createTrip = asyncHandler(async (req, res) => {
  const {
    title,
    destination,
    startDate,
    endDate,
    description = "",
    coverImage = "",
    isPublic = false,
    estimatedBudget = 0,
  } = req.body;

  if (!title || !destination || !startDate || !endDate) {
    const error = new Error("Missing required fields");
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.create({
    user: req.user._id,
    title: String(title).trim(),
    destination: String(destination).trim(),
    startDate,
    endDate,
    description: String(description).trim(),
    coverImage: String(coverImage).trim(),
    isPublic: Boolean(isPublic),
    estimatedBudget: Number(estimatedBudget) || 0,
  });

  return res.status(201).json({
    success: true,
    message: "Trip created successfully",
    data: { trip },
  });
});

const getTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid trip id");
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.findOne({ _id: id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    data: { trip },
  });
});

const updateTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid trip id");
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.findOne({ _id: id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const fields = ["title", "destination", "startDate", "endDate", "description", "coverImage", "isPublic", "estimatedBudget"];
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      trip[field] = req.body[field];
    }
  }
  await trip.save();

  return res.status(200).json({
    success: true,
    message: "Trip updated successfully",
    data: { trip },
  });
});

const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid trip id");
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.findOneAndDelete({ _id: id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Trip deleted",
  });
});

const getTripBudget = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    data: {
      totalBudget: trip.estimatedBudget || 0,
      startDate: trip.startDate,
      endDate: trip.endDate,
      expenses: trip.expenses || [],
    },
  });
});

const updateTripBudget = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const totalBudget = Number(req.body.totalBudget);
  if (Number.isNaN(totalBudget) || totalBudget < 0) {
    const error = new Error("Invalid totalBudget");
    error.statusCode = 400;
    throw error;
  }

  trip.estimatedBudget = totalBudget;
  await trip.save();

  return res.status(200).json({
    success: true,
    data: { totalBudget: trip.estimatedBudget },
  });
});

const createExpense = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const { category, description, date, unitCost, unit_cost, qty, quantity } = req.body;
  const nextExpense = {
    category: category || "Other",
    description: description || "",
    date: date || null,
    unitCost: Number(unitCost || unit_cost || 0),
    qty: Number(qty || quantity || 1),
  };
  trip.expenses.push(nextExpense);
  await trip.save();

  const expense = trip.expenses[trip.expenses.length - 1];
  return res.status(201).json({
    success: true,
    data: { expense },
  });
});

const getExpenses = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    data: { expenses: trip.expenses || [] },
  });
});

const updateExpense = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const expense = trip.expenses.id(req.params.expenseId);
  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  const fields = ["category", "description", "date", "unitCost", "qty"];
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      expense[field] = req.body[field];
    }
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "unit_cost")) {
    expense.unitCost = req.body.unit_cost;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "quantity")) {
    expense.qty = req.body.quantity;
  }
  await trip.save();

  return res.status(200).json({
    success: true,
    data: { expense },
  });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const expense = trip.expenses.id(req.params.expenseId);
  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }
  expense.deleteOne();
  await trip.save();

  return res.status(200).json({
    success: true,
    message: "Expense deleted",
  });
});

const getTripChecklist = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    data: { checklist: trip.checklist || [] },
  });
});

const createChecklistItem = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const { name, category, packed, checked } = req.body;
  if (!String(name || "").trim()) {
    const error = new Error("Item name is required");
    error.statusCode = 400;
    throw error;
  }

  trip.checklist.push({
    name: String(name).trim(),
    category: category || "Miscellaneous",
    packed: Boolean(packed ?? checked ?? false),
  });
  await trip.save();
  const item = trip.checklist[trip.checklist.length - 1];

  return res.status(201).json({
    success: true,
    data: { item },
  });
});

const updateChecklistItem = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const item = trip.checklist.id(req.params.itemId);
  if (!item) {
    const error = new Error("Checklist item not found");
    error.statusCode = 404;
    throw error;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "packed")) {
    item.packed = Boolean(req.body.packed);
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "checked")) {
    item.packed = Boolean(req.body.checked);
  }
  await trip.save();

  return res.status(200).json({
    success: true,
    data: { item },
  });
});

const deleteChecklistItem = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const item = trip.checklist.id(req.params.itemId);
  if (!item) {
    const error = new Error("Checklist item not found");
    error.statusCode = 404;
    throw error;
  }
  item.deleteOne();
  await trip.save();

  return res.status(200).json({
    success: true,
    message: "Checklist item deleted",
  });
});

const getTripNotes = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const notes = [...(trip.notes || [])].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return res.status(200).json({
    success: true,
    data: { notes },
  });
});

const createTripNote = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const { title, content, date } = req.body;
  trip.notes.push({
    title: String(title || "Untitled Note").trim() || "Untitled Note",
    content: String(content || "").trim(),
    date: date || new Date(),
  });
  await trip.save();

  const note = trip.notes[trip.notes.length - 1];
  return res.status(201).json({
    success: true,
    data: { note },
  });
});

const updateTripNote = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const note = trip.notes.id(req.params.noteId);
  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "title")) {
    note.title = String(req.body.title || "").trim() || "Untitled Note";
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "content")) {
    note.content = String(req.body.content || "");
  }
  await trip.save();

  return res.status(200).json({
    success: true,
    data: { note },
  });
});

const deleteTripNote = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const note = trip.notes.id(req.params.noteId);
  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }
  note.deleteOne();
  await trip.save();

  return res.status(200).json({
    success: true,
    message: "Note deleted",
  });
});

export {
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
};
