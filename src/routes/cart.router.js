import { Router } from 'express';
//import { CartManager } from '../cartManager.js';
import { CartManagerMongo } from '../dao/cartManagerMongo.js';

const router = Router();
//const cartManagerInstance = new CartManager('./carts.json');
const cartManagerInstance = new CartManagerMongo();

// POST - Creación de carritos
router.post('/', (req, res) => {
  const newCart = cartManagerInstance.createCart();
  res.status(201).json(newCart);
});

// GET - Listar todos los carritos
router.get('/', async (req, res) => {
  const carts = await cartManagerInstance.getAllCarts();
  res.json(carts);
});

// GET - Listar productos de un carrito
router.get('/:cid', async (req, res) => {
  const cartId = +req.params.cid; // Se reemplaza parseInt(req.params.cid);
  const cart = await cartManagerInstance.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: 'El carrito no fue encontrado' });
  }

  res.json(cart.products);
});

// POST - Agregar producto a carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const cart = cartManagerInstance.addProductToCart(cartId, productId, 1); // Siempre se agregará un producto con cantidad 1

  if (!cart) {
    return res.status(404).json({ error: 'El carrito no fue encontrado' });
  }

  res.json(cart);
});

export default router;