import { log } from "console";
import fs from "fs";

class cartManager {
  constructor() {
    this.path = "cart.txt";
    this.carts = [];
  }
  //metodos de la clase
  getCarts = async () => {
    const respuesta = await fs.promises.readFile(this.path, "utf8");
    const resJson = JSON.parse(respuesta);
    return resJson;
  };

  getCart = async (id) => {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => {
      cart.id === id;
    });
    if (cart) {
      return cart.products;
    } else {
      console.log(`carrito no encontrado con el id ${id}`);
    }
  };

  newCart = async () => {
    this.carts = await this.getCarts();
    const id = this.carts.lenth + 1;
    const newCart = { id, products: [] };
    this.carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    return newCart;
  };

  addProductTheCart = async (cartID, idProduct) => {
    const listCarts = await this.getCarts();
    const index = listCarts.findIndex((cart) => cart.id === cartID);
    if (index !== -1) {
      cartProducts = await this.getCart(cartID);
      const productIndex = cartProducts.findIndex(
        (product) => product.id === idProduct
      );
      if (productIndex !== -1) {
        cartProducts[productIndex].quantity =
          cartProducts[productIndex].quantity + 1;
      } else {
        cartProducts.push({ idProduct, quantity: 1 });
      }
      listCarts[index].products = cartProducts;
      await fs.promises.writeFile(this.path, JSON.stringify(listCarts));
      console.log("producto agregado exitosamente!!");
    } else {
      console.log(`carrito no encontrado con el id: ${cartID}`);
    }
  };
}
//cart manager
const CartManager = new cartManager();
export { CartManager };
