import Leaderboard from '../models/Leaderboard.js';

const leaderboardAPI = async (req, res) => {
  try {
    const lb = await Leaderboard.find();
    const leaderboard = [...lb].sort((a, b) => a.averageScore < b.averageScore ? 1 : -1);
    return res
      .status(200)
      .json(leaderboard);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Server error' });
  }
};

export default leaderboardAPI

