import dotenv from "dotenv";
import { connectDB } from "../db/dbConnection.js";
import User from "../models/user.model.js";

dotenv.config({ path: "./.env" });

const demoUsers = [
  {
    phoneNumber: "9876543210",
    password: "farmer123",
    name: "Ramesh Kumar",
    role: "farmer",
    farmerDetails: {
      farmSize: 5.5,
      cropTypes: ["wheat", "rice", "sugarcane"],
      location: {
        district: "Pune",
        village: "Kharadi",
      },
    },
  },
  {
    phoneNumber: "9876543211",
    password: "wardofficial123",
    name: "Suresh Patil",
    role: "ward_official",
    wardNumber: "12",
  },
  {
    phoneNumber: "9876543212",
    password: "insurance123",
    name: "Priya Sharma",
    role: "insurance_agent",
    insuranceCompanyId: "IC001",
  },
];

const seedUsers = async () => {
  try {
    // Connect to database
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to database");

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create demo users
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      console.log(`✓ Created ${user.role}: ${user.name} (${user.phoneNumber})`);
    }

    console.log("\n=== Demo Users Created Successfully ===");
    console.log("\nLogin Credentials:");
    console.log("\n1. Farmer:");
    console.log("   Phone: 9876543210");
    console.log("   Password: farmer123");
    console.log("   Access: /api/farmer/*");

    console.log("\n2. Ward Official:");
    console.log("   Phone: 9876543211");
    console.log("   Password: wardofficial123");
    console.log("   Access: /api/ward/*");

    console.log("\n3. Insurance Agent:");
    console.log("   Phone: 9876543212");
    console.log("   Password: insurance123");
    console.log("   Access: /api/insurance/*");

    console.log("\n=====================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
