import { Router } from 'express';
//import { CartManager } from '../cartManager.js';
import { CartDAO } from '../data/DAOs/cart.dao.js'
import { isUser } from '../middlewares/auth.middlewares.js';
import userDTO from '../data/DTOs/user.dto.js';
import { CartService } from '../services/cart.service.js'
import { ProductService } from '../services/product.service.js'
import { ticketService } from '../services/ticket.service.js';
import { generateUniqueCode } from '../utils/codeGenerator.js';
import Cart from '../data/mongoDB/models/carts.model.js';
import { ErrorMessages } from '../errors/errorsNum.js';
import CustomErrors from '../errors/customErrors.js';

const router = Router();
//const cartManagerInstance = new CartManager('./carts.json');
//const cartManagerInstance = new CartManagerMongo();
const cartManagerInstance = new CartDAO();
const cartService = new CartService();
const productService = new ProductService();

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
    //return res.status(500).json({ error: 'Error al obtener los productos del carrito: ' + error.message });
    CustomErrors.generateError(ErrorMessages.CARTID_NOT_FOUND);
  }
});


// POST - Agregar producto a carrito
router.post('/:cid/product/:pid', isUser, async (req, res) => {
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

// POST PURCHASE 
router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartService.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    for (const productInfo of cart.products) {
      const product = await productService.getProductById(productInfo.product);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      if (product.stock < productInfo.quantity) {
        return res.status(400).json({ error: 'No hay suficiente stock para el producto' + product.name });
      }

      product.stock -= productInfo.quantity;
      await product.save();
    }

    // Creación ticket
    const ticketData = {
      code: await generateUniqueCode(), 
      purchase_datetime: new Date(),
      amount: cart.totalAmount, 
      purchaser: userDTO.email,
    };

    const ticket = await ticketService.createTicket(ticketData);

    // Limpiar Carrito
    await cartService.clearCart(cartId);

    res.status(201).json({ message: 'Compra exitosa', ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;