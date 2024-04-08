import cartManager from "../daos/cartManager.js";
import { Router } from "express";

const cartsRouter = Router();
//traer carts
cartsRouter.get("/", async (req, res) => {
  try {
    let carts = await cartManager.getCarts();

    res.render("carts", { carts });
  } catch (error) {
    console.log("Error al cargar las carts " + error);
  }
});
//crear un cart ( no sirve?)
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

//Taer un cart
cartsRouter.get("/cart/:idCart", async (req, res) => {
  const id = req.params.idCart;

  try {
    const cart = await cartManager.getCart(id);
    const products = cart.idProducts.map(item => item.idProducts);
    res.render("cart", { _id: id,
      idUser: cart.idUser,
      products: products
    });
  } catch (error) {
    res.send(`error id no valido ${id}`);
  }
});
//Agregar producto al cart
cartsRouter.put("/:idCart/product/:pid", async (req, res) => {
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
  res.redirect("/products");
});
//eliminar producto del cart
cartsRouter.delete("/:idCart/product/:pid", async (req, res) => {
  const idCart = req.params.idCart;
  const idProduct = req.params.pid;
  try {
    const response = await cartManager.deleteProductTheCart(idCart, idProduct);
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
//eliminar productos del carrito
cartsRouter.delete("/cart/:idCart", async (req, res) => {
  const idCart = req.params.idCart;
  try {
    const response = await cartManager.deleteAllProductt(idCart);
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
////////////////////////////////////////////////////////
cartsRouter.delete("/:CId",async(req,res)=>{
  const id=req.params.CId;
  if (!id) {
    return res.status(400).send({
      status: 400,
      result: "error",
      error: "incomplete id",
    });
  }

  try {
    let cartDB = await cartManager.deleteCart({_id:id})
    console.log("eliminamos un cart");
  } catch (error) {
    console.log("no se pudo elimninar el producto en mongo :"+error);
    res.status(500).send({
      status: 500,
      result: "error",
      error: "error al eliminar los datos en la base de datos",
    });
  }
})



export { cartsRouter };
