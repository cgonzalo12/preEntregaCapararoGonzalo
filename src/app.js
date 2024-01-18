const ProductManager = require("./ProductManager");
const Product = require("./Product");
const express = require("express");
const app = express();
const port = 8080;

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

const init = async () => {
  await ProductManager.addProduct(product1);
  await ProductManager.addProduct(product2);
  await ProductManager.addProduct(product3);
};
app.get("/", (req, res) => {
  res.send("<h1>hola mundo</h1>");
});
app.get("/usuario", (req, res) => {
  res.send({ id: 1, user: "pepito", pos: [] });
});

app.listen(port, () => {
  console.log(`estamos escuchando el pueto ${port}`);
});
