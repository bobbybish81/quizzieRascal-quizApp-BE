import bcrypt from 'bcrypt';
import deleteToken from '../utils/deleteToken.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const resetPassword = async (req, res) => {

  const { token, password } = req.body;

  // eslint-disable-next-line no-undef
  jwt.verify(token, process.env.REFRESH_TOKEN);

  try {
    const userToken = await deleteToken(token);
    const user = await User.findOne({ userId: userToken.userId});
    if (!user) {
      return res
      .status(400)
      .json({ error: 'User not found' });
    }
    const hashPassword = await bcrypt.hash(password, 8)
    user.password = hashPassword;
    await user.save();

    await deleteToken(token);

    return res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json({
        success: true,
        username: user.username,
        email: user.email,
        message: `Password for (${user.username}) has now been changed`
      })
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Server error' });
  }
};

export default resetPassword;