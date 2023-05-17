import Token from '../models/Token.js';

const deleteToken = async (token) => {
  const userToken = await Token.findOneAndDelete({ token: token });
  if (!userToken) {
    return;
  } else {
    return userToken;
  }
};

export default deleteToken