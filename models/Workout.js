import mongoose from 'mongoose';

const workoutSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'FitUser' },
  date: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "Chest Day"
  duration: { type: Number }, // minutes
  exercises: [
    {
      name: String,
      sets: String,
      reps: String,
      weight: String
    }
  ],
  completed: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Workout', workoutSchema);