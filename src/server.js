import app from './app.js';
import dotenv from 'dotenv';

dotenv.config().parsed;
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});