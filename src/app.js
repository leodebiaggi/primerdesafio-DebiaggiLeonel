import express from 'express';
import { ProductManager} from './productManager.js';

const app = express ();

app.use(express.urlencoded({extended:true}))

const productManagerInstance = new ProductManager('./src/productList.json')

//Mensaje de bienvenida al inicio
app.get('/', (req, res) => {
    res.send('Bienvenidos a mi portal!');
  });
  
//Endpoint para obtener productos
app.get('/products', async (req,res) =>{
    try{
        const products = await productManagerInstance.getProducts();

        //Verificación de límite al listar los productos
        const limit = req.query.limit ? parseInt(req.query.limit) : null; //sin limite (modificar para setear limite)

        //Listado de productos con filtro limit
        const response = limit ? products.slice(0, limit) : products;

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

//Endpoint para obtener productos por ID. Se debe reemplazar el PID por el ID.
app.get('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productManagerInstance.getProductById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'No se ha encontrado el producto.' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al obtener el producto solicitado.' });
    }
});

app.listen(8080, () => {
  console.log(`Server Express listen port 8080`);
});