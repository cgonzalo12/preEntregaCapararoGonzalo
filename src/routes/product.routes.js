import { Router, query } from "express";
import ProductManager from "../daos/productManager.js";
import upload from "../utils/upload.middleware.js";
import sessionManager from "../daos/sessionManager.js";
import cartManager from "../daos/cartManager.js";

const routerProducts = Router();

//traer todos los productos y filtro de los que tienen sotck (mirar la parte de filtros /products?stock )
routerProducts.get("/", async (req, res) => {
  let session = req.session.user;
  let withStock = req.query.stock;
  let limit=req.query.limit;
  let categoria=req.query.categoria;
  let page=parseInt(req.query.pages)
  let sort=req.query.sort;
  sort=sort?sort:1;
  page=page?page:1;
  limit=limit?limit:10;
  let products;
  try {
    products = await ProductManager.getAll(page,limit,withStock,categoria,sort);
    if (session) {
      let user = await sessionManager.getUserById(session);
      let cart = await cartManager.getCartByUser(session);
      let idCart=cart?cart._id:"";
      products.docs.forEach(product => {
        product.idCart = idCart;
    });
      user.exist=true;
      res.render("products", { products, user});
    }else{
      res.render("products", { products });
    }
  } catch (error) {
    console.log("cannon get products from mongo: " + error)
  }
  
});

// Ruta para crear un nuevo producto
routerProducts.get("/new", (req, res) => {
  res.render("new-product");
});
// ruta para actualizar producto
routerProducts.get("/update/:pid", (req, res) => {
  let { pid } = req.params;
  res.render("updateProduct", { pid });
});

// Ruta para mostrar un producto con ID específico
routerProducts.get("/:id", async (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.redirect("/products/");
  }
  try {
    let product = await ProductManager.getById(id);
    if (!product) {
     res.render("404");
    }
    res.render("product", {
      _id: id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      isStock: product.stock > 0,
      stock: product.stock,
    });
  } catch (error) {
    console.log("cannon get product from mongo: "+ error);
  }
  
});

//eliminar un prodcuto con id

routerProducts.delete("/del/:pid", async (req, res) => {
  let { pid } = req.params;

  if (!pid) {
    return res.status(400).send({
      status: 400,
      result: "error",
      error: "incomplete id",
    });
  }

  try {
    let result = await ProductManager.deleteOne({ _id: pid });
    console.log("eliminamos 1 producto");
  } catch (error) {
    console.log("No se pudo eliminar el producto en Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error al actualizar los datos en la base de datos",
    });
  }
  res.redirect("/products/");
});
// actualizar producto
routerProducts.put("/up/:pid", async (req, res) => {
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
      error: "incomplete values algo no llego",
    });
  }

  try {
    let result = await ProductManager.update({ _id: pid }, productsToReplace);
  } catch (error) {
    console.log("Cannon update products on Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error update data on DB",
    });
  }
  res.redirect("/products");
});
//multer para img
routerProducts.post("/", upload.single("image"), async (req, res) => {
  let filename = req.file.filename;
  let product = req.body;
  try {
    await ProductManager.add(
      product.title,
      product.description,
      product.price,
      product.categoria,
      filename,
      product.code,
      product.stock
    );
  } catch (error) {
    console.log("cannon upload product from mongo: "+ error);
  }
  

  res.redirect("/products");
});

//actualizar
routerProducts.post("/update/:id", upload.single("image"), async (req, res) => {
  let pid = req.params.id;
  let filename = req.file.filename;
  let product = req.body;

  const productsToReplace = {
    title: product.title,
    description: product.description,
    price: product.price,
    thumbnail: filename,
    code: product.code,
    stock: product.stock,
  };

  try {
    const response = await fetch("http://localhost:8080/products/up/" + pid, {
      method: "PUT",
      body: JSON.stringify(productsToReplace),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Si la solicitud se completó correctamente, redirigir al usuario
      res.redirect("/products");
    } else {
      // Si hay un error en la respuesta, mostrar un mensaje de error
      alert("Hubo un error al actualizar el producto.");
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    alert("Hubo un error al actualizar el producto.");
  }
});

export default routerProducts;
