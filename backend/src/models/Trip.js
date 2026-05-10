import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    day: {
      type: Number,
      min: 1,
    },
  },
  { _id: false },
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    stops: {
      type: [stopSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
