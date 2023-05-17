import User from '../models/User.js';
import Token from '../models/Token.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({email: email});
  if (!user) {
    return res
      .status(400)
      .json({message: 'Email address not found!'}); 
  }
  const verifyPassword = bcrypt.compareSync(password, user.password)
  if (!verifyPassword) {
    return res
      .status(404)
      .json({message: 'Incorrect password!'}); 
  }

  const accessToken = generateAccessToken(user.userId);
  const refreshToken = generateRefreshToken(user.userId);

  try {
    const newRefreshToken = new Token({
      userId: user.userId,
      token: refreshToken
    });

    await newRefreshToken.save();
    
    return res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json({
        message: 'Welcome back!',
        accessToken: accessToken,
        userId: user.userId
      })
  } catch (error) {
    return res
      .status(500)
      .json({
        message: 'Server Error',
      })
  }
};

export default login;