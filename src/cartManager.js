import fs from "fs";

export class cartManager {
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
}
