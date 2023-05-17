import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    totalPlays: {
      type: Number,
    },
    totalScore: {
      type: Number,
    },
    averageScore: {
      type: String,
    },
    quickestTime: {
      type: Number,
    },
    totalTime: {
      type: Number,
    },
    averageTime: {
      type: Number,
    }
  },
  {
    collection: 'leaderboard',
    versionKey: false,
  }
);

export default mongoose.model('Leaderboard', leaderboardSchema);