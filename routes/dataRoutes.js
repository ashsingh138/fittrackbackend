import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { 
  addWorkout, getWorkouts, 
  addDiet, getDiet, 
  addMeasurement, getMeasurements 
} from '../controllers/dataController.js';

const router = express.Router();

// Workout Routes
router.route('/workouts').post(protect, addWorkout).get(protect, getWorkouts).delete(protect, deleteWorkout);

// Diet Routes
router.route('/diet').post(protect, addDiet).get(protect, getDiet).delete(protect, deleteDiet);

// Measurement Routes
router.route('/measurements').post(protect, addMeasurement).get(protect, getMeasurements);

export default router;