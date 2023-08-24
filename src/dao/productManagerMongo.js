import Product from './models/products.model.js';

class ProductManagerMongo {
  constructor() {
    this.products = [];
  }
  async addProduct(title, description, price, thumbnail, code, stock, category) {
    try {
      if (await Product.findOne({ code })) {
        throw new Error(`El producto con el código '${code}' ya existe.`);
      }

      const newProduct = new Product({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
      });

      await newProduct.save();
      console.log(`Producto agregado exitosamente: ${title}`);
    } catch (error) {
      console.error(`Error al agregar el producto: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.error(`Error al obtener los productos: ${error.message}`);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      console.error(`Error al obtener el producto por ID: ${error.message}`);
      return null;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        console.log(`Producto con id ${id} no encontrado`);
        return;
      }

      Object.assign(product, updatedFields);
      await product.save();

      console.log(`Se actualizó el producto: ${JSON.stringify(product)}`);
    } catch (error) {
      console.error('Error al actualizar el producto', error.message);
    }
  }

  async deleteProductById(id) {
    try {
      await Product.deleteOne({ _id: id });
      console.log(`Producto eliminado con ID: ${id}`);
    } catch (error) {
      console.error(`Error al eliminar el producto por ID: ${error.message}`);
    }
  }
}

export { ProductManagerMongo };
