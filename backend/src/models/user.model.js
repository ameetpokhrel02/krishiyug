import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: function() { return this.role !== 'admin'; },
      unique: false,
      trim: true,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
      index: true,
    },
    email: {
      type: String,
      required: function() { return this.role === 'admin'; },
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
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
        values: ["farmer", "insurance_company", "admin"],
        message: "Role must be farmer, insurance_company, or admin",
      },
    },
    // Role-specific fields
    companyName: {
      type: String,
      trim: true,
    },
    farmerDetails: {
      farmType: {
        type: String,
        enum: ["livestock", "crop"],
      },
      farmSize: {
        type: Number,
        min: [0, "Farm size must be positive"],
      },
      cropTypes: [String],
      location: {
        district: String,
        village: String,
        region: String,
      },
      livestockDetails: {
        earTags: [String],
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
  if (this.role === "admin" && !this.email) {
    throw new Error("Email is required for admin users");
  }
  if (this.role === "insurance_company" && !this.companyName) {
    throw new Error("Company name is required for insurance companies");
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
      email: this.email,
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
