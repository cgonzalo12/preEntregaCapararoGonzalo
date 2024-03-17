import { mongoose } from "mongoose";
const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: Array,
    required: true,
  },
  idUser: {
    type: String,
    index: true,
    required: true,
  },
  idProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
});

export const cartModel = mongoose.model(cartsCollection, cartsSchema);
