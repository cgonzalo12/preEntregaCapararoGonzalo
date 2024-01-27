import { productManager } from "./ProductManager.js";
import { Product } from "./Product.js";
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { productsRoutes } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";
const port = 8080;
//inicializo express
const app = express();

//socket

const httpServer = app.listen(port, (req, res) => {
  console.log(`escuchando el puerto ${port}`);
});
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado!");
});
//inicio handlebars
app.engine("handlebars", handlebars.engine()); //motor de plantilla
app.set("views", __dirname + "/views"); //indico donde estan las vi stas
app.set("view engine", "handlebars"); //indica el motor de plantilla q ya iniciamos arriba
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use("/products", productsRoutes);
app.use("/api/carts", cartsRouter);
app.use("/socket", viewsRouter);

//productos
const product1 = new Product(
  "producto prueba",
  "este es un producto prueba",
  1500,
  "sin imagen",
  "abc123",
  10
);

const product2 = new Product(
  "producto prueba2",
  "este es un producto prueba",
  22000,
  "sin imagen",
  "abc1234",
  2
);

const product3 = new Product(
  "producto prueba3",
  "este es un producto prueba",
  100,
  "sin imagen",
  "abc12347",
  25
);
const product4 = new Product(
  "producto prueba4",
  "producto prueba 4",
  10,
  "sin imagen",
  "abc1234722",
  5
);

// const init = async () => {
//   await productManager.addProduct(product1);
//   await productManager.addProduct(product2);
//   await productManager.addProduct(product3);
//   await productManager.addProduct(product4);
// };
// init();
