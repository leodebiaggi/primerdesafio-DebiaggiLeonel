import express from 'express';

//import { ProductManager } from '../productManager.js';
import { ProductDAO } from '../data/DAOs/product.dao.js'
import Product from '../data/mongoDB/models/products.model.js';

import { isAdmin} from '../middlewares/auth.middlewares.js'

const router = express.Router();
//const productManagerInstance = new ProductManager();
//const productManagerInstance = new ProductManagerMongo();
const productManagerInstance = new ProductDAO();

// Ruta raíz GET /api/products/
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      filter = { category: query };
    }

    let sortOption = {};
    if (sort) {
      if (sort === 'asc') {
        sortOption = { price: 1 };
      } else if (sort === 'desc') {
        sortOption = { price: -1 };
      }
    }

    const options = {
      page: parseInt(page), 
      limit: parseInt(limit), 
      sort: sortOption,
    };

    const result = await Product.paginate(filter, options); 

    const response = {
      status: 'success',
      payload: result.docs, 
      totalPages: result.totalPages, 
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
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
router.post('/', isAdmin, (req, res) => {
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
router.put('/:pid', isAdmin, async (req, res) => {
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
router.delete('/:pid', isAdmin, async (req, res) => {
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
