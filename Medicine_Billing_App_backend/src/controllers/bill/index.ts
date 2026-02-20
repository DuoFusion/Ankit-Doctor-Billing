import { Request, Response } from "express";
import mongoose from "mongoose";
import { Bill } from "../../database/models/bill.model";
import { BillItem } from "../../database/models/billItem.model";
import { Product } from "../../database/models/product.model";

interface AuthRequest extends Request {
  user?: any;
}

/* =========================
   CREATE BILL
========================= */
export const createBill = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { companyId, items, discount = 0 } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "companyId required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items required" });
    }

    let subTotal = 0;
    let totalTax = 0;

    const billItems: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const it = items[i];

      if (!it.productId || !it.qty || !it.rate) {
        return res.status(400).json({ message: "Invalid item data" });
      }

      const product = await Product.findById(it.productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      const qty = Number(it.qty);
      const freeQty = Number(it.freeQty || 0);
      const rate = Number(it.rate);
      const taxPercent = Number(it.taxPercent || 0);
      const discountPercent = Number(it.discount || 0);

      const totalQty = qty + freeQty;

      if (product.stock < totalQty) {
        return res.status(400).json({
          message: `Stock not enough for ${product.name}`,
        });
      }

      const amount = rate * qty;
      const discountAmt = (amount * discountPercent) / 100;
      const taxable = amount - discountAmt;

      const cgst = (taxable * taxPercent) / 200;
      const sgst = (taxable * taxPercent) / 200;
      const total = taxable + cgst + sgst;

      subTotal += taxable;
      totalTax += cgst + sgst;

      billItems.push({
        srNo: i + 1,
        productId: product._id,
        productName: product.name,
        category: product.category || "",

        qty,
        freeQty,
        mrp: product.mrp,
        rate,

        taxPercent,
        cgst,
        sgst,

        discount: discountPercent,
        total,
      });

      // 🔽 stock reduce
      product.stock -= totalQty;
      await product.save();
    }

    const grandTotal = subTotal + totalTax - Number(discount);

    const bill = await Bill.create({
      billNo: `BILL-${Date.now()}`,
      companyId,
      userId: req.user?._id,
      subTotal,
      totalTax,
      discount,
      grandTotal,
    });

    billItems.forEach(b => (b.billId = bill._id));
    await BillItem.insertMany(billItems);

    res.status(201).json({
      message: "Bill created successfully",
      billId: bill._id,
    });
  } catch (err: any) {
    console.error("CREATE BILL ERROR 👉", err.message);

    res.status(500).json({
      message: err.message || "Bill creation failed",
    });
  }
};


/* =========================
   GET ALL BILLS
========================= */
export const getAllBills = async (req: AuthRequest, res: Response) => {
  try {
    const { role, _id: userId } = req.user!;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    /* ---------------- FILTER ---------------- */

    const filter: any = {
      isDeleted: false,
    };

    // USER → only own bills
    if (role !== "ADMIN") {
      filter.userId = userId;
    }

    // SEARCH
    if (search) {
      filter.$or = [
        { billNo: { $regex: search, $options: "i" } },
      ];
    }

    /* ---------------- QUERY ---------------- */

    const bills = await Bill.find(filter)
      .populate("companyId", "companyName gstNumber logo address phone email state")
      .populate("userId", "name email phone address role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bill.countDocuments(filter);

    res.json({
      data: bills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bills",
    });
  }
};



/* =========================
   GET BILL BY ID (WITH ITEMS)
========================= */
export const getBillById = async (req: AuthRequest, res: Response) => {
  try {
    const bill = await Bill.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("companyId", "companyName gstNumber logo address phone email state")
      .populate("userId", "name email phone address role");

    if (!bill)
      return res.status(404).json({ message: "Bill not found" });

    // 🔐 AUTH s
    if (
      req.user?.role !== "ADMIN" &&
      bill.userId._id.toString() !== req.user?._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const items = await BillItem.find({ billId: bill._id });

    res.json({ bill, items });
  } catch {
    res.status(500).json({ message: "Failed to fetch bill" });
  }
};



/* =========================
   DELETE BILL (SOFT)
========================= */
export const deleteBill = async (req: AuthRequest, res: Response) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    const isAdmin = req.user?.role === "ADMIN";
    const isOwner = bill.userId.toString() === req.user?._id?.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not allowed" });
    }

    bill.isDeleted = true;
    await bill.save();

    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const updateBill = async (req: AuthRequest, res: Response) => {
  try {
    const bill = await Bill.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!bill)
      return res.status(404).json({ message: "Bill not found" });

    // 🔐 AUTH
    const isAdmin = req.user?.role === "ADMIN";
    const isOwner = bill.userId.toString() === req.user?._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { companyId, items, discount } = req.body;

    if (companyId) {
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({ message: "Invalid companyId" });
      }
      bill.companyId = companyId;
    }

    if (Array.isArray(items) && items.length > 0) {
      const previousItems = await BillItem.find({ billId: bill._id });

      // Restore previous stock before applying new items.
      for (const oldItem of previousItems) {
        const product = await Product.findById(oldItem.productId);
        if (product) {
          product.stock += Number(oldItem.qty || 0) + Number(oldItem.freeQty || 0);
          await product.save();
        }
      }

      let subTotal = 0;
      let totalTax = 0;
      const nextItems: any[] = [];

      for (let i = 0; i < items.length; i++) {
        const it = items[i];

        if (!it.productId || !it.qty || !it.rate) {
          return res.status(400).json({ message: "Invalid item data" });
        }

        if (!mongoose.Types.ObjectId.isValid(it.productId)) {
          return res.status(400).json({ message: "Invalid productId in items" });
        }

        const product = await Product.findById(it.productId);
        if (!product) {
          return res.status(400).json({ message: "Product not found" });
        }

        const qty = Number(it.qty);
        const freeQty = Number(it.freeQty || 0);
        const rate = Number(it.rate);
        const taxPercent = Number(it.taxPercent || 0);
        const discountPercent = Number(it.discount || 0);
        const totalQty = qty + freeQty;

        if (qty <= 0 || rate <= 0) {
          return res.status(400).json({ message: "Invalid qty/rate in items" });
        }

        if (product.stock < totalQty) {
          return res.status(400).json({
            message: `Stock not enough for ${product.name}`,
          });
        }

        const amount = rate * qty;
        const discountAmt = (amount * discountPercent) / 100;
        const taxable = amount - discountAmt;
        const cgst = (taxable * taxPercent) / 200;
        const sgst = (taxable * taxPercent) / 200;
        const total = taxable + cgst + sgst;

        subTotal += taxable;
        totalTax += cgst + sgst;

        nextItems.push({
          billId: bill._id,
          srNo: i + 1,
          productId: product._id,
          productName: product.name,
          category: product.category || "",
          qty,
          freeQty,
          mrp: product.mrp,
          rate,
          taxPercent,
          cgst,
          sgst,
          discount: discountPercent,
          total,
        });

        product.stock -= totalQty;
        await product.save();
      }

      await BillItem.deleteMany({ billId: bill._id });
      await BillItem.insertMany(nextItems);

      bill.subTotal = subTotal;
      bill.totalTax = totalTax;
    }

    bill.discount = Number(discount ?? bill.discount ?? 0);
    bill.grandTotal = Number(bill.subTotal || 0) + Number(bill.totalTax || 0) - bill.discount;

    await bill.save();

    res.json({
      message: "Bill updated successfully",
      bill,
    });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};
