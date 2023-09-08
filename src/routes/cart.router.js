import { Router } from 'express';
//import { CartManager } from '../cartManager.js';
import { CartManagerMongo } from '../dao/cartManagerMongo.js';
import Cart from '../dao/models/carts.model.js';

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
  const { cid: cartId } = req.params;

  try {
    const cartProducts = await cartManagerInstance.getCartProducts(cartId);
    return res.json(cartProducts);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los productos del carrito: ' + error.message });
  }
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

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid: cartId, pid: productId } = req.params;

  try {
    const updatedCart = await cartManagerInstance.removeProductFromCart(cartId, productId);
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
  const { cid: cartId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const updatedCart = await cartManagerInstance.updateCart(cartId, productId, quantity);
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el carrito: ' + error.message });
  }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid: cartId, pid: productId } = req.params;
  const quantity = req.body.quantity;

  try {
    const updatedCart = await cartManagerInstance.updateProductQuantityInCart(cartId, productId, quantity);
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
  const { cid: cartId } = req.params;

  try {
    const clearedCart = await cartManagerInstance.clearCart(cartId);
    return res.status(200).json(clearedCart);
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar todos los productos del carrito: ' + error.message });
  }
});


export default router;