import mongoose from "mongoose";
const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

export const prodctModel = mongoose.model(productsCollection, productsSchema);
