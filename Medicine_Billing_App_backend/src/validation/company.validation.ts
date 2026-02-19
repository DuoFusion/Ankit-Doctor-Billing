import Joi from "joi";

export const createCompanySchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().trim().optional(),
  address: Joi.string().trim().optional()
});

export const updateCompanySchema = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().trim().optional(),
  address: Joi.string().trim().optional()
});
