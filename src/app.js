import express from 'express';
import { ProductManager} from './productManager.js';
import productListRouter from './routes/productList.router.js';
import cartRouter from './routes/cart.router.js';

const app = express ();
app.use(express.json());
app.use('/api/products', productListRouter);
app.use('/api/carts', cartRouter);
app.use(express.urlencoded({extended:true}))

const productManagerInstance = new ProductManager ("./productList.json")

//Mensaje de bienvenida al inicio
app.get('/', (req, res) => {
    res.send('Bienvenidos a mi portal!');
  });

app.listen(8080, () => {
  console.log(`Server Express listen port 8080`);
});