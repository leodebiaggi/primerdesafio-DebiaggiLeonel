import { ProductService } from "../services/product.service.js";

class ProductController {
  async addProduct(req, res) {
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    try {
      await ProductService.addProduct(title, description, price, thumbnail, code, stock, category);
      res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await ProductService.getProducts();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductService.getProductById(id);
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
      const product = await ProductService.updateProduct(id, updatedFields);
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
      await ProductService.deleteProductById(id);
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export { ProductController };
