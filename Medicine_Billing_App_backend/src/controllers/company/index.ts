import { Request, Response } from "express";
import { Company } from "../../database/models/company.model";
import { responseMessage } from "../../helper";
import { StatusCode } from "../../common";
import { AuthRequest } from "../../middleware/auth.middleware";

// ================= CREATE =================
export const createCompany = async (
  req:AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const {
      companyName,
      gstNumber,
      address,
      phone,
      email,
      state,
    } = req.body;


    const newCompany = await Company.create({
      userId: req.user._id,
      companyName,
      gstNumber,
      address,
      phone,
      email,
      state,
      logo: req.file?.filename,
      isDeleted: false,
    });

    res.status(201).json(newCompany);
  } catch (error: any) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllCompanies = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { isDeleted: false };

    // 🔐 Role based access
    if (req.user?.role !== "ADMIN") {
      filter.userId = req.user?._id;
    }

    // 🔍 Search
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { gstNumber: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
      ];
    }

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Company.countDocuments(filter),
    ]);

    return res.status(StatusCode.OK).json({
      companies,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("GET COMPANIES ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};


// ================= GET SINGLE =================
export const getSingleCompany = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const isAdmin = req.user.role === "ADMIN";

    const filter: any = { _id: id, isDeleted: false };

    if (!isAdmin) {
      filter.userId = req.user._id;
    }

    const company = await Company.findOne(filter);

    if (!company) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: responseMessage.getDataNotFound("Company"),
      });
    }

    return res.status(StatusCode.OK).json({ company });

  } catch (error) {
    console.error("GET SINGLE COMPANY ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};


// ================= UPDATE =================
export const updateCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (
      req.user?.role !== "admin" &&
      company.userId.toString() !== req.user?._id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ❌ prevent logo update
    delete req.body.logo;

    const allowedFields = [
      "companyName",
      "gstNumber",
      "email",
      "phone",
      "state",
      "address",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (company as any)[field] = req.body[field];
      }
    });

    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




// ================= DELETE (SOFT DELETE) =================
export const deleteCompany = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const isAdmin = req.user.role === "ADMIN";

    const filter: any = { _id: id, isDeleted: false };

    if (!isAdmin) {
      filter.userId = req.user._id;
    }

    const company = await Company.findOneAndUpdate(
      filter,
      { isDeleted: true },
      { new: true }
    );

    if (!company) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: "Not allowed or company not found",
      });
    }

    return res.status(StatusCode.OK).json({
      message: responseMessage.deleteDataSuccess("Company"),
    });

  } catch (error) {
    console.error("DELETE COMPANY ERROR:", error);
    return res.status(StatusCode.INTERNAL_ERROR).json({
      message: responseMessage.internalServerError,
    });
  }
};
