const fs = require('fs-extra');
const filePath = 'productList.json';

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
    console.log(`El archivo ${filePath} se ha creado correctamente`);
}

// Class producto individual
class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

// Class lista de productos
class ProductManager {
    constructor() {
        this.products = [];
        this.currentId = 0;
        this.loadProducts(); // Carga productos desde el archivo al iniciar
    }

    // Cargar productos desde el archivo JSON al iniciar la aplicación  
    async loadProducts() {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            if (data.trim() === '') {
                this.products = [];
            } else {
                this.products = JSON.parse(data).map((productData) => new Product(productData.id, productData.title, productData.description, productData.price, productData.thumbnail, productData.code, productData.stock));
                this.updateLastProductId();
            }
        } catch (error) {
            console.log(`Ocurrió un error al cargar los productos: ${error.message}`);
        }
    }

    // Guardar productos en el archivo JSON
    async saveProducts() {
        try {
            await fs.writeFile(filePath, JSON.stringify(this.products, null, 2), 'utf-8');
            console.log(`Los productos se guardaron correctamente en el archivo: ${filePath}`);
        } catch (error) {
            console.log(`Ocurrió un error al guardar los productos: ${error.message}`);
        }
    }

    // Agregar un nuevo producto
    addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (![title, description, price, thumbnail, code, stock].every(Boolean)) {
                throw new Error('Todos los campos son obligatorios para agregar un producto.');
            }

            if (this.products.some((p) => p.code === code)) {
                throw new Error(`El producto con el código '${code}' ya existe.`);
            }

            this.currentId++;
            const newProduct = new Product(this.currentId, title, description, price, thumbnail, code, stock);
            this.products.push(newProduct);

            this.saveProducts(); // Guardar los productos actualizados

            console.log(`Producto agregado exitosamente: ${title}`);
        } catch (error) {
            console.error(`Error al agregar el producto: ${error.message}`);
        }
    }

    // Obtener todos los productos
    getProducts() {
        return [...this.products];
    }

    // Obtener un producto por su ID
    getProductById(id) {
        try {
            const product = this.products.find((product) => product.id === id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.error(`Error al obtener el producto por ID: ${error.message}`);
            return null;
        }
    }

    // Actualizar el precio de un producto por su ID
    async updateProductPrice(id, updatedPrice) {
        try {
            const productToUpdate = this.products.find((product) => product.id === id);
            if (!productToUpdate) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            productToUpdate.price = updatedPrice;
            await this.saveProducts();
            this.updateLastProductId();
            console.log(`Se actualizó el precio del producto: ${JSON.stringify(productToUpdate)}`);
        } catch (error) {
            console.error(`Error al actualizar el precio del producto: ${error.message}`);
        }
    }


    // Eliminar un producto por su ID
    async deleteProductById(id) {
        try {
            const index = this.products.findIndex((product) => product.id === id);
            if (index !== -1) {
                const deletedProduct = this.products.splice(index, 1)[0];
                await this.saveProducts();
                await this.loadProducts(); // Volver a cargar los productos para reflejar los cambios
                console.log(`Producto eliminado: ${deletedProduct.title}`);
            } else {
                throw new Error('Producto no encontrado.');
            }
        } catch (error) {
            console.error(`Error al eliminar el producto por ID: ${error.message}`);
        }
    }


    // Actualizar el ID actual basado en el último producto
    updateLastProductId() {
        if (this.products.length > 0) {
            const maxId = this.products.reduce((max, product) => {
                return product.id > max ? product.id : max;
            }, 0);
            this.currentId = maxId;
        } else {
            this.currentId = 0;
        }
    }
}

    // Función de prueba para chequear las distintas funciones
    async function Prueba() {
    const productManagerInstance = new ProductManager();

    //Mostrar el array vacío al inicio
    console.log("Array vacío al inicio:");
    console.log(productManagerInstance.getProducts());

    //Se agregan los productos
    console.log("Agregado de productos:");
    productManagerInstance.addProduct('Mr White', 'Figura 3D Mr White', 10000, '../img/Series/MrWhite.gif', 'S01', 5);
    productManagerInstance.addProduct('Mike', 'Figura 3D Mike', 7000, '../img/Series/Mike.gif', 'S02', 8);
    productManagerInstance.addProduct('Boa Hancock', 'Figura 3D Boa Hancock', 5000, '../img/Anime/BoaHancock.gif', 'A01', 10);

    //Mostrar listado de productos agregados
    console.log("Listado de productos agregados");
    console.log(productManagerInstance.getProducts());

    //Búsqueda de productos by ID
    console.log("Busqueda de producto:");
    const productId = 2;
    const productById = productManagerInstance.getProductById(productId);
    if (productById) {
        console.log(`Producto encontrado por ID: ${productId}`);
        console.log(productById);
    }

    //Actualización de precio de producto ingresando un ID
    console.log("Actualización de precio de un producto por ID:");
    const productIdToUpdate = 2;
    await productManagerInstance.updateProductPrice(productIdToUpdate, 8000);

    //Eliminación de producto específico por ID
    console.log("Eliminación de un producto por ID:");
    const productIdToDelete = 1;
    await productManagerInstance.deleteProductById(productIdToDelete);

    console.log("Listado de productos después de eliminar y actualizar:");
    console.log(productManagerInstance.getProducts());
}

Prueba();