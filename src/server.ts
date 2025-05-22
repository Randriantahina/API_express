import express from 'express';
import dotenv from 'dotenv';
import aiRouter from './routes/ai';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/ai', aiRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
