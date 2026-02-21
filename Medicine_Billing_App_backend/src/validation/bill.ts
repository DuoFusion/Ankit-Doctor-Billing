import Joi from "joi";

/* =========================
   ITEM SCHEMA
========================= */
const billItemSchema = Joi.object({
  productId: Joi.string().required(),

  qty: Joi.number().positive().required(),
  freeQty: Joi.number().min(0).optional(),

  rate: Joi.number().positive().required(),
  mrp: Joi.number().positive().optional(),

  taxPercent: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).optional(),
});

/* =========================
   CREATE BILL
========================= */
export const createBillSchema = Joi.object({
  companyId: Joi.string().required(),

  discount: Joi.number().min(0).optional(),

  items: Joi.array()
    .items(billItemSchema)
    .min(1)
    .required(),
});

/* =========================
   UPDATE BILL
========================= */
export const updateBillSchema = Joi.object({
  discount: Joi.number().min(0).required(),
});

/* =========================
   ID PARAM
========================= */
export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});
