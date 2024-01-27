import { productManager } from "./ProductManager.js";
import { Product } from "./Product.js";
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { productsRoutes } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
//inicializo express
const app = express();
//inicio handlebars
app.engine("handlebars", handlebars.engine()); //motor de plantilla
app.set("views", __dirname + "/views"); //indico donde estan las vi stas
app.set("view engine", "handlebars"); //indica el motor de plantilla q ya iniciamos arriba
app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   let user = {
//     name: "gonzalo",
//     last_name: "capararo",
//   };
//   res.render("index", user);
// });

app.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await productManager.getProducts();
    if (limit) {
      const products = products.slice(0, limit);
      res.render("index", products);
    }
    console.log(products);
    res.render("index", { name: "gonzalo", lastName: "capararo", products });
  } catch (error) {
    console.log(error);
    res.send("error !!!");
  }
});
//

app.use(express.json());
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRouter);

const port = 8080;

const server = app.listen(port, (req, res) => {
  console.log(`escuchando el puerto ${port}`);
});

//productos
const product1 = new Product(
  "producto prueba",
  "este es un producto prueba",
  2000,
  "sin imagen",
  "abc123",
  25
);

const product2 = new Product(
  "producto prueba2",
  "este es un producto prueba",
  2000,
  "sin imagen",
  "abc1234",
  25
);

const product3 = new Product(
  "producto prueba3",
  "este es un producto prueba",
  2000,
  "sin imagen",
  "abc12347",
  25
);

// const init = async () => {
//   await productManager.addProduct(product1);
//   await productManager.addProduct(product2);
//   await productManager.addProduct(product3);
// };
// init();
