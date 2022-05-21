import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined as an environment variable');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined as an environment variable');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to database!');
  } catch (error) {
    console.log('Failed to connect to database', error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
