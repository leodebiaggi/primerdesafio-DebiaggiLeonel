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
  const cartId = req.params.cid;

  try {
    const cart = await Cart.findById(cartId)
      .populate('products.product', 'title description price');

    if (!cart) {
      return res.status(404).json({ error: 'El carrito no fue encontrado' });
    }

    res.json(cart.products);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los productos del carrito', details: error.message });
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
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cart = await cartManagerInstance.getCartById(cartId);
    
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1); // Eliminar el producto del arreglo
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ error: 'El producto no se encuentra en el carrito' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body.products;

  try {
    const cart = await cartManagerInstance.getCartById(cartId);
    
    cart.products = updatedProducts;

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const cart = await cartManagerInstance.getCartById(cartId);

    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ error: 'El producto no se encuentra en el carrito' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManagerInstance.getCartById(cartId);

    cart.products = [];
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
  }
});


export default router;