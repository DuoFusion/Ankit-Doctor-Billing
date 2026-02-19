import mongoose, { Document } from "mongoose";
import { MODEL, ROLE } from "../../common";

export interface IAuth extends Document {
  name: string;
  email: string;
  password: string;
  role: ROLE;
  isDeleted: boolean;
}

const authSchema = new mongoose.Schema<IAuth>(
  {
    name: {
      type: String,
      required: true, // ✅ FIX
      trim: true,
    },
    email: {
      type: String,
      required: true, // ✅ FIX
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // ✅ FIX
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IAuth>(MODEL.USER, authSchema);
