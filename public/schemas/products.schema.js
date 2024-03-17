import mongoose from "mongoose";
const productsCollection = "products";

const ProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  code: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
  },
});

export const productModel = mongoose.model(productsCollection, ProductsSchema);
