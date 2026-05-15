import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config({ path: './.env' });

async function seedInsurance() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Create insurance company user
    const insuranceCompanyExists = await User.findOne({ 
      role: 'insurance_company',
      companyName: 'Alpha Insurance Ltd'
    });
    
    if (insuranceCompanyExists) {
      console.log('Insurance company user already exists');
    } else {
      const insuranceCompany = await User.create({
        name: 'Insurance Company Admin',
        phoneNumber: '9847226990',
        password: 'InsurancePass123!',
        role: 'insurance_company',
        companyName: 'Alpha Insurance Ltd',
        status: 'active'
      });
      console.log('Insurance company created:', insuranceCompany.name, insuranceCompany.phoneNumber);
    }

    // Create insurance agent user
    const insuranceAgentExists = await User.findOne({ 
      role: 'insurance_agent',
      phoneNumber: '9841110000'
    });
    
    if (insuranceAgentExists) {
      console.log('Insurance agent user already exists');
    } else {
      const insuranceAgent = await User.create({
        name: 'Insurance Officer',
        phoneNumber: '9841110000',
        password: 'OfficerPass123!',
        role: 'insurance_agent',
        status: 'active'
      });
      console.log('Insurance agent created:', insuranceAgent.name, insuranceAgent.phoneNumber);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding insurance users:', err);
    process.exit(1);
  }
}

seedInsurance();
