import { isValidObjectId } from "mongoose";
import { Product, validateProduct } from "../models/product.js";

// Helper function to get pagination data
const getPaginationData = async (model, query, pageLimit) => {
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / pageLimit);
  return { totalItems, totalPages };
};

// Get all products with pagination and optional filters
export const getAllProducts = async (req, res) => {
  const pageLimit = parseInt(req.query.limit) || 20; // Allow dynamic limit per page from query
  const currentPage = parseInt(req.query.page) || 1;

  const nameQuery = req.query.name ? { name: new RegExp(req.query.name, "i") } : {};
  const categoryQuery = req.query.category ? { category: new RegExp(req.query.category, "i") } : {};

  const sort = {};
  if (req.query.sortBy === "price") {
    sort.price = 1; // Ascending
  } else if (req.query.sortBy === "timestamp") {
    sort.createdAt = -1; // Descending
  }
  // Retrieve products with pagination
  const products = await Product.find({
    ...nameQuery,
    ...categoryQuery,
  })
    .limit(pageLimit)
    .skip((currentPage - 1) * pageLimit)
    .sort(sort);

  // Get pagination data
  const { totalItems, totalPages } = await getPaginationData(Product, { ...nameQuery, ...categoryQuery }, pageLimit);

  return res.status(200).json({
    products,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageLimit,
    },
  });
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return res.status(400).json({ message: "This ID is not valid!" });

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found!" });

  return res.status(200).json(product);
};

// Create a new product
export const createProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const productExists = await Product.findOne({ name: req.body.name });
  if (productExists) return res.status(400).json({ message: "This product name already exists!" });

  const product = new Product({
    ...req.body,
    createdBy: req.user._id,
  });

  console.log(req.user);

  const result = await product.save();

  return res.status(201).json({
    message: "Product created successfully!",
    product: result,
  });
};

// Update an existing product
export const editProduct = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return res.status(400).json({ message: "This ID is not valid!" });

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found!" });

  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.price = req.body.price || product.price;
  product.category = req.body.category || product.category;

  const updatedProduct = await product.save();

  return res.status(200).json({
    message: "Product updated successfully!",
    product: updatedProduct,
  });
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return res.status(400).json({ message: "This ID is not valid!" });

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found!" });

  const deletedProduct = await Product.findByIdAndDelete(id);

  return res.status(202).json({
    message: "Product deleted successfully!",
    deletedProduct,
  });
};

// Get products by category with pagination
export const getProductsByCategory = async (req, res) => {
  const pageLimit = parseInt(req.query.limit) || 10; // Dynamic limit per page
  const currentPage = parseInt(req.query.page) || 1;
  const category = req.query.category;

  if (!category) return res.status(400).json({ message: "Category is required!" });

  // Retrieve products by category with pagination
  const products = await Product.find({ category: new RegExp(category, "i") })
    .limit(pageLimit)
    .skip((currentPage - 1) * pageLimit);

  // Get pagination data
  const { totalItems, totalPages } = await getPaginationData(Product, { category: new RegExp(category, "i") }, pageLimit);

  if (!products.length) return res.status(404).json({ message: "No products found for this category!" });

  return res.status(200).json({
    products,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageLimit,
    },
  });
};

export const getProductsByUser = async (req, res) => {
  const pageLimit = parseInt(req.query.limit) || 20; 
  const currentPage = parseInt(req.query.page) || 1;
  const userId = req.user._id; 
  console.log(req.user);

  if (!isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user ID!" });

  const products = await Product.find({ createdBy: userId })
    .limit(pageLimit)
    .skip((currentPage - 1) * pageLimit)
    .sort({ dateAdded: -1 });

  const { totalItems, totalPages } = await getPaginationData(Product, { createdBy: userId }, pageLimit);

  if (!products.length) return res.status(404).json({ message: "No products found for this user!" });

  return res.status(200).json({
    products,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageLimit,
    },
  });
};