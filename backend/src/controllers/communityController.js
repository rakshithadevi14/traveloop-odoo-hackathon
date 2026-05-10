import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCommunityTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ isPublic: true })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { trips },
  });
});

const getCommunityTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid trip id");
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.findOne({ _id: id, isPublic: true }).populate("user", "name email");
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

const likeCommunityTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid trip id");
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.findOne({ _id: id, isPublic: true });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  trip.likesCount = Number(trip.likesCount || 0) + 1;
  await trip.save();

  return res.status(200).json({
    success: true,
    data: { liked: true, likes: trip.likesCount, trip },
  });
});

const copyCommunityTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid trip id");
    error.statusCode = 400;
    throw error;
  }

  const original = await Trip.findOne({ _id: id, isPublic: true });
  if (!original) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const copy = await Trip.create({
    user: req.user._id,
    title: `Copy of ${original.title}`,
    destination: original.destination,
    startDate: original.startDate,
    endDate: original.endDate,
    description: original.description,
    coverImage: original.coverImage,
    isPublic: false,
    estimatedBudget: original.estimatedBudget,
    stops: original.stops || [],
    expenses: original.expenses || [],
    checklist: original.checklist || [],
  });

  return res.status(201).json({
    success: true,
    data: { trip: copy },
  });
});

export { getCommunityTrips, getCommunityTripById, likeCommunityTrip, copyCommunityTrip };
