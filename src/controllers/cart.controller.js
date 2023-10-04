import { CartManagerMongo } from "../dao/cartManagerMongo";

// Crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const cartManager = new CartManagerMongo();
    const newCart = await cartManager.createCart();
    res.status(201).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: "Error al intentar crear el carrito" });
  }
};

// Obtener todos los carritos
export const getAllCarts = async (req, res) => {
  try {
    const cartManager = new CartManagerMongo();
    const carts = await cartManager.getAllCarts();
    res.status(200).json({ carts });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
};

// Obtener un carrito por su ID
export const getCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const cartManager = new CartManagerMongo();
    const cart = await cartManager.getCartById(id);

    if (cart) {
      res.status(200).json({ cart });
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito por ID" });
  }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  const { cartId, productId, quantity } = req.body;

  try {
    const cartManager = new CartManagerMongo();
    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
};

// Listar productos de un carrito
export const getCartProducts = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cartManager = new CartManagerMongo();
    const cartProducts = await cartManager.getCartProducts(cartId);
    res.status(200).json({ products: cartProducts });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const cartManager = new CartManagerMongo();
    const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantityInCart = async (req, res) => {
  const { cartId, productId, quantity } = req.body;

  try {
    const cartManager = new CartManagerMongo();
    const updatedCart = await cartManager.updateProductQuantityInCart(cartId, productId, quantity);
    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
  }
};

// Agregar o actualizar productos en el carrito
export const updateCart = async (req, res) => {
  const { cartId, productId, quantity } = req.body;

  try {
    const cartManager = new CartManagerMongo();
    const updatedCart = await cartManager.updateCart(cartId, productId, quantity);
    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar o actualizar productos en el carrito" });
  }
};

// Eliminar todos los productos de un carrito
export const clearCart = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cartManager = new CartManagerMongo();
    const updatedCart = await cartManager.clearCart(cartId);
    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar todos los productos del carrito" });
  }
};
