import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  // eslint-disable-next-line no-undef
  return jwt.sign({userId}, process.env.ACCESS_TOKEN, { expiresIn: '30m' });
}

export const generateRefreshToken = (userId) => {
  // eslint-disable-next-line no-undef
  return jwt.sign({userId}, process.env.REFRESH_TOKEN);
}