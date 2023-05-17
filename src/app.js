import express from 'express';
import mongoose from 'mongoose';
import leaderboardAPIRouter from './routes/api/leaderboard.js';
import leaderboardRouter from './routes/leaderboard.js';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import logoutRouter from './routes/logout.js';
import resetRouter from './routes/resetPassword.js';
import verifyRouter from './routes/verifyEmail.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
// eslint-disable-next-line no-undef
const port = process.env.port || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// eslint-disable-next-line no-undef
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_CLUSTER}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/api/leaderboard', leaderboardAPIRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/resetpassword', resetRouter);
app.use('/verifyemail', verifyRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});