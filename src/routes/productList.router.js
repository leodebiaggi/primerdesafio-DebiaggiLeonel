import express from 'express';

//import { ProductManager } from '../productManager.js';
import { ProductManagerMongo } from '../dao/productManagerMongo.js';

const router = express.Router();
//const productManagerInstance = new ProductManager();
const productManagerInstance = new ProductManagerMongo();

// Ruta raíz GET /api/products/
router.get('/', async (req, res) => {
  try {
    const products = await productManagerInstance.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManagerInstance.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'No se ha encontrado el producto.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener el producto solicitado.' });
  }
});

// Ruta POST /api/products/
router.post('/', (req, res) => {
  //console.log('Datos de la solicitud POST:', req.body);
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  } = req.body;

  try {
    if (![title, description, price, thumbnail, code, stock, category].every(Boolean)) {
      throw new Error('Todos los campos son obligatorios para agregar un producto.');
    }
    if (productManagerInstance.products.some((p) => p.code === code)) {
      throw new Error(`El producto con el código '${code}' ya existe.`);
    }
    productManagerInstance.addProduct(title, description, price, thumbnail, code, stock, category);
    res.status(201).json(req.body);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Ruta PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProductData = req.body;

    if (!Object.keys(updatedProductData).length) {
      return res.status(400).json({ error: 'Se deben enviar campos para actualizar el producto.' });
    }

    await productManagerInstance.updateProduct(productId, updatedProductData);
    const updatedProduct = await productManagerInstance.getProductById(productId);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManagerInstance.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'No se ha encontrado el producto que intentas eliminar.' });
    }
    await productManagerInstance.deleteProductById(productId);
    res.json({ message: 'El producto ha sido eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

export default router;
