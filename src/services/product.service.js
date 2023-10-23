import { ProductDAO } from "../data/DAOs/product.dao.js";
import { ErrorMessages } from "../errors/errorsNum.js";
import CustomErrors from "../errors/customErrors.js";

class ProductService {
  constructor() {
    this.productDAO = new ProductDAO();
  }

  async addProduct(title, description, price, thumbnail, code, stock, category) {
    try {
      return await this.productDAO.addProduct(title, description, price, thumbnail, code, stock, category);
    } catch (error) {
      //throw new Error('Error al agregar el producto: ' + error.message);
      CustomErrors.generateError(ErrorMessages.CREATE_PRODUCT_ERROR);
      
    }
  }

  async getProducts() {
    return await this.productDAO.getProducts();
  }

  async getProductById(id) {
    try {
      const product = await this.productDAO.getProductById(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      //throw new Error('Error al obtener el producto por ID: ' + error.message);
      CustomErrors.generateError(ErrorMessages.PRODUCTID_NOT_FOUND);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const updatedProduct = await this.productDAO.updateProduct(id, updatedFields);
      if (!updatedProduct) {
        throw new Error('Producto no encontrado');
      }
      return updatedProduct;
    } catch (error) {
      throw new Error('Error al actualizar el producto: ' + error.message);
    }
  }

  async deleteProductById(id) {
    try {
      await this.productDAO.deleteProductById(id);
    } catch (error) {
      throw new Error('Error al eliminar el producto por ID: ' + error.message);
    }
  }
}

export { ProductService };
