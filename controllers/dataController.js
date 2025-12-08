import Workout from '../models/Workout.js';
import Diet from '../models/Diet.js';
import Measurement from '../models/Measurement.js';

// --- WORKOUTS ---
export const addWorkout = async (req, res) => {
  const workout = new Workout({ ...req.body, user: req.user._id });
  const saved = await workout.save();
  res.status(201).json(saved);
};

export const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
  res.json(workouts);
};

// --- DIET ---
export const addDiet = async (req, res) => {
  const diet = new Diet({ ...req.body, user: req.user._id });
  const saved = await diet.save();
  res.status(201).json(saved);
};

export const getDiet = async (req, res) => {
  const dietLogs = await Diet.find({ user: req.user._id }).sort({ date: -1 });
  res.json(dietLogs);
};

// --- MEASUREMENTS ---
export const addMeasurement = async (req, res) => {
  const measure = new Measurement({ ...req.body, user: req.user._id });
  const saved = await measure.save();
  res.status(201).json(saved);
};

export const getMeasurements = async (req, res) => {
  const data = await Measurement.find({ user: req.user._id }).sort({ date: -1 });
  res.json(data);
};