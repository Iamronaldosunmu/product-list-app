import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProduct,
  getProductsByCategory,
} from "../controller/product.js";
import authMiddleware from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);

productRouter.post("/", authMiddleware, createProduct);

productRouter.get("/:id", getProduct);

productRouter.put("/:id", authMiddleware, editProduct);

productRouter.delete("/:id", authMiddleware, deleteProduct);

productRouter.get("/category/:category", getProductsByCategory);

// productRouter.post("/:id/cart", authMiddleware, addToCart);

export default productRouter;
