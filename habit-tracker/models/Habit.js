const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      minlength: [2, "Habit name must be at least 2 characters"],
      maxlength: [60, "Habit name must be at most 60 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description must be at most 200 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
