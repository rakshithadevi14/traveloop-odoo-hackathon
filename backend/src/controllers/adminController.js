import mongoose from "mongoose";
import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Activity from "../models/Activity.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { users },
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const userTrips = await Trip.find({ user: id }).select("_id");
  const tripIds = userTrips.map((trip) => trip._id);

  if (tripIds.length > 0) {
    await Activity.deleteMany({ trip: { $in: tripIds } });
    await Trip.deleteMany({ user: id });
  }

  await User.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const getAllTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { trips },
  });
});

const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid trip id");
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.findById(id);
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  await Activity.deleteMany({ trip: id });
  await Trip.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
});

const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalTrips, totalActivities, recentTrips] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    Activity.countDocuments(),
    Trip.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalTrips,
      totalActivities,
      recentTrips,
    },
  });
});

export {
  getAllUsers,
  deleteUser,
  getAllTrips,
  deleteTrip,
  getStats,
};
