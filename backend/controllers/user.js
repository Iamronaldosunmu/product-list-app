import Joi from "joi";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    min: 3,
  },
  last_name: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 3,
  },
  password: {
    type: String,
    required: true,
    min: 3,
  },
});

userSchema.methods.isValidPassword = async (password_supplied, user_password) => {
  const isValid = await bcrypt.compare(password_supplied, user_password);
  return isValid;
};

export const validateUser = (user) => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required(),
    password: Joi.string().min(8).max(80).required(),
  });
  return schema.validate(user);
};

export const validateUserLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required(),
    password: Joi.string().min(8).max(80).required(),
  });
  return schema.validate(user);
};

export const User = mongoose.model("User", userSchema);