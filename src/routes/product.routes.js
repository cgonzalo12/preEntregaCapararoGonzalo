import { Router } from "express";
import { prodctModel } from "../models/product.model.js";
import { ppid } from "process";

const ProductRouter = Router();

//traer todos los productos
ProductRouter.get("/", async (req, res) => {
  try {
    let products = await prodctModel.find();
    res.status(200).send({
      status: 200,
      result: "success",
      payload: products,
    });
  } catch (error) {
    console.log("Cannon get products from Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error getting data from DB",
    });
  }
});

//crear un producto
ProductRouter.post("/", async (req, res) => {
  let { title, description, price, thumbnail, code, stock } = req.body;
  if (!title || !description || !price || !thumbnail || !code || !stock) {
    res.status(400).send({
      status: 400,
      result: "error",
      error: "incomplete values",
    });
  }

  try {
    let result = await prodctModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    res.status(200).send({
      status: 200,
      result: "success",
      payload: result,
    });
  } catch (error) {
    console.log("Cannon save products on Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error saving data on DB",
    });
  }
});

// actualizar producto
ProductRouter.put("/:pid", async (req, res) => {
  let { pid } = req.params;

  let productsToReplace = req.body;
  if (
    !productsToReplace.title ||
    !productsToReplace.description ||
    !productsToReplace.price ||
    !productsToReplace.thumbnail ||
    !productsToReplace.code ||
    !productsToReplace.stock ||
    !pid
  ) {
    res.status(400).send({
      status: 400,
      result: "error",
      error: "incomplete values",
    });
  }

  try {
    let result = await prodctModel.updateOne({ _id: pid }, productsToReplace);

    res.status(200).send({
      status: 200,
      result: "success",
      payload: result,
    });
  } catch (error) {
    console.log("Cannon update products on Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error update data on DB",
    });
  }
});

//eliminar un prodcuto con id

ProductRouter.delete("/:pid", async (req, res) => {
  let { pid } = req.params;

  if (!pid) {
    res.status(400).send({
      status: 400,
      result: "error",
      error: "incomplete id",
    });
  }

  try {
    let result = await prodctModel.deleteOne({ _id: pid });

    res.status(200).send({
      status: 200,
      result: "success",
      payload: result,
    });
  } catch (error) {
    console.log("Cannon delete products on Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error update data on DB",
    });
  }
});
export default ProductRouter;
