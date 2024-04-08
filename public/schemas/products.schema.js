import mongoose from "mongoose";
const productsCollection = "products";
import mongoosePaginate from "mongoose-paginate-v2"

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
  categoria:{
    type: String,
    required:true,
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
ProductsSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productsCollection, ProductsSchema);
