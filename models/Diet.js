import mongoose from 'mongoose';

const dietSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'FitUser' },
  date: { type: String, required: true },
  meals: {
    breakfast: [{ name: String, qty: String, unit: String }],
    lunch: [{ name: String, qty: String, unit: String }],
    dinner: [{ name: String, qty: String, unit: String }],
    snacks: [{ name: String, qty: String, unit: String }],
    junk: [{ name: String, qty: String, unit: String }]
  },
  water: { type: Number, default: 0 },
  eggs: { type: Number, default: 0 },
  score: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.model('Diet', dietSchema);