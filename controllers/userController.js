import FitUser from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables!");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, location } = req.body;

    // Check if user exists
    const userExists = await FitUser.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await FitUser.create({
      name, email, password: hashedPassword, age, gender, height, startWeight: weight, location
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
        workoutSchedule: user.workoutSchedule,
        settings: user.settings
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: error.message }); // <--- Sends the REAL error to frontend
  }
};

// @desc    Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log for debugging on Render
    console.log("Attempting login for:", email);

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
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: error.message }); // <--- Sends the REAL error to frontend
  }
};

// @desc    Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await FitUser.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.height = req.body.height || user.height;
      if (req.body.settings) user.settings = { ...user.settings, ...req.body.settings };
      if (req.body.workoutSchedule) user.workoutSchedule = req.body.workoutSchedule;

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
  } catch (error) {
    console.error("Profile Update Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};