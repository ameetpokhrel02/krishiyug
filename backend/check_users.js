import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config({ path: './.env' });

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const user = await User.findOne({ phoneNumber: '9847226990' });
    
    if (user) {
      console.log('\n✓ User Found');
      console.log('────────────────');
      console.log('Name:', user.name);
      console.log('Phone:', user.phoneNumber);
      console.log('Role:', user.role);
      console.log('Status:', user.status);
      console.log('CreatedAt:', user.createdAt);
    } else {
      console.log('\n✗ User NOT found with phone 9847226990');
    }

    // Also check all insurance users
    console.log('\n\nAll Insurance Users in DB:');
    console.log('────────────────────────────');
    const insuranceUsers = await User.find({ role: { $in: ['insurance_company', 'insurance_agent', 'INSURANCE_OFFICER', 'INSURANCE_COMPANY'] } });
    
    insuranceUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. Name: ${user.name}, Phone: ${user.phoneNumber}, Role: ${user.role}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkUser();
