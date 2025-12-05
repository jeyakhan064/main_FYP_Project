import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

try {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('✅ MongoDB Connected Successfully!');
  console.log('Connected to:', mongoose.connection.host);
  console.log('Database:', mongoose.connection.name);

  // Try to list collections to verify permissions
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));

  process.exit(0);
} catch (error) {
  console.error('❌ MongoDB Connection Failed:');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Error code:', error.code);
  console.error('Full error:', error);
  process.exit(1);
}
