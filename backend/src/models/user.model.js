import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid Indian phone number"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["farmer", "ward_official", "insurance_agent"],
        message: "Role must be farmer, ward_official, or insurance_agent",
      },
    },
    // Role-specific fields
    wardNumber: {
      type: String,
      trim: true,
    },
    insuranceCompanyId: {
      type: String,
      trim: true,
    },
    farmerDetails: {
      farmSize: {
        type: Number,
        min: [0, "Farm size must be positive"],
      },
      cropTypes: [String],
      location: {
        district: String,
        village: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Validate role-specific fields
userSchema.pre("save", async function () {
  if (this.role === "ward_official" && !this.wardNumber) {
    throw new Error("Ward number is required for ward officials");
  }
  if (this.role === "insurance_agent" && !this.insuranceCompanyId) {
    throw new Error("Insurance company ID is required for insurance agents");
  }
  if (this.role === "farmer" && !this.farmerDetails) {
    throw new Error("Farmer details are required for farmers");
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      phoneNumber: this.phoneNumber,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

// Exclude password from JSON responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
