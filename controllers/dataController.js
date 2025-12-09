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



// --- DIET (Upsert Logic) ---
export const addDiet = async (req, res) => {
  const { date, meals, water, eggs, score } = req.body;

  try {
    // Try to find an existing log for this user & date
    let dietLog = await Diet.findOne({ user: req.user._id, date });

    if (dietLog) {
      // If found, UPDATE it (Merge arrays)
      if (meals) {
        if (meals.breakfast) dietLog.meals.breakfast.push(...meals.breakfast);
        if (meals.lunch) dietLog.meals.lunch.push(...meals.lunch);
        if (meals.dinner) dietLog.meals.dinner.push(...meals.dinner);
        if (meals.snacks) dietLog.meals.snacks.push(...meals.snacks);
        if (meals.junk) dietLog.meals.junk.push(...meals.junk);
      }
      // Update counts if provided (overwrite or add? Let's overwrite for simple sync)
      if (water !== undefined) dietLog.water = water;
      if (eggs !== undefined) dietLog.eggs = eggs;
      if (score !== undefined) dietLog.score = score;

      const updated = await dietLog.save();
      return res.json(updated);
    } else {
      // If not found, CREATE new
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