import { Router } from "express";
import ProductManager from "../daos/productManager.js";
import upload from "../utils/upload.middleware.js";

const routerProducts = Router();

//traer todos los productos y filtro de los que tienen sotck (mirar la parte de filtros /products?stock )
routerProducts.get("/", async (req, res) => {
  let withStock = req.query.stock;

  let products;
  if (withStock === undefined) {
    products = await ProductManager.getAll();
  } else {
    products = await ProductManager.getAllWhithStock();
  }

  res.render("products", { products });
});
// Ruta para crear un nuevo producto
routerProducts.get("/new", (req, res) => {
  res.render("new-product");
});

// Ruta para mostrar un producto con ID específico
routerProducts.get("/:id", async (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/products/");
  }

  let product = await ProductManager.getById(id);

  if (!product) {
    res.render("404");
  }

  res.render("product", {
    title: product.title,
    description: product.description,
    price: product.price,
    thumbnail: product.thumbnail,
    code: product.code,
    isStock: product.stock > 0,
  });
});

// actualizar producto
// routerProducts.put("/:pid", async (req, res) => {
//   let { pid } = req.params;

//   let productsToReplace = req.body;
//   if (
//     !productsToReplace.title ||
//     !productsToReplace.description ||
//     !productsToReplace.price ||
//     !productsToReplace.thumbnail ||
//     !productsToReplace.code ||
//     !productsToReplace.stock ||
//     !pid
//   ) {
//     res.status(400).send({
//       status: 400,
//       result: "error",
//       error: "incomplete values",
//     });
//   }

//   try {
//     let result = await prodctModel.updateOne({ _id: pid }, productsToReplace);

//     res.status(200).send({
//       status: 200,
//       result: "success",
//       payload: result,
//     });
//   } catch (error) {
//     console.log("Cannon update products on Mongo:" + error);
//     res.status(500).send({
//       status: 500,
//       result: "error",
//       error: "error update data on DB",
//     });
//   }
// });

//eliminar un prodcuto con id

routerProducts.delete("/:pid", async (req, res) => {
  let { pid } = req.params;

  if (!pid) {
    res.status(400).send({
      status: 400,
      result: "error",
      error: "incomplete id",
    });
  }

  try {
    let result = await ProductManager.deleteOne({ _id: pid });
  } catch (error) {
    console.log("Cannon delete products on Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error update data on DB",
    });
  }
});

//multer para img
routerProducts.post("/", upload.single("image"), async (req, res) => {
  let filename = req.file.filename;
  let product = req.body;

  await ProductManager.add(
    product.title,
    product.description,
    product.price,
    filename,
    product.code,
    product.stock
  );

  res.redirect("/products");
});

export default routerProducts;
