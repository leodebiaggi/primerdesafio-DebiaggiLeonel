import { ProductService } from "../services/product.service.js";

class ProductController {
  async addProduct(req, res) {
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    try {
      await productService.addProduct(title, description, price, thumbnail, code, stock, category);
      res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await productService.getProducts();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await productService.getProductById(id);
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
      const product = await productService.updateProduct(id, updatedFields);
      if (product) {
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      await productService.deleteProductById(id);
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export { ProductController };
