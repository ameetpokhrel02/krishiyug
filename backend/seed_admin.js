import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config({ path: './.env' });

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin already exists');
    } else {
      const admin = await User.create({
        name: 'Super Admin',
        email: 'admin@krishiyug.com',
        phoneNumber: '9800000000',
        password: 'AdminPassword123!',
        role: 'admin',
        status: 'active'
      });
      console.log('Admin created:', admin.email);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
