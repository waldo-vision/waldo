import mongoose from 'mongoose';

export async function connect(): Promise<void> {
  const { DB_URL } = process.env;

  await mongoose.connect(DB_URL || '');
  console.log('Successfully connected to database');
}
