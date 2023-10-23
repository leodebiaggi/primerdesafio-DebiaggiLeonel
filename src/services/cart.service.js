import { CartDAO } from "../data/DAOs/cart.dao.js";
import { ErrorMessages } from "../errors/errorsNum.js";
import CustomErrors from "../errors/customErrors.js";

class CartService {
  constructor() {
    this.cartDAO = new CartDAO();
  }

  async createCart() {
    try {
      return await this.cartDAO.createCart();
    } catch (error) {
      throw new Error('Error al crear el carrito: ' + error.message);
    }
  }

  async getAllCarts() {
    try {
      return await this.cartDAO.getAllCarts();
    } catch (error) {
      throw new Error('Error al obtener los carritos: ' + error.message);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await this.cartDAO.getCartById(cartId);
      return cart;
    } catch (error) {
      //throw new Error('Error al obtener el carrito');
      CustomErrors.generateError(ErrorMessages.CARTID_NOT_FOUND);
    }
  }

  async addProductToCart(cart, productId, quantity) {
    try {
      return await this.cartDAO.addProductToCart(cart, productId, quantity);
    } catch (error) {
      throw new Error('Error al agregar el producto al carrito: ' + error.message);
    }
  }

  async getCartProducts(cartId) {
    try {
      return await this.cartDAO.getCartProducts(cartId);
    } catch (error) {
      throw new Error('Error al obtener los productos del carrito: ' + error.message);
    }
  }

  async removeProductFromCart(cart, productId) {
    try {
      return await this.cartDAO.removeProductFromCart(cart, productId);
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito: ' + error.message);
    }
  }

  async updateProductQuantityInCart(cart, productId, quantity) {
    try {
      return await this.cartDAO.updateProductQuantityInCart(cart, productId, quantity);
    } catch (error) {
      throw new Error('Error al actualizar la cantidad del producto en el carrito: ' + error.message);
    }
  }

  async updateCart(cart, productId, quantity) {
    try {
      return await this.cartDAO.updateCart(cart, productId, quantity);
    } catch (error) {
      throw new Error('Error al actualizar el carrito: ' + error.message);
    }
  }

  async clearCart(cart) {
    try {
      return await this.cartDAO.clearCart(cart);
    } catch (error) {
      throw new Error('Error al eliminar todos los productos del carrito: ' + error.message);
    }
  }
}

export { CartService };
