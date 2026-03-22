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
const port = process.env.PORT || 8080;

/*
CORS configuration
Allows Netlify frontend and local development
*/
const allowedOrigins = [
  "https://quizzierascal.netlify.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

// handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_CLUSTER}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(uri)
  // .then(() => console.log("Connected to MongoDB"))
  .then(() => console.log("Connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/leaderboard', leaderboardAPIRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/resetpassword', resetRouter);
app.use('/verifyemail', verifyRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});