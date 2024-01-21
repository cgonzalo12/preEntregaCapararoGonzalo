import { Router } from "express";
import { productManager } from "../ProductManager.js";
import { Product } from "../Product.js";
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

productsRoutes.get("/:id", async (req, res) => {
  const idp = req.params.id;
  const id = parseInt(idp);
  try {
    let product = await productManager.getProductById(id);
    return res.json(product);
  } catch (error) {
    console.log(error);
    res.send(`No se encontro ningun producto con el id ${id}`);
  }
});

productsRoutes.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const product = new Product(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    const response = await productManager.addProduct(product);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send(`Error al intentar agregar el producto!`);
  }
});

productsRoutes.put("/:id", async (req, res) => {
  const idp = req.params.id;
  const id = parseInt(idp);
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const product = new Product(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    const response = await productManager.updateProduct(id, product);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send(`Error al intentar actualizar el producto!`);
  }
});

productsRoutes.delete("/:id", async (req, res) => {
  const idp = req.params.id;
  const id = parseInt(idp);
  try {
    await productManager.deleteProductById(id);
    res.send("producto eliminado con exito");
  } catch (error) {
    console.log(error);
    res.send(`Error al intentar eliminar el producto`);
  }
});

export { productsRoutes };
