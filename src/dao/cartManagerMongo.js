import Cart from '../dao/models/carts.model.js';

// Class lista de carritos
class CartManagerMongo {
  constructor() { }

  // Crear nuevo carrito
  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      console.log(`Se ha creado el carrito con ID: ${newCart._id}`);
      return newCart;
    } catch (error) {
      throw new Error('Ha ocurrido un error al crear el carrito: ' + error.message);
    }
  }

  // Obtener todos los carritos
  async getAllCarts() {
    try {
      const carts = await Cart.find();
      return carts;
    } catch (error) {
      throw new Error('Ha ocurrido un error al obtener todos los carritos: ' + error.message);
    }
  }

  // Obtener un carrito por su ID
  async getCartById(id) {
    try {
      const cart = await Cart.findById(id);
      if (cart) {
        return cart;
      } else {
        throw new Error('Carrito no encontrado');
      }
    } catch (error) {
      throw new Error('Ha ocurrido un error al obtener el carrito: ' + error.message);
    }
  }

  // Agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === productId);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      console.log(`El producto fue agregado al carrito ${cartId}`);
      return cart;
    } catch (error) {
      throw new Error('Ha ocurrido un error al agregar el producto al carrito: ' + error.message);
    }
  }
}

export { CartManagerMongo };
