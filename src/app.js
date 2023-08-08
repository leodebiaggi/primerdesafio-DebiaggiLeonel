import express from 'express';
import { ProductManager} from './productManager.js';
import productListRouter from './routes/productList.router.js';
import cartRouter from './routes/cart.router.js';
import { __dirname } from './utils.js'//Importamos Utils
import handlebars from 'express-handlebars'//Importamos handlebars
import viewsRouter from './routes/views.router.js' //Importamos viewsRouter
import { Server } from 'socket.io' //Importamos socket


const app = express ();
app.use(express.json());
app.use('/api/products', productListRouter);
app.use('/api/carts', cartRouter);
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));

// Config de HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


//Routes viewRouter
app.use('/api/views', viewsRouter)
app.use('/api/realTimeProducts', viewsRouter);


const productManagerInstance = new ProductManager ("./productList.json")

//Mensaje de bienvenida al inicio
app.get('/', (req, res) => {
  res.send('Bienvenidos a Stor3D!');
});

//Declaración de puerto variable + llamado al puerto 
const PORT = 8080

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`)
})

//Socket y eventos
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);

  socket.on('createProduct', (data) => {
    productManagerInstance.addProduct(data.title, data.description, data.price, data.code, data.stock, data.category);
    const products = productManagerInstance.getProducts();
    socketServer.emit('productListUpdate', products); // Enviar actualización a todos los clientes
  });

  socket.on('deleteProduct', (productId) => {
    productManagerInstance.deleteProductById(productId);
    const products = productManagerInstance.getProducts();
    socketServer.emit('productListUpdate', products); // Enviar actualización a todos los clientes
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado`);
  });
});