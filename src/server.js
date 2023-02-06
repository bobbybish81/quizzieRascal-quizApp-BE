import app from './app.js';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;
const port = env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});