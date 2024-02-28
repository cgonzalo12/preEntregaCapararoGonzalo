import { productModel } from "../public/schemas/products.schema.js";

//traer todos los productos
class ProductManager {
  static async getAll() {
    try {
      let products = await productModel.find().lean();
      return products;
    } catch (error) {
      console.log("problem loading mongo products: " + error);
    }
  }
  //productos con stock
  static async getAllWhithStock() {
    try {
      return productModel.find({ stock: { $gt: 0 } }).lean();
    } catch (error) {
      console.log("problem loading mongo products: " + error);
    }
  }
  //producto por _ID
  static async getById(id) {
    try {
      let product = await productModel.findOne({ _id: id }).lean();
      return product;
    } catch (error) {
      console.log("problem loading mongo product: " + error);
    }
  }
  //crear un producto
  static async add(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return false;
    } else {
      try {
        return new productModel({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        }).save();
      } catch (error) {
        console.log("problem creating the product: " + error);
      }
    }
  }

  //actualizar producto
  static async update(id, product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return false;
    } else {
      try {
        let updateProduct = await productModel.updateOne({ _id: id }, product);
        return updateProduct;
      } catch (error) {
        console.log("problems updating product in mongo: " + error);
      }
    }
  }
  //eliminar un producto!
  static async deleteOne(pid) {
    if (!pid) {
      return false;
    } else {
      try {
        let deleteProduct = await productModel.deleteOne({ _id: pid });
        return deleteProduct;
      } catch (error) {
        console.log("problems delete product in mongo: " + error);
      }
    }
  }
}
export default ProductManager;
