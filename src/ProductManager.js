import fs from "fs";

class ProductManager {
  #products = [];
  id = 1;
  //constructor de la clase!
  constructor(ruta) {
    this.path = ruta;
  }

  //funciones
  async loaded() {
    try {
      const response = await fs.promises.readFile(this.path, "utf-8");
      const lineas = response
        .split("\n")
        .filter((objeto) => objeto.trim() !== "");
      lineas.forEach((product) => {
        const producto = JSON.parse(product);
        if (
          !this.#products.some(
            (existingProduct) => existingProduct.id === producto.id
          )
        ) {
          this.#products.push(producto);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getProducts() {
    try {
      await this.loaded();
      return this.#products;
    } catch (err) {
      console.log(err);
    }
  }

  async addProduct(product) {
    try {
      await this.loaded();
      if (!this.#products.some((producto) => producto.code === product.code)) {
        product.id = this.#products.length + 1;
        this.#products.push(product);
        const productJSON = JSON.stringify(product) + "\n";
        await fs.promises.appendFile(this.path, productJSON);
        console.log("producto agregado al archivo");
      } else {
        console.log(`El producto con código ${product.code} ya existe.`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getProductById(id) {
    await this.loaded();
    const producto = this.#products.find((producto) => producto.id === id);
    if (producto) {
      return producto;
    } else {
      console.log("producto no encontrado en la lista!");
      return false;
    }
  }

  async updateProduct(id, product) {
    await this.loaded();
    const index = this.#products.findIndex((producto) => producto.id === id);
    try {
      if (index !== -1) {
        product.id = id;
        this.#products[index] = product;
        const productsString = this.#products.map(
          (product) => JSON.stringify(product) + "\n"
        );
        await fs.promises.writeFile(this.path, productsString);
      } else {
        console.log("El ID no esta en la lista de productos!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProductById(id) {
    await this.loaded();
    try {
      if (this.#products.some((product) => product.id === id)) {
        this.#products = this.#products.filter((product) => product.id !== id);

        const productsString = this.#products.map(
          (product) => JSON.stringify(product) + "\n"
        );
        await fs.promises.writeFile(this.path, productsString);
        console.log(`Producto con ID ${id} eliminado`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//exportacion de la clase!
const productManager = new ProductManager("products.txt");
export { productManager };
