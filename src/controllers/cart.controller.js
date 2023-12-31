import { CartService } from "../services/cart.service.js";

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await CartService.createCart();
      res.status(201).json({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCarts(req, res) {
    try {
      const carts = await CartService.getAllCarts();
      res.status(200).json({ carts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartById(req, res) {
    const { id } = req.params;
    try {
      const cart = await CartService.getCartById(id);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addProductToCart(req, res) {
    const { cart, productId, quantity } = req.body;
    try {
      const updatedCart = await CartService.addProductToCart(cart, productId, quantity);
      res.status(200).json({ message: 'Producto agregado al carrito exitosamente', cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartProducts(req, res) {
    const { cartId } = req.params;
    try {
      const products = await CartService.getCartProducts(cartId);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    const { cart, productId } = req.body;
    try {
      const updatedCart = await CartService.removeProductFromCart(cart, productId);
      res.status(200).json({ message: 'Producto eliminado del carrito exitosamente', cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductQuantityInCart(req, res) {
    const { cart, productId, quantity } = req.body;
    try {
      const updatedCart = await CartService.updateProductQuantityInCart(cart, productId, quantity);
      res.status(200).json({ message: 'Cantidad de producto actualizada en el carrito exitosamente', cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    const { cart, productId, quantity } = req.body;
    try {
      const updatedCart = await CartService.updateCart(cart, productId, quantity);
      res.status(200).json({ message: 'Carrito actualizado exitosamente', cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    const { cart } = req.body;
    try {
      const updatedCart = await CartService.clearCart(cart);
      res.status(200).json({ message: 'Se han eliminado todos los productos del carrito exitosamente', cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export { CartController };
