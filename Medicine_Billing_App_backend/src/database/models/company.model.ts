//import { Types } from "joi";
import { Schema, model, Document,Types } from "mongoose";
import { MODEL } from "../../common";
export interface ICompany extends Document {
  userId:Types.ObjectId;
  companyName: string;
  gstNumber: string;
  address?: string;
  phone?: string;
  email?: string;
  state?: string;
  logo?: string;
  isActive: boolean;
  isDeleted:Boolean
}

const companySchema = new Schema<ICompany>(
  {
    userId: {
      type: Schema.Types.ObjectId,  
      ref:MODEL.USER,
      required: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    gstNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    state: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // store image filename
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

// Optional: index for faster search
companySchema.index({ gstNumber: 1 });

export const Company = model<ICompany>("Company", companySchema);
