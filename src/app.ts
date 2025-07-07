import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import booksRouter from './routes/books';
import borrowRouter from './routes/borrow';
import { requestLogger } from './middlewares/requestLogger';

dotenv.config();

const app = express();

// Middleware
app.use(requestLogger);

// CORS setup (fix for both local and production frontend)
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://library-frontend-blush.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
}));

app.use(express.json());

// Add your routes here
app.get('/', (req, res) => {
  res.send('📚 Library Management API is running!');
});
app.use('/api/books', booksRouter);
app.use('/api/borrow-summary', borrowRouter);

// MongoDB connection
const uri = process.env.MONGODB_URI as string;
console.log('MongoDB URI:', uri);

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;
