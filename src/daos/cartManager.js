import { cartModel } from "../../public/schemas/carts.schema.js";

class cartManager {
  //agregar un carrito
  static async add(idUser, carts) {
    try {
      let cart = await new cartModel({
        idUser,
        carts,
      }).save();
      return cart;
    } catch (error) {
      console.log("problem creating the cart : " + error);
    }
  }

  //traer todos los carritos
  static async getCarts() {
    try {
      let carts = await cartModel.find().lean();
      return carts;
    } catch (error) {
      console.log("problem get the carts: " + error);
    }
  }
  //traer carrito con id
  static async getCart(id) {
    try {
      let cart = await cartModel.findOne({ _id: id }).lean();
      return cart;
    } catch (error) {
      console.log("problem loading mongo product: " + error);
    }
  }
  //Guardar producto en cart
  static async addProductTheCart(idCart, idProduct) {
    try {
      let cartUpdate = await this.getCart(idCart);
      cartUpdate.products.push(idProduct);
      const update = await cartModel.updateOne({ _id: idCart }, cartUpdate);
    } catch (error) {
      console.log("problem update the cart: " + error);
    }
    return update;
  }
}

export default cartManager;
