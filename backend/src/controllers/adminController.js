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

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  if (!["active", "disabled"].includes(status)) {
    const error = new Error("Invalid status. Use active or disabled");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: { user },
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
  const [totalUsers, totalTrips, totalActivities, recentTrips, topDestinationsRaw] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    Activity.countDocuments(),
    Trip.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5),
    Trip.aggregate([
      {
        $match: {
          destination: { $exists: true, $type: "string", $ne: "" },
        },
      },
      {
        $group: {
          _id: "$destination",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const tripsThisMonth = await Trip.countDocuments({
    createdAt: { $gte: monthStart },
  });

  const last30Days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    last30Days.push({ dayStart, dayEnd });
  }

  const tripCounts = await Promise.all(
    last30Days.map(({ dayStart, dayEnd }) =>
      Trip.countDocuments({ createdAt: { $gte: dayStart, $lt: dayEnd } }),
    ),
  );

  const tripsPerDay = last30Days.map(({ dayStart }, index) => ({
    date: dayStart.toISOString().slice(0, 10),
    trips: tripCounts[index],
  }));

  const topDestinations = topDestinationsRaw.map((item) => ({
    destination: item._id,
    trips: item.count,
  }));

  return res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalTrips,
      tripsThisMonth,
      totalActivities,
      tripsPerDay,
      topDestinations,
      recentTrips,
    },
  });
});

export {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllTrips,
  deleteTrip,
  getStats,
};
