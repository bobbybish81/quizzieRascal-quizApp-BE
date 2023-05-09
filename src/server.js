import express from 'express';
import {
  getLeaderboard,
  getUser,
  postNewUser,
  postNewEntry,
  postResults,
  resetPassword } from './mongodb.js';
import pkg from 'jsonwebtoken';
import cors from "cors";
import bcrypt from 'bcrypt';
import { validateRegistration } from '../middleware/validateReg.js'
import { v4 as uuidv4 } from 'uuid';

const app = express();

const port = process.env.port || 8080;

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
      const verifyPassword = bcrypt.compareSync(password, user[0]?.password)
      if (!verifyPassword) {
        return res
          .status(404)
          .json({message: 'Incorrect password!'}); 
      }
      const jwtSecret = process.env.JWT_SECRET;
      const { sign } = pkg;
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
.route('/resetpassword')
  .post(async (req, res) => {
    const { email } = req.body;
    const user = await getUser(email);
    if (!user[0]?.email) {
      return res
        .status(400)
        .json({
          username: null,
          email: '',
          message: 'Email address not found!'}); 
    } else {
      return res
        .status(200)
        .json({
          username: user[0]?.username,
          email: user[0]?.email,
        })
      }
    })
  .patch(async (req, res) => {
    const { error } = validateRegistration(req.body);
    if (error) {
      return res
        .status(400)
        .json({message: `${error.details[0].message}`})
    }
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 8)
    await resetPassword(email, hashPassword)
    const user = await getUser(email);
    return res
      .setHeader('content-type', 'application/json')
      .status(200)
      .json({
        success: true,
        username: user[0]?.username,
        email: user[0]?.email,
        message: `Password for (${user[0]?.username}) has now been changed`
      })
})

app
  .route('/register')
    .post(async (req, res) => {
      const { error } = validateRegistration(req.body);
      if (error) {
        return res
          .status(400)
          .json({message: `${error.details[0].message}`})
      }
      const { username, email, password } = req.body;
      const user = await getUser(email);
      if (user[0]?.email) {
        return res
          .status(400)
          .json({registered: false, alreadyRegistered: true}); 
      }
      const hashPassword = await bcrypt.hash(password, 8)
      const newUser = {
        id: uuidv4(),
        username: username,
        email: email,
        password: hashPassword,
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
