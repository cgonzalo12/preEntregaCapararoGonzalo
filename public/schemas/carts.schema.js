import { mongo, mongoose } from "mongoose";
const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  idUser: {
    type: String,
    index: true,
    required: true,
  },
  idProducts:{
    type:[
      {
        idProducts:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"products"
        }
      }
    ],
    default:[]
  },
  // idProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
});

export const cartModel = mongoose.model(cartsCollection, cartsSchema);
