const mongoose = require("mongoose");
const Habit = require("../models/Habit");

const ownsHabit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid habit id" });
    }

    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: this habit belongs to another account" });
    }

    req.habit = habit;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = ownsHabit;
