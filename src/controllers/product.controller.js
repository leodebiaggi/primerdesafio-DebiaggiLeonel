import { ProductManagerMongo } from "../dao/productManagerMongo";

// Crear producto en bd
export const createProduct = async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } = req.body;

  try {
    const productManager = new ProductManagerMongo();
    await productManager.addProduct(title, description, price, thumbnail, code, stock, category);
    res.status(201).json({ message: "Producto creado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al intentar crear el producto" });
  }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const productManager = new ProductManagerMongo();
    const products = await productManager.getProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Obtener un producto por su ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const productManager = new ProductManagerMongo();
    const product = await productManager.getProductById(id);

    if (product) {
      res.status(200).json({ product });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto por ID" });
  }
};

// Actualizar un producto por su ID
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const productManager = new ProductManagerMongo();
    await productManager.updateProduct(id, updatedFields);
    res.status(200).json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

// Eliminar un producto por su ID
export const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const productManager = new ProductManagerMongo();
    await productManager.deleteProductById(id);
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto por ID" });
  }
};
