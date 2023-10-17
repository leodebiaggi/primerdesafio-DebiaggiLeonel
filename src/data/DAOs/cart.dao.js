import Cart from '../mongoDB/models/carts.model.js';

class CartDAO {
  async createCart() {
    return await Cart.create({ products: [] });
  }

  async getAllCarts() {
    return await Cart.find();
  }

  async getCartById(id) {
    return await Cart.findById(id);
  }

  async addProductToCart(cartId, productId, quantity) {
  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      throw new Error('El carrito no fue encontrado');
    }

    const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al agregar el producto al carrito: ' + error.message);
  }
}


  async getCartProducts(cartId) {
    return await Cart.findById(cartId).populate('products.product', 'title description price');
  }

  async removeProductFromCart(cart, productId) {
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
    }
  }

  async updateProductQuantityInCart(cart, productId, quantity) {
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
      await cart.save();
    }
  }

  async updateCart(cart, productId, quantity) {
    const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async clearCart(cart) {
    cart.products = [];
    await cart.save();
  }
}

export { CartDAO };
