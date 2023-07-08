class ProductManager {
    constructor() {
        this.products = [];
        this.currentId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validación campos obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos son obligatorios.');
            return;
        }

        // Validación campo "code" duplicado
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.log(`El producto con el codigo '${code}' ya existe.`);
            return;
        }

        const newProduct = {
            id: this.currentId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        // Agregado de producto al array
        this.products.push(newProduct);

        // Incremento de ID
        this.currentId++;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log('Producto no encontrado');
        }
        return product;
    }
}

// Creación productManager
const productManager = new ProductManager();

// Llamada getProducts vacío
console.log("Llamada al getProducts vacío:", productManager.getProducts());

// Uso del addProduct
productManager.addProduct('Mr White', 'Figura 3D Mr White', 10000, '../img/Series/MrWhite.gif', 'S01', 5);
productManager.addProduct('Mike', 'Figura 3D Mike', 7000, '../img/Series/Mike.gif', 'S02', 8);
productManager.addProduct('Boa Hancock', 'Figura 3D Boa Hancock', 5000, '../img/Anime/BoaHancock.gif', 'A01', 10);

// Llamada getProducts elementos agregados
console.log("Productos agregados:")
console.log(productManager.getProducts());

// Prueba control de duplicidad por code
console.log("Control de duplicidad:")
productManager.addProduct('Mr White', 'Figura 3D Mr White', 10000, '../img/Series/MrWhite.gif', 'S01', 5);

// Uso del getProductById
const productById = productManager.getProductById(2);
console.log("Busqueda por ID existente:", productById);

// Uso del getProductById not found
console.log("Busqueda por ID inexistente:")
const nonExistentProduct = productManager.getProductById(4);


