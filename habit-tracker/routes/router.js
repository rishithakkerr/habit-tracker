const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
const auth = require("../middleware/auth");
const ownsHabit = require("../middleware/ownership");
const { calculateStreak } = require("../utils/streak");
const { todayString, isValidDateString } = require("../utils/dates");

const router = express.Router();
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/register
router.post("/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  (protected)
router.get("/auth/me", auth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});


router.use("/habits", auth);

// POST /api/habits : create a habit
router.post("/habits", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Habit name is required" });
    }
    const habit = await Habit.create({ user: req.user._id, name, description });
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
});

// GET /api/habits : list MY habits with streak + today's status
router.get("/habits", async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    const today = todayString();
    const logs = await HabitLog.find({ user: req.user._id }).select("habit date");
    const byHabit = {};
    logs.forEach((l) => {
      const key = l.habit.toString();
      (byHabit[key] = byHabit[key] || []).push(l.date);
    });

    const result = habits.map((h) => {
      const streak = calculateStreak(byHabit[h._id.toString()] || [], today);
      return { ...h.toObject(), ...streak };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/habits/:id : one habit (ownership checked)
router.get("/habits/:id", ownsHabit, (req, res) => {
  res.json(req.habit);
});

// DELETE /api/habits/:id : delete habit and its logs
router.delete("/habits/:id", ownsHabit, async (req, res, next) => {
  try {
    await HabitLog.deleteMany({ habit: req.habit._id });
    await req.habit.deleteOne();
    res.json({ message: "Habit and its logs deleted" });
  } catch (err) {
    next(err);
  }
});

// POST /api/habits/:id/log : mark done for a day
router.post("/habits/:id/log", ownsHabit, async (req, res, next) => {
  try {
    const today = todayString();
    const date = req.body && req.body.date ? req.body.date : today;

    if (!isValidDateString(date)) {
      return res.status(400).json({ message: "Date must be a valid date in YYYY-MM-DD format" });
    }
    if (date > today) {
      return res.status(400).json({ message: "Cannot log a habit for a future date" });
    }

    const existing = await HabitLog.findOne({ habit: req.habit._id, date });
    if (existing) {
      return res.status(409).json({ message: `Habit already logged for ${date}` });
    }

    const log = await HabitLog.create({ habit: req.habit._id, user: req.user._id, date });
    res.status(201).json(log);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Habit already logged for this date" });
    }
    next(err);
  }
});

// GET /api/habits/:id/logs : history of logged dates
router.get("/habits/:id/logs", ownsHabit, async (req, res, next) => {
  try {
    const logs = await HabitLog.find({ habit: req.habit._id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// GET /api/habits/:id/streak : current + longest streak
router.get("/habits/:id/streak", ownsHabit, async (req, res, next) => {
  try {
    const logs = await HabitLog.find({ habit: req.habit._id }).select("date");
    const dates = logs.map((l) => l.date);
    const streak = calculateStreak(dates, todayString());

    res.json({
      habitId: req.habit._id,
      habitName: req.habit.name,
      totalLogs: dates.length,
      ...streak,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;