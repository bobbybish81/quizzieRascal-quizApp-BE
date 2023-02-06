import express from 'express';
import { getLeaderboard, getUser, postNewUser, postNewEntry, postResults } from './mongodb.js';
import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const env = dotenv.config().parsed;
const { sign } = pkg;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()) 

app
  .route('/api/leaderboard')
  .get(async (req, res) => {
    const leaderboard = await getLeaderboard();
    return leaderboard ?
    res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json(leaderboard):
    res
      .status(404)
      .end(); 
  })

app
  .route('/api/leaderboard/:id')
  .post(async (req, res) => {
    const sortedLeaderboard = await postResults(req.params.id, req.body);
    return sortedLeaderboard ?
    res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json(sortedLeaderboard):
    res
      .status(404)
      .end(); 
  })

app
  .route('/login')
  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await getUser(email);
    if (!user[0]?.email) {
      return res
        .status(400)
        .json({message: 'Email address not found!'}); 
    }
    if (user[0]?.password !== password) {
      return res
        .status(400)
        .json({message: 'Password does not match!'}); 
    }
    if (!env) {
      return res
      .status(500)
      .end(); 
    }

    const jwtSecret = env.JWT_SECRET;

    const jwToken = sign(
      {
        id: user[0].id,
        username: user[0].username,
        password: user[0].password
      },
      jwtSecret
    )
    return res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json({message: 'Welcome back!', token: jwToken, user: user[0].id})
  })

app
  .route('/register')
  .post(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await getUser(email);
    if (user[0]?.email) {
      return res
        .status(400)
        .json({registered: false, alreadyRegistered: true}); 
    }

    const newUser = {
      id: uuidv4(),
      username: username,
      email: email,
      password: password,
    }
    await postNewUser(newUser)

    await postNewEntry({
      id: newUser.id,
      username: username,
      totalPlays: 0,
      totalScore: 0,
      averageScore: '',
      quickestTime: 0,
      totalTime: 0,
      averageTime: 0,
    })

    return res
      .setHeader('content-type', 'application/json')
      .status(201)
      .json({username: username, registered: true, alreadyRegistered: false})
  })

export default app;