import Joi from "joi";
import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  image_url: {
    type: String,  // URL to the product image
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

// Define a Joi validation function for creating/updating a product
export const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(3).max(50).required(),
    image_url: Joi.string().uri().required(),  // Ensuring the image is a valid URL
  });
  return schema.validate(product);
};

// Create the Mongoose model for the Product
export const Product = mongoose.model("Product", productSchema);
