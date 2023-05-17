import { MongoClient } from 'mongodb';

const url = process.env.MONGO_URL;
const dbName = 'quizzieRascalDB';

let client;
let users;
let leaderboard;

const connectUsers = async () => {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  users = db.collection('users');
};

const connectLeaderboard = async () => {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  leaderboard = db.collection('leaderboard');
};

export const getLeaderboard = async () => {
  await connectLeaderboard();
  const lb = await leaderboard.find().toArray();
  const sortedLeaderboard = [...lb].sort((a , b) => a.averageScore < b.averageScore ? 1 : -1);
  return sortedLeaderboard;
};

export const getUser = async (email) => {
  await connectUsers();
  const user = await users.find({email: email}).toArray();
  return user;
};

export const postNewUser = async (newUser) => {
  await connectUsers();
  await users.insertOne(newUser);
}

export const postNewEntry = async (newEntry) => {
  await connectLeaderboard();
  await leaderboard.insertOne(newEntry);
}

export const postResults = async (userId, results) => {
  await connectLeaderboard();
  const { timeTaken, score } = results;

  const player = await leaderboard.find({userId: userId}).toArray();

  const totalPlays = player[0].totalPlays + 1;
  const totalScore = player[0].totalScore + score;
  const totalTime = player[0].totalTime + timeTaken;
  let quickestTime;
  player[0].quickestTime === 0 || player[0].quickestTime > timeTaken ?
  quickestTime = timeTaken : quickestTime = player[0].quickestTime;

  const aveScore = (score, plays) => {
    const num = score/plays;
    return num.toFixed(2)
  }

  await leaderboard.updateOne(
    { userId: userId },
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
  const lb = await leaderboard.find().toArray();
  const sortedLeaderboard = [...lb].sort((a , b) => a.averageScore < b.averageScore ? 1 : -1);
  return sortedLeaderboard;
}

export const resetPassword = async (email, password) => {
  await connectUsers();
  await users.updateOne(
    {email: email},
    {
      $set: {
        password: password,
      },
    },
)};

export default { 
  getLeaderboard,
  getUser,
  postNewUser,
  postNewEntry,
  postResults,
  resetPassword
}; 
