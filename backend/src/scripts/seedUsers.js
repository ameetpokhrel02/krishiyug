import dotenv from "dotenv";
import { connectDB } from "../db/dbConnection.js";
import User from "../models/user.model.js";
import Policy from "../models/policy.model.js";

dotenv.config({ path: "./.env" });

const seedData = async () => {
  try {
    // Connect to database
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Policy.deleteMany({});
    console.log("Cleared existing data");

   
 // 1. Create Admin
    const admin = await User.create({
      phoneNumber: "9999999999",
      email: "admin@krishiyug.com",
      password: "admin12345",
      name: "System Admin",
      role: "admin",
    });
       
    
    console.log(`✓ Created Admin: ${admin.name} (${admin.phoneNumber})`);

    // 2. Create Insurance Companies
    const insuranceCompany1 = await User.create({
      phoneNumber: "9876543212",
      password: "insurance123",
      name: "Sita Sharma",
      role: "insurance_company",
      companyName: "Nepal Life Insurance Company",
    });
    console.log(`✓ Created Insurance Company: ${insuranceCompany1.name} - ${insuranceCompany1.companyName}`);

    const insuranceCompany2 = await User.create({
      phoneNumber: "9876543213",
      password: "insurance123",
      name: "Rajesh Thapa",
      role: "insurance_company",
      companyName: "Rastriya Beema Sansthan",
    });
    console.log(`✓ Created Insurance Company: ${insuranceCompany2.name} - ${insuranceCompany2.companyName}`);

    // 3. Create Farmers
    const farmer1 = await User.create({
      phoneNumber: "9876543210",
      password: "farmer123",
      name: "Ram Bahadur Gurung",
      role: "farmer",
      farmerDetails: {
        farmType: "livestock",
        farmSize: 5.5,
        cropTypes: [],
        location: {
          district: "Chitwan",
          village: "Bharatpur",
          region: "Bagmati",
        },
        livestockDetails: {
          earTags: ["NP-CHT-001", "NP-CHT-002", "NP-CHT-003"],
        },
      },
    });
    console.log(`✓ Created Farmer: ${farmer1.name} (${farmer1.farmerDetails.farmType})`);

    const farmer2 = await User.create({
      phoneNumber: "9876543214",
      password: "farmer123",
      name: "Maya Devi Tharu",
      role: "farmer",
      farmerDetails: {
        farmType: "crop",
        farmSize: 10.0,
        cropTypes: ["rice", "wheat", "maize", "potato"],
        location: {
          district: "Rupandehi",
          village: "Butwal",
          region: "Lumbini",
        },
      },
    });
    console.log(`✓ Created Farmer: ${farmer2.name} (${farmer2.farmerDetails.farmType})`);

    const farmer3 = await User.create({
      phoneNumber: "9876543215",
      password: "farmer123",
      name: "Dhan Bahadur Tamang",
      role: "farmer",
      farmerDetails: {
        farmType: "livestock",
        farmSize: 3.0,
        cropTypes: [],
        location: {
          district: "Kaski",
          village: "Pokhara",
          region: "Gandaki",
        },
        livestockDetails: {
          earTags: ["NP-KAS-101", "NP-KAS-102"],
        },
      },
    });
    console.log(`✓ Created Farmer: ${farmer3.name} (${farmer3.farmerDetails.farmType})`);

    // 5. Create Policies
    const policy1 = await Policy.create({
      name: "Livestock Protection Plan",
      description: "Comprehensive insurance coverage for buffalo, cattle, goats, and other livestock against death, disease, and accidents.",
      coverageAmount: 50000,
      premium: 2500,
      policyType: "livestock",
      applicableRegions: ["Bagmati", "Gandaki", "Lumbini"],
      insuranceCompanyId: insuranceCompany1._id,
      isActive: true,
    });
    console.log(`✓ Created Policy: ${policy1.name} (${policy1.policyType})`);

    const policy2 = await Policy.create({
      name: "Crop Insurance Scheme",
      description: "Protection against crop loss due to natural calamities, pests, and diseases. Covers rice, wheat, maize, potato, and other major crops.",
      coverageAmount: 100000,
      premium: 5000,
      policyType: "crop",
      applicableRegions: ["Lumbini", "Bagmati", "Madhesh"],
      insuranceCompanyId: insuranceCompany1._id,
      isActive: true,
    });
    console.log(`✓ Created Policy: ${policy2.name} (${policy2.policyType})`);

    const policy3 = await Policy.create({
      name: "Weather-Based Crop Insurance",
      description: "Index-based insurance that provides coverage against adverse weather conditions like drought, excess rainfall, and unseasonal frost.",
      coverageAmount: 75000,
      premium: 3500,
      policyType: "weather",
      applicableRegions: ["Bagmati", "Karnali", "Sudurpashchim"],
      insuranceCompanyId: insuranceCompany2._id,
      isActive: true,
    });
    console.log(`✓ Created Policy: ${policy3.name} (${policy3.policyType})`);

    const policy4 = await Policy.create({
      name: "Premium Livestock Care",
      description: "Enhanced coverage for high-value livestock with additional benefits including veterinary care and emergency support.",
      coverageAmount: 100000,
      premium: 6000,
      policyType: "livestock",
      applicableRegions: ["Bagmati", "Gandaki"],
      insuranceCompanyId: insuranceCompany2._id,
      isActive: true,
    });
    console.log(`✓ Created Policy: ${policy4.name} (${policy4.policyType})`);

    console.log("\n=== KrishiYug Demo Data Created Successfully ===");
    console.log("\n📋 Login Credentials:\n");

    console.log("1. Admin:");
    console.log("   Phone: 9999999999");
    console.log("   Email: admin@krishiyug.com");
    console.log("   Password: admin12345");
    console.log("   Access: Full system access\n");

    console.log("2. Insurance Company (Nepal Life Insurance):");
    console.log("   Phone: 9876543212");
    console.log("   Password: insurance123");
    console.log("   Company: Nepal Life Insurance Company\n");

    console.log("3. Insurance Company (Rastriya Beema):");
    console.log("   Phone: 9876543213");
    console.log("   Password: insurance123");
    console.log("   Company: Rastriya Beema Sansthan\n");

    console.log("4. Farmer (Livestock - Ram Bahadur Gurung):");
    console.log("   Phone: 9876543210");
    console.log("   Password: farmer123");
    console.log("   Farm Type: Livestock");
    console.log("   Location: Chitwan, Bagmati\n");

    console.log("5. Farmer (Crop - Maya Devi Tharu):");
    console.log("   Phone: 9876543214");
    console.log("   Password: farmer123");
    console.log("   Farm Type: Crop");
    console.log("   Location: Rupandehi, Lumbini\n");

    console.log("6. Farmer (Livestock - Dhan Bahadur Tamang):");
    console.log("   Phone: 9876543215");
    console.log("   Password: farmer123");
    console.log("   Farm Type: Livestock");
    console.log("   Location: Kaski, Gandaki\n");

    console.log("📊 Policies Created: 4");
    console.log("   - 2 Livestock policies");
    console.log("   - 1 Crop policy");
    console.log("   - 1 Weather-based policy\n");

    console.log("=====================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
