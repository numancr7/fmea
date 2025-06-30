import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name?: string;
  email: string;
  emailVerified?: Date | null;
  password: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  verificationToken?: string | null;
  verificationTokenExpiry?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiry?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true }, // Optional name field
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date, default: null }, // For NextAuth
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    avatar: {
      public_id: { type: String, required: false },
      url: { type: String, required: false },
    },
    verificationToken: { type: String, default: null },
    verificationTokenExpiry: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>('User', userSchema);
export default User;
