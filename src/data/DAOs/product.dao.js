import Product from '../mongoDB/models/products.model.js';

class ProductDAO {

  async addProduct(productData) {
    if (typeof productData === 'object' && productData.title && productData.description) {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } else {
      throw new Error('Datos de producto no válidos');
    }
  }

  async getProducts() {
    return await Product.find();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async updateProduct(id, updatedFields) {
    const product = await Product.findById(id);
    if (!product) {
      return null;
    }

    Object.assign(product, updatedFields);
    await product.save();

    return product;
  }

  async deleteProductById(id) {
    await Product.deleteOne({ _id: id });
  }
}

export { ProductDAO };
