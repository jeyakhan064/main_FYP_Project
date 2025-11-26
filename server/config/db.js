import mongoose from 'mongoose';

const connectDB = async () => {
  // Check if MongoDB URI is configured
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_connection_string_here') {
    console.log('⚠️  MongoDB URI not configured in .env file');
    console.log('   Please set up MongoDB Atlas and update MONGODB_URI in .env');
    console.log('   Server will run but authentication endpoints will not work until MongoDB is connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('   Server will continue but authentication endpoints will not work.');
  }
};

export default connectDB;
