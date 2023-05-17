import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { validateRegistration } from './validateController.js'

const register = async (req, res) => {

  const { error } = validateRegistration(req.body);

  if (error) {
    return res
      .status(400)
      .json({message: `${error.details[0].message}`})
  }

  const { username, email, password } = req.body;

  const user = await User.findOne({email: email});
  if (user) {
    return res
      .status(400)
      .json({registered: false, alreadyRegistered: true}); 
  }
  
  const hashPassword = await bcrypt.hash(password, 8)
  const newUser = {
    userId: uuidv4(),
    username: username,
    email: email,
    password: hashPassword,
  }
  await User.create(newUser);

  await Leaderboard.create({
    userId: newUser.userId,
    username: username,
    totalPlays: 0,
    totalScore: 0,
    averageScore: '',
    quickestTime: 0,
    totalTime: 0,
    averageTime: 0,
  })

  return res
    .setHeader('content-type', 'application/json')
    .status(201)
    .json({
      username: username,
      registered: true,
      alreadyRegistered: false
    })
}

export default register;