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

  // Listar productos de un carrito
  async getCartProducts(cartId) {
    try {
      const cart = await Cart.findById(cartId)
        .populate('products.product', 'title description price');

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      return cart.products;
    } catch (error) {
      throw new Error('Error al obtener los productos del carrito: ' + error.message);
    }
  }

  // Elimina un producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);

      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1); // Eliminar el producto del arreglo
        await cart.save();
        return cart;
      } else {
        throw new Error('El producto no se encuentra en el carrito');
      }
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito: ' + error.message);
    }
  }

  // Actualizar cantidad de producto
  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);

      const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
        await cart.save();
        return cart;
      } else {
        throw new Error('El producto no se encuentra en el carrito');
      }
    } catch (error) {
      throw new Error('Error al actualizar la cantidad del producto en el carrito: ' + error.message);
    }
  }

  // Agregar/Actualizar productos carrito
  async updateCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === productId);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      console.log(`El carrito ${cartId} se ha actualizado.`);
      return cart;
    } catch (error) {
      throw new Error('Error al actualizar el carrito: ' + error.message);
    }
  }

  // Eliminar todos los productos de un carrito
  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = [];
      await cart.save();
      console.log(`Se han eliminado todos los productos del carrito ${cartId}.`);
      return cart;
    } catch (error) {
      throw new Error('Error al eliminar todos los productos del carrito: ' + error.message);
    }
  }


}

export { CartManagerMongo };
