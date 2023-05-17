import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
import { generateAccessToken } from './generateToken.js';

const authenticateToken = async (req, res, next) => {
  
  const { userid } = req.params;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access token not found' });
  }

  try {
    // eslint-disable-next-line no-undef
    jwt.verify(token, process.env.ACCESS_TOKEN)
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      try {
        const refreshTokenDoc = await Token.findOne({ userId: userid });
        if (refreshTokenDoc) {
          const newAccessToken = generateAccessToken(userid);
          res
            .setHeader('Authorization', `Bearer ${newAccessToken}`);
          next();
        } else {
          throw new Error('Refresh token not found');
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Error refreshing access token' });
      }
    } else {
      return res
        .status(401)
        .json({ message: 'Invalid access token' });
    }
  }
};

export default authenticateToken;
