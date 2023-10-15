import express from 'express';

//import { ProductManager} from './productManager.js';
import { ProductDAO } from './data/DAOs/product.dao.js';

import productListRouter from './routes/productList.router.js'
import cartRouter from './routes/cart.router.js'
import { __dirname } from './utils/bcrypt-helper.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'

import './data/mongoDB/dbConfig.js'
import { Message } from './data/mongoDB/models/messages.models.js'

import sessionRouter from '../src/routes/sessions.router.js'
import cookieParser from 'cookie-parser'

import session from 'express-session'
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'

import passport from 'passport';
import './passport/passportStrategies.js'

import config from './config.js';

const app = express();
app.use(express.json());
app.use('/api/products', productListRouter);
app.use('/api/carts', cartRouter);
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

// Config de HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('/api/views', 'views')
app.set('view engine', 'handlebars')


//Routes viewRouter
app.use('/api/views', viewsRouter)
app.use('/api/realTimeProducts', viewsRouter);

// const productManagerInstance = new ProductManager ("./productList.json")
// const productManagerInstance = new ProductManagerMongo();
const productManagerInstance = new ProductDAO();

//Mensaje de bienvenida al inicio
app.get('/', (req, res) => {
  res.send('Bienvenidos a Stor3D!');
});

//Conectar Session con Filestore
const fileStorage = FileStore(session);

//Cookie & Sessions
app.use(cookieParser());
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 15,
    ttl: 50000,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Ruta al api/sessions
app.use("/api/session", sessionRouter);

// Rutas para login, register y profile
app.get('/api/views/login', (req, res) => {
  res.render('login');
});

app.get('/api/views/register', (req, res) => {
  res.render('register');
});

app.get('/api/views/profile', (req, res) => {
  res.render('profile', {
    user: req.session.user,
  });  
});

//Declaración de puerto variable + llamado al puerto 
const PORT = process.env.PORT

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`)
})

//Socket y eventos
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);

  socket.on('createProduct', (data) => {
    productManagerInstance.addProduct(data.title, data.description, data.price, data.thumbnail, data.code, data.stock, data.category);
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

  socket.on('chatMessage', async (messageData) => {
    const { user, message } = messageData;
    const newMessage = new Message({ user, message });
    await newMessage.save();

    // Emitir el mensaje a todos los clientes conectados
    socketServer.emit('chatMessage', { user, message });

    console.log(`Mensaje guardado en la base de datos: ${user}: ${message}`);
  });
});