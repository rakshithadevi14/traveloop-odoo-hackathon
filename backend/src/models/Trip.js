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

const expenseSchema = new mongoose.Schema(
  {
    category: { type: String, trim: true, default: "Other" },
    description: { type: String, trim: true, default: "" },
    date: { type: Date },
    unitCost: { type: Number, default: 0, min: 0 },
    qty: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true },
);

const checklistItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "Miscellaneous" },
    packed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "Untitled Note" },
    content: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
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
    description: {
      type: String,
      trim: true,
      default: "",
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    estimatedBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
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
    expenses: {
      type: [expenseSchema],
      default: [],
    },
    checklist: {
      type: [checklistItemSchema],
      default: [],
    },
    notes: {
      type: [noteSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
