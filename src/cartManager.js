import fs from 'fs';

const filePath = 'carts.json';

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
  console.log(`Se genero el archivo ${filePath}`);
}

// Class lista de carritos
class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.lastCartId = 0;
    this.loadCarts(); // Carga de carritos desde el archivo al iniciar
  }

  // Cargar los carritos desde el archivo JSON al iniciar la aplicación  
  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
      this.updateLastCartId();
    } catch (error) {
      throw new Error('Ha ocurrido un error al cargar los carritos: ' + error.message);
    }
  }

  // Guardar los carritos en el archivo JSON
  async saveCarts(data) {
    try {
      const newData = JSON.stringify(data, null, 2);
      await fs.promises.writeFile(this.path, newData, 'utf-8');
      console.log('Se guardaron los carritos', this.path);
    } catch (error) {
      throw new Error('Ha ocurrido un error al guardar los carritos: ' + error.message);
    }
  }

  // Actualizar el ID actual basado en el último carrito
  updateLastCartId() {
    if (this.carts.length > 0) {
      const lastCart = this.carts[this.carts.length - 1];
      this.lastCartId = lastCart.id;
    }
  }

  // Crear nuevo carrito
  createCart() {
    const newCart = {
      id: this.lastCartId + 1,
      products: [],
    };

    this.lastCartId++;
    this.carts.push(newCart);

    this.saveCarts(this.carts)
      .then(() => {
        console.log(`Se ha creado el carrito con ID: ${newCart.id}`);
      })
      .catch((error) => {
        console.log('Ha ocurrido un error al guardar los carritos', error.message);
      });

    return newCart;
  }

  // Obtener un carrito por su ID
  getCartById(id) {
    const cart = this.carts.find((c) => c.id === id);
    if (cart) {
      return cart;
    } else {
      throw new Error('Carrito no encontrado');
    }
  }

  // Agregar un producto al carrito
  addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.getCartById(cartId);
    const existingProduct = cart.products.find((p) => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    this.saveCarts(this.carts)
      .then(() => {
        console.log(`El producto fue agregado al carrito ${cartId}`);
      })
      .catch((error) => {
        throw new Error('Ha ocurrido un error al guardar los carritos: ' + error.message);
      });

    return cart;
  }
}

export { CartManager };