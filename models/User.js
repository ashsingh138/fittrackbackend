import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String,default:'Male' },
  location: { type: String },
  height: { type: Number, default: 170 }, // cm
  startWeight: { type: Number }, // Initial weight for progress calc
  
  // Settings / Goals
  settings: {
    targetDate: { type: String, default: '2025-02-15' },
    targetWeight: { type: Number, default: 75 },
    targetWaist: { type: Number, default: 32 },
  },

  // Weekly Plan (Defaults to your specific plan)
  workoutSchedule: {
    type: Object,
    default: {
      Monday: { focus: "Chest & Triceps", exercises: ["Pushups 12+10+8", "Incline pushups 15+15", "Narrow pushups 10", "Plank 45s x2"] },
      Tuesday: { focus: "Core + Lower Belly", exercises: ["Bicycle crunches 20x3", "Leg raises 12x3", "Plank 60s x2"] },
      Wednesday: { focus: "Chest & Triceps", exercises: ["Pushups 12+10+8", "Incline pushups 15+15", "Narrow pushups 10", "Plank 45s x2"] },
      Thursday: { focus: "Core + Lower Belly", exercises: ["Bicycle crunches 20x3", "Leg raises 12x3", "Plank 60s x2"] },
      Friday: { focus: "Chest & Triceps", exercises: ["Pushups 12+10+8", "Incline pushups 15+15", "Narrow pushups 10", "Plank 45s x2"] },
      Saturday: { focus: "Core + Lower Belly", exercises: ["Bicycle crunches 20x3", "Leg raises 12x3", "Plank 60s x2"] },
      Sunday: { focus: "Active Recovery", exercises: ["Walk 20–30 minutes"] }
    }
  }
}, { timestamps: true });

export default mongoose.model('FitUser', userSchema);