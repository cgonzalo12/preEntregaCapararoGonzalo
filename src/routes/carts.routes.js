import cartManager from "../daos/cartManager.js";
import { Router } from "express";

const cartsRouter = Router();

cartsRouter.get("/", async (req, res) => {
  try {
    let carts = await cartManager.getCarts();

    res.render("carts", { carts });
  } catch (error) {
    console.log("Error al cargar las carts " + error);
  }
});

cartsRouter.post("/:idUser", async (req, res) => {
  const idUser = req.params.idUser;
  let cart = [];
  try {
    const response = await cartManager.add(idUser, cart);
    res.redirect("/carts");
  } catch (error) {
    res.send("error al crear carrito");
  }
});

cartsRouter.get("/cart/:idCart", async (req, res) => {
  const id = req.params.idCart;
  try {
    const cart = await cartManager.getCart(id);
    res.render("cart", { cart });
  } catch (error) {
    res.send(`error id no valido ${id}`);
  }
});

cartsRouter.post("/:idCart/product/:pid", async (req, res) => {
  const idCart = req.params.idCart;
  const idProduct = req.params.pid;
  try {
    const response = await cartManager.addProductTheCart(idCart, idProduct);
  } catch (error) {
    console.log("Cannon update products on Mongo:" + error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error update data on DB",
    });
  }
});

export { cartsRouter };
