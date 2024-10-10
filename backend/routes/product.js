import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  addToCart,
} from "../controllers/product.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import your custom auth middleware

const productRouter = express.Router();

// Get all products
productRouter.get("/", getAllProducts);

// Create a product (requires authentication)
productRouter.post("/", authMiddleware, createProduct);

// Get a specific product by ID
productRouter.get("/:id", getProductById);

// Update an existing product (requires authentication)
productRouter.put("/:id", authMiddleware, editProduct);

// Delete a product (requires authentication)
productRouter.delete("/:id", authMiddleware, deleteProduct);

// Get products by category (optional filter)
productRouter.get("/category/:category", getProductsByCategory);

// Add a product to the cart (authentication may or may not be required depending on your logic)
productRouter.post("/:id/cart", authMiddleware, addToCart);

export default productRouter;
