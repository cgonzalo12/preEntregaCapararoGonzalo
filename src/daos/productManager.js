import { productModel } from "../../public/schemas/products.schema.js";

//traer todos los productos
class ProductManager {
  static async getAll(page, limit,_stock,_categoria) {
    try {
      if (_stock == undefined) {
        if (_categoria==undefined) {
          let products = await productModel.paginate({ }, { limit: limit, page: page, lean: true,sort: { price: 1 } });
          products.prevLink=products.hasPrevPage? `http://localhost:8080/products?pages=${products.prevPage}&limit=${limit}`:'';
          products.nextLink=products.hasNextPage? `http://localhost:8080/products?pages=${products.nextPage}&limit=${limit}`:'';
          return products;
        }else{
          let query={categoria:_categoria};

          let products = await productModel.paginate(query, { limit: limit, page: page, lean: true ,sort: { price: 1 }});
          products.prevLink=products.hasPrevPage? `http://localhost:8080/products?pages=${products.prevPage}&limit=${limit}&categoria=${_categoria}`:'';
          products.nextLink=products.hasNextPage? `http://localhost:8080/products?pages=${products.nextPage}&limit=${limit}&categoria=${_categoria}`:'';

          return products;
        }
      } else {
        if (_categoria==undefined) {
          let products = await productModel.paginate({stock: { $gt: 0 }}, { limit: limit, page: page, lean: true,sort: { price: 1 }});
          products.prevLink=products.hasPrevPage? `http://localhost:8080/products?pages=${products.prevPage}&limit=${limit}&stock=${_stock}`:'';
          products.nextLink=products.hasNextPage? `http://localhost:8080/products?pages=${products.nextPage}&limit=${limit}&stock=${_stock}`:'';
         return products;
        }else{
          let query={categoria:_categoria};
      
          let products = await productModel.paginate({stock: { $gt: 0 },query}, { limit: limit, page: page, lean: true,sort: { price: 1 } });
          products.prevLink=products.hasPrevPage? `http://localhost:8080/products?pages=${products.prevPage}&limit=${limit}&categoria=${_categoria}&stock=${_stock}`:'';
          products.nextLink=products.hasNextPage? `http://localhost:8080/products?pages=${products.nextPage}&limit=${limit}&categoria=${_categoria}&stock=${_stock}`:'';
          return products;
        }
        
      }
    } catch (error) {
      console.log("problem loading mongo products: " + error);
    }
  }
  //productos con stock
  static async getAllWhithStock() {
    try {
      let productStock = await productModel.find({ stock: { $gt: 0 } }).lean();
      return productStock;
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
  static async add(title, description, price,categoria, thumbnail, code, stock) {
    try {
      return new productModel({
        title,
        description,
        price,
        categoria,
        thumbnail,
        code,
        stock,
      }).save();
    } catch (error) {
      console.log("problem creating the product: " + error);
    }
  }

  //actualizar producto
  static async update(id, product) {
    try {
      return (updateProduct = await productModel.updateOne(
        { _id: id },
        product
      ));
    } catch (error) {
      console.log("problems updating product in mongo: " + error);
    }
  }
  //eliminar un producto!
  static async deleteOne(pid) {
    try {
      let deleteProduct = await productModel.deleteOne({ _id: pid });
      return deleteProduct;
    } catch (error) {
      console.log("problems delete product in mongo: " + error);
    }
  }
}
export default ProductManager;
