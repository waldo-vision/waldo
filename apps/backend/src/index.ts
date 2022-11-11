import express from 'express';
import dotenv from 'dotenv';

import { clipRoute } from './routes/clip.route';
import { footageRoute } from './routes/footage.route';
import { connect } from './services/database';

dotenv.config();

const HOST = `http://${process.env.HOST}` || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/footage', footageRoute());
app.use('/clip', clipRoute());
// setup rate limits

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

app.listen(PORT, async () => {
  await connect();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
