import { Response } from "express";
import mongoose from "mongoose";
import { Category } from "../../database/models/category.model";
import { responseMessage } from "../../helper";
import { StatusCode } from "../../common";
import { AuthRequest } from "../../middleware/auth.middleware";

const normalizeCategoryName = (name: string) => name.trim().toLowerCase();

const normalizeCategoryDescription = (description: unknown) =>
  typeof description === "string" ? description.trim() : "";

const safeText = (value: unknown) => (typeof value === "string" ? value : "");

const mapCategoryItem = (category: any, createdBy: any) => ({
  _id: category._id,
  name: category.name,
  description: category.description || "",
  isActive: category.isActive,
  isDeleted: category.isDeleted,
  createdBy,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const getAccessibleCollections = async (req: AuthRequest) => {
  if (req.user?.role === "ADMIN") {
    return Category.find({ isDeleted: false }).populate("createdBy", "name email role");
  }

  const own = await Category.findOne({
    createdBy: req.user?._id,
    isDeleted: false,
  }).populate("createdBy", "name email role");

  return own ? [own] : [];
};

const findCollectionByCategoryId = async (req: AuthRequest, categoryId: string) => {
  const filter: any = {
    isDeleted: false,
    "categories._id": categoryId,
  };

  if (req.user?.role !== "ADMIN") {
    filter.createdBy = req.user?._id;
  }

  return Category.findOne(filter).populate("createdBy", "name email role");
};

/* ================= CREATE CATEGORY ================= */
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const { name, description } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Category name is required" });
    }

    const normalizedName = normalizeCategoryName(name);
    const normalizedDescription = normalizeCategoryDescription(description);

    let categoryCollection = await Category.findOne({
      createdBy: req.user._id,
    }).populate("createdBy", "name email role");

    if (!categoryCollection) {
      categoryCollection = await Category.create({
        createdBy: req.user._id,
        categories: [{ name: normalizedName, description: normalizedDescription }],
      });
      categoryCollection = await categoryCollection.populate("createdBy", "name email role");
    } else {
      if (categoryCollection.isDeleted) {
        categoryCollection.isDeleted = false;
      }

      const duplicate = categoryCollection.categories.some(
        (cat: any) => !cat.isDeleted && cat.name === normalizedName
      );

      if (duplicate) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Category already exists" });
      }

      categoryCollection.categories.push({
        name: normalizedName,
        description: normalizedDescription,
      } as any);
      await categoryCollection.save();
    }

    const createdCategory = categoryCollection.categories
      .slice()
      .sort((a: any, b: any) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      })[0];

    return res.status(StatusCode.CREATED).json({
      message: responseMessage.addDataSuccess("Category"),
      category: mapCategoryItem(createdCategory, categoryCollection.createdBy),
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};

/* ================= GET ALL CATEGORIES ================= */
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const searchText = typeof search === "string" ? search.trim().toLowerCase() : "";
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);

    const collections = await getAccessibleCollections(req);

    const flattened = collections.flatMap((collection: any) =>
      (Array.isArray(collection.categories) ? collection.categories : [])
        .filter((cat: any) => !cat.isDeleted)
        .filter((cat: any) => {
          if (!searchText) return true;
          const nameText = safeText(cat.name).toLowerCase();
          const descriptionText = safeText(cat.description).toLowerCase();
          return (
            nameText.includes(searchText) || descriptionText.includes(searchText)
          );
        })
        .map((cat: any) => mapCategoryItem(cat, collection.createdBy))
    );

    flattened.sort((a: any, b: any) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    const total = flattened.length;
    const skip = (pageNum - 1) * limitNum;
    const categories = flattened.slice(skip, skip + limitNum);

    return res.status(StatusCode.OK).json({
      categories,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};

/* ================= GET CATEGORY BY ID ================= */
export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "Invalid category id",
      });
    }

    const collection = await findCollectionByCategoryId(req, id);

    if (!collection) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessage.getDataNotFound("Category"),
      });
    }

    const category = collection.categories.id(id as any);
    if (!category || category.isDeleted) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessage.getDataNotFound("Category"),
      });
    }

    return res.status(StatusCode.OK).json(mapCategoryItem(category, collection.createdBy));
  } catch (error) {
    console.error("GET CATEGORY BY ID ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "Invalid category id",
      });
    }

    const collection = await findCollectionByCategoryId(req, id);

    if (!collection) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessage.getDataNotFound("Category"),
      });
    }

    const category = collection.categories.id(id as any);
    if (!category || category.isDeleted) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessage.getDataNotFound("Category"),
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Category name is required" });
      }

      const normalizedName = normalizeCategoryName(name);
      const duplicate = collection.categories.some(
        (cat: any) =>
          !cat.isDeleted &&
          String(cat._id) !== String(id) &&
          cat.name === normalizedName
      );

      if (duplicate) {
        return res.status(StatusCode.BAD_REQUEST).json({
          message: "Category name already exists",
        });
      }

      category.name = normalizedName;
    }

    if (description !== undefined) {
      category.description = normalizeCategoryDescription(description);
    }

    await collection.save();

    return res.status(StatusCode.OK).json({
      message: responseMessage.updateDataSuccess("Category"),
      category: mapCategoryItem(category, collection.createdBy),
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};

/* ================= DELETE CATEGORY ================= */
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "Invalid category id",
      });
    }

    const collection = await findCollectionByCategoryId(req, id);
    if (!collection) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessage.getDataNotFound("Category"),
      });
    }

    const category = collection.categories.id(id as any);
    if (!category || category.isDeleted) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessage.getDataNotFound("Category"),
      });
    }

    category.isDeleted = true;
    await collection.save();

    return res.status(StatusCode.OK).json({
      message: responseMessage.deleteDataSuccess("Category"),
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};

/* ================= GET ALL ACTIVE CATEGORIES (for dropdowns) ================= */
export const getActiveCategoriesForDropdown = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const collections = await getAccessibleCollections(req);

    const categories = collections
      .flatMap((collection: any) =>
        Array.isArray(collection.categories) ? collection.categories : []
      )
      .filter((cat: any) => !cat.isDeleted && cat.isActive)
      .map((cat: any) => ({
        _id: cat._id,
        name: safeText(cat.name),
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return res.status(StatusCode.OK).json(categories);
  } catch (error) {
    console.error("GET CATEGORY DROPDOWN ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};
