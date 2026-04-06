import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      // Not required because Google OAuth users won't have a password initially
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150?img=11',
    },
    role: {
      type: String,
      enum: ['rider', 'driver', 'admin'],
      default: 'rider',
    },
    googleId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }
  
  // If they have a password (i.e., not just Google OAuth), hash it
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // In case of Google-only users
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// THIS IS THE CRITICAL LINE THAT FIXES YOUR ERROR!
export default User;