import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { validateRegistration } from './validateController.js';

const register = async (req, res) => {
  try {

    const { error } = validateRegistration(req.body);

    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        registered: false,
        alreadyRegistered: true
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = {
      userId: uuidv4(),
      username,
      email,
      password: hashedPassword
    };

    await User.create(newUser);

    await Leaderboard.create({
      userId: newUser.userId,
      username,
      totalPlays: 0,
      totalScore: 0,
      averageScore: '',
      quickestTime: 0,
      totalTime: 0,
      averageTime: 0
    });

    return res.status(201).json({
      username,
      registered: true,
      alreadyRegistered: false
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export default register;