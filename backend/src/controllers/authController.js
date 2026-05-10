import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Activity from "../models/Activity.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, firstName, lastName, email, password, phone, city, country } = req.body;
    const resolvedName = String(name || `${firstName || ""} ${lastName || ""}`).trim();

    if (!resolvedName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name: resolvedName,
      email,
      password,
      phone: phone || "",
      city: city || "",
      country: country || "",
    });

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          country: user.country,
          bio: user.bio,
          photo: user.photo,
          status: user.status,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ id: user._id, role: user.role });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        photo: user.photo,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");

  const trips = await Trip.find({ user: userId }).select("destination startDate endDate");
  const tripsCount = trips.length;
  const countrySet = new Set();
  let daysTraveled = 0;

  for (const trip of trips) {
    if (trip.destination) {
      countrySet.add(String(trip.destination).trim().toLowerCase());
    }

    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0) daysTraveled += diff;
    }
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        photo: user.photo,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stats: {
        tripsCount,
        countriesVisited: countrySet.size,
        daysTraveled,
      },
    },
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ["photo", "name", "email", "phone", "city", "country", "bio"];
  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
    }
  }

  if (updates.email) {
    const duplicate = await User.findOne({
      email: updates.email.toLowerCase(),
      _id: { $ne: req.user._id },
    });
    if (duplicate) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }
    updates.email = updates.email.toLowerCase();
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    const error = new Error("Current password and new password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(req.user._id).select("+password");
  const isCurrentValid = await user.comparePassword(currentPassword);
  if (!isCurrentValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

const deleteMyAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userTrips = await Trip.find({ user: userId }).select("_id");
  const tripIds = userTrips.map((trip) => trip._id);

  if (tripIds.length > 0) {
    await Activity.deleteMany({ trip: { $in: tripIds } });
    await Trip.deleteMany({ user: userId });
  }

  await User.findByIdAndDelete(userId);

  return res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

export {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  deleteMyAccount,
};
