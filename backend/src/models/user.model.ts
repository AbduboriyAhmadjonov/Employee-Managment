import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'employee' | 'admin' | 'staff' | 'hr';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'admin', 'staff', 'hr'], required: true },
    profileImage: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
