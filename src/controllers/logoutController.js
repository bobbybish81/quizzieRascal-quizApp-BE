import Token from '../models/Token.js';

const logout = async (req, res) => {

  const { userid } = req.params;

  try {
    await Token.deleteMany({ userId: userid });
    return res
      .sendStatus(200)
      .end()
  } catch (error) {
      return res
        .status(401)
        .json({ message: 'Access token not found' });
  }
};

export default logout;