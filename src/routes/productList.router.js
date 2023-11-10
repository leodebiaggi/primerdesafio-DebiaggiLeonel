import express from 'express';
import { ErrorMessages } from '../errors/errorsNum.js';
import CustomErrors from '../errors/customErrors.js';

//import { ProductManager } from '../productManager.js';
import { ProductDAO } from '../data/DAOs/product.dao.js'

import { isAdmin } from '../middlewares/auth.middlewares.js'
import { isPremium } from '../middlewares/auth.middlewares.js';
import Product from '../data/mongoDB/models/products.model.js';

import logger from '../utils/logger.js';

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
    logger.error('Error al obtener los productos - Test Logger');
    res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
  }
});

// Ruta GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManagerInstance.getProductById(productId);

    if (!product) {
      //return res.status(404).json({ error: 'No se ha encontrado el producto.' });
      CustomErrors.generateError(ErrorMessages.PRODUCTID_NOT_FOUND);
    }

    res.json(product);
  } catch (error) {
    //res.status(500).json({ error: 'Hubo un error al obtener el producto solicitado.' });
    logger.warning('Hubo un error al obtener el producto solicitado - Test Logger');
    CustomErrors.generateError(ErrorMessages.PRODUCTID_NOT_FOUND);
  }
});

//Función para obtener los campos y el tipo
function getFieldType(fieldName) {
  const field = Product.schema.path(fieldName);
  if (field) {
    return field.instance;
  }
  return "undefined"; 
}
// Ruta POST /api/products/
router.post('/', isAdmin, isPremium, (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
  const missingFields = [];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const errorMessages = missingFields.map(field => {
      const fieldType = getFieldType(field);
      return `${field} (de tipo ${fieldType}) es requerido`;
    });
    logger.warning('Campos obligatorios incompletos - Test Logger');
    return res.status(400).json({ error: ErrorMessages.CREATE_PRODUCT_ERROR, details: errorMessages });
  }

  const product = {
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails ? thumbnails.split(',') : [],
  };

  const newProduct = productManagerInstance.addProduct(product);
  if (newProduct) {
    logger.info('El producto se ha creado correctamente - Test Logger');
    res.status(201).json(newProduct);
  } else {
    CustomErrors.generateError(ErrorMessages.CREATE_PRODUCT_ERROR);
    logger.error('Se ha producido un error al crear el producto - Test Logger');
  }
});


// Ruta PUT /api/products/:pid
router.put('/:pid', isAdmin, async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProductData = req.body;

    if (!Object.keys(updatedProductData).length) {
      logger.info('Se deben enviar campos para actualizar el producto - Test Logger');
      return res.status(400).json({ error: 'Se deben enviar campos para actualizar el producto.' });
    }

    await productManagerInstance.updateProduct(productId, updatedProductData);
    const updatedProduct = await productManagerInstance.getProductById(productId);
    res.json(updatedProduct);
  } catch (error) {
    logger.error('Error al actualizar el producto - Test Logger');
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', isAdmin, async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManagerInstance.getProductById(productId);
    if (!product) {
      logger.warning('No se ha encontrado el producto que intentas eliminar - Test Logger');
      return res.status(404).json({ error: 'No se ha encontrado el producto que intentas eliminar.' });
    }
    await productManagerInstance.deleteProductById(productId);
    logger.info('El producto ha sido eliminado correctamente - Test Logger');
    res.json({ message: 'El producto ha sido eliminado correctamente.' });
  } catch (error) {
    logger.error('Error al eliminar el producto - Test Logger');
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

export default router;
