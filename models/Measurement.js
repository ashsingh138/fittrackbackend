import mongoose from 'mongoose';

const measurementSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'FitUser' },
  date: { type: String, required: true },
  weight: { type: Number, required: true },
  waistLower: { type: Number },
  waistUpper: { type: Number },
  chest: { type: Number },
  hip: { type: Number },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Measurement', measurementSchema);