import FitUser from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/users
export const registerUser = async (req, res) => {
  const { name, email, password, age, gender, height, weight, location } = req.body;

  const userExists = await FitUser.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await FitUser.create({
    name, email, password: hashedPassword, age, gender, height, startWeight: weight, location
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
      // Return full profile structure to match frontend expectations
      workoutSchedule: user.workoutSchedule,
      settings: user.settings
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Login user
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await FitUser.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
      workoutSchedule: user.workoutSchedule,
      settings: user.settings,
      height: user.height
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Update User Profile / Settings / Schedule
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  const user = await FitUser.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.height = req.body.height || user.height;
    
    // Update Settings if provided
    if (req.body.settings) {
      user.settings = { ...user.settings, ...req.body.settings };
    }

    // Update Schedule if provided
    if (req.body.workoutSchedule) {
      user.workoutSchedule = req.body.workoutSchedule;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      settings: updatedUser.settings,
      workoutSchedule: updatedUser.workoutSchedule
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};