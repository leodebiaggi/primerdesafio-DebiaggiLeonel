import { Router } from 'express';
import { CartManager } from '../cartManager.js';

const router = Router();
const cartManagerInstance = new CartManager('./carts.json');

// POST - Creación de carritos
router.post('/', (req, res) => {
  const newCart = cartManagerInstance.createCart();
  res.status(201).json(newCart);
});

// GET - Listar productos de un carrito
router.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await cartManagerInstance.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: 'El carrito no fue encontrado' });
  }

  res.json(cart.products);
});

// POST - Agregar producto a carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: 'La cantidad no es validad' });
  }

  const cart = cartManagerInstance.addProductToCart(cartId, productId, quantity);
  if (!cart) {
    return res.status(404).json({ error: 'El carrito no fue encontrado' });
  }

  res.json(cart);
});

export default router;