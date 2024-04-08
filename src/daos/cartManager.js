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
      let cart = await cartModel.findOne({ _id: id }).populate("idProducts.idProducts").lean();
      return cart;
    } catch (error) {
      console.log("problem loading mongo product: " + error);
    }
  }
  //Guardar producto en cart
  static async addProductTheCart(idCart, idProduct) {
    try {
      let cartUpdate = await this.getCart(idCart);
      cartUpdate.idProducts.push({idProducts:idProduct})
      const update = await cartModel.updateOne({ _id: idCart }, cartUpdate);
    } catch (error) {
      console.log("problem update the cart: " + error);
    }
  }
  //eliminar producto en cart
  static async deleteProductTheCart(idCart, idProduct) {
    try {
      let cartUpdate = await this.getCart(idCart);

      cartUpdate.idProducts = cartUpdate.idProducts.filter(productId => productId.idProducts._id.toString() !== idProduct);
  
   
      const update = await cartModel.updateOne({ _id: idCart }, cartUpdate);
    } catch (error) {
      console.log("problem update the cart: " + error);
    }
  }
  //eliminar productos del carrito
  static async deleteAllProductt(idCart){
    try {
      let cartUpdate = await this.getCart(idCart);
      cartUpdate.idProducts = [];
      const update = await cartModel.updateOne({ _id: idCart }, cartUpdate);
    } catch (error) {
      console.log(error);
    }
  }
  
  //eliminar cart
  static async deleteCart(idCart){
    try {
      const cartDelete=await cartModel.deleteOne({_id : idCart});
      return cartDelete;
    } catch (error) {
      console.log(error);
    }
  }


}

export default cartManager;
