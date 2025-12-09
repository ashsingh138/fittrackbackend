import Workout from '../models/Workout.js';
import Diet from '../models/Diet.js';
import Measurement from '../models/Measurement.js';

// --- WORKOUTS ---
// backend/controllers/dataController.js

// --- WORKOUTS (Upsert Logic) ---
export const addWorkout = async (req, res) => {
  const { date, type, duration, exercises, completed } = req.body;

  try {
    // Check if a workout log already exists for this date
    let workout = await Workout.findOne({ user: req.user._id, date });

    if (workout) {
      // UPDATE: Replace fields to support edits/deletes
      if (exercises) workout.exercises = exercises; // Replaces the list (allows deleting items)
      if (type) workout.type = type;
      if (duration) workout.duration = duration;
      if (completed !== undefined) workout.completed = completed;

      const updated = await workout.save();
      return res.json(updated);
    } else {
      // CREATE: New entry
      const newWorkout = new Workout({ ...req.body, user: req.user._id });
      const saved = await newWorkout.save();
      return res.status(201).json(saved);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
  res.json(workouts);
};



// --- DIET (Upsert Logic) ---
export const addDiet = async (req, res) => {
  const { date, meals, water, eggs, score } = req.body;

  try {
    let dietLog = await Diet.findOne({ user: req.user._id, date });

    if (dietLog) {
      // UPDATE: We REPLACE the arrays instead of pushing to them.
      // This allows you to delete items (by sending a smaller array) 
      // or edit items (by sending an array with changed values).
      if (meals) {
        if (meals.breakfast) dietLog.meals.breakfast = meals.breakfast;
        if (meals.lunch) dietLog.meals.lunch = meals.lunch;
        if (meals.dinner) dietLog.meals.dinner = meals.dinner;
        if (meals.snacks) dietLog.meals.snacks = meals.snacks;
        if (meals.junk) dietLog.meals.junk = meals.junk;
      }
      
      if (water !== undefined) dietLog.water = water;
      if (eggs !== undefined) dietLog.eggs = eggs;
      if (score !== undefined) dietLog.score = score;

      const updated = await dietLog.save();
      return res.json(updated);
    } else {
      // CREATE
      const diet = new Diet({ ...req.body, user: req.user._id });
      const saved = await diet.save();
      return res.status(201).json(saved);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  

// ... keep getDiet and other functions

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

// ... existing imports
// Add these functions for DELETE logic

// --- DELETE DIET LOG ---
export const deleteDiet = async (req, res) => {
  try {
    const { date } = req.query; // We will pass date in URL: DELETE /api/diet?date=2025-01-01
    const deleted = await Diet.findOneAndDelete({ user: req.user._id, date });
    
    if (!deleted) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Diet log deleted", id: deleted._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- DELETE WORKOUT LOG ---
export const deleteWorkout = async (req, res) => {
  try {
    const { date } = req.query;
    const deleted = await Workout.findOneAndDelete({ user: req.user._id, date });
    
    if (!deleted) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Workout log deleted", id: deleted._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};