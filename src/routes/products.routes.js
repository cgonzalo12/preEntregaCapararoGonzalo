import { Router } from "express";
import { productManager } from "../ProductManager.js";
const productsRoutes = Router();
productsRoutes.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await productManager.getProducts();
    if (limit) {
      const limitProducts = products.slice(0, limit);
      return res.json(limitProducts);
    }
    return res.json(products);
  } catch (error) {
    console.log(error);
    res.send("error !!!");
  }
});

export { productsRoutes };
