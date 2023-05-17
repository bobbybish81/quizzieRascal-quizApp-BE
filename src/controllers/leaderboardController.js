import Leaderboard from '../models/Leaderboard.js';

const updateLeaderboard = async (req, res) => {
  const { userid } = req.params;
  const { score , timeTaken } = req.body;

  const player = await Leaderboard.findOne({userId: userid})

  const totalPlays = player.totalPlays + 1;
  const totalScore = player.totalScore + score;
  const totalTime = player.totalTime + timeTaken;
  let quickestTime;
  player.quickestTime === 0 || player.quickestTime > timeTaken ?
  quickestTime = timeTaken : quickestTime = player.quickestTime;

  const aveScore = (score, plays) => {
    const num = score/plays;
    return num.toFixed(2)
  }

  await Leaderboard.updateOne(
    { userId: userid },
    {
      $set: {
        totalPlays: totalPlays,
        totalScore: totalScore,
        averageScore: aveScore(totalScore, totalPlays),
        totalTime: totalTime,
        averageTime: totalTime / totalPlays,
        quickestTime: quickestTime,
      },
    },
  );
  const newLeaderboard = await Leaderboard.find();
  const sortedLeaderboard = [...newLeaderboard]
    .sort((a , b) => a.averageScore < b.averageScore ? 1 : -1);
  return sortedLeaderboard ?
    res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json(sortedLeaderboard):
    res
      .status(404)
      .end(); 
};

export default updateLeaderboard;