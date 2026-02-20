import mongoose from "mongoose";
import { MODEL } from "../../common";

export interface ICategoryItem {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryCollection extends mongoose.Document {
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  categories: mongoose.Types.DocumentArray<ICategoryItem & mongoose.Types.Subdocument>;
}

const categoryItemSchema = new mongoose.Schema<ICategoryItem>(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const categorySchema = new mongoose.Schema<ICategoryCollection>(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL.USER,
      required: true,
      unique: true,
    },
    categories: { type: [categoryItemSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategoryCollection>(MODEL.CATEGORY, categorySchema);

export const ensureCategoryCollectionIndexes = async () => {
  try {
    const indexes = await Category.collection.indexes();
    const hasLegacyNameIndex = indexes.some((index) => index.name === "name_1");

    if (hasLegacyNameIndex) {
      await Category.collection.dropIndex("name_1");
      console.log("Dropped legacy category index: name_1");
    }
  } catch (error: any) {
    if (error?.codeName !== "IndexNotFound") {
      console.error("CATEGORY INDEX CLEANUP ERROR:", error);
    }
  }
};
