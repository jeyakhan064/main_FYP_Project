import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`✅ ${user.name} (${user.email}) is now an admin!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2] || 'admin@fashionforge.com';
makeAdmin(email);
