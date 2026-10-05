const mongoose = require("mongoose");
const { isValidDateString } = require("../utils/dates");

const habitLogSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      validate: {
        validator: isValidDateString,
        message: "Date must be a valid date in YYYY-MM-DD format",
      },
    },
  },
  { timestamps: true }
);

habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("HabitLog", habitLogSchema);
