import express from 'express';
import crypto from 'crypto';
import { transporter } from './nodemailer.js';
import { ProductDAO } from './data/DAOs/product.dao.js';
import productListRouter from './routes/productList.router.js';
import cartRouter from './routes/cart.router.js';
import { __dirname } from './bcrypt-helper.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import './data/mongoDB/dbConfig.js';
import { Message } from './data/mongoDB/models/messages.models.js';
import sessionRouter from '../src/routes/sessions.router.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import './passport/passportStrategies.js';
import messagesRouter from '../src/routes/messages.router.js';
import { generateMockingProducts } from './mocking/productMocking.js';
import logger from './utils/logger.js';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import userModel from './data/mongoDB/models/user.model.js';
import userRouter from '../src/routes/users.router.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/products', productListRouter);
app.use('/api/carts', cartRouter);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Config Railway
mongoose.connect('mongodb+srv://leodebiaggi:Complot2019@ecommercestor3d.910i2dj.mongodb.net/ECOMMERCESTOR3D?retryWrites=true&w=majority');

// Config de HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('/api/views', 'views');
app.set('view engine', 'handlebars');

// Rutas viewRouter
app.use('/api/views', viewsRouter);
app.use('/api/realTimeProducts', viewsRouter);

// const productManagerInstance = new ProductManager ("./productList.json")
// const productManagerInstance = new ProductManagerMongo();
const productManagerInstance = new ProductDAO();

// Mensaje de bienvenida al inicio
app.get('/', (req, res) => {
  res.send('Bienvenidos a Stor3D!');
});

// Conectar Session con Filestore
const fileStorage = FileStore(session);

// Cookie & Sessions
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://leodebiaggi:Complot2019@ecommercestor3d.910i2dj.mongodb.net/ECOMMERCESTOR3D?retryWrites=true&w=majority',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
      ttl: 50000,
    }),
    secret: 'coderLeo9341',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Ruta al api/sessions
app.use('/api/session', sessionRouter);
app.use('/api/session/current', sessionRouter);
app.use("/api/session/users/premium", sessionRouter);
app.use("/api/users", userRouter);
app.use("/api/users/delete", userRouter);
app.use("/api/users/deleteInactive", userRouter);

// Rutas para login, register, profile y recuperación de contraseña
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

app.get('/api/views/forgot-password', (req, res) => {
  res.render('forgotPassword');
});

app.get('/api/views/forgot-password-sent', (req, res) => {
  res.render('forgotPasswordSent');
});

app.get('/api/views/reset-password-success', (req, res) => {
  res.render('resetPasswordSuccess');
});

app.get('/api/views/forgot-password-expired', (req, res) => {
  res.render('forgotPasswordExpired');
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex');
  const expirationTime = Date.now() + 3600000;
  global.passwordResetToken = { email, token, expirationTime };
  const resetURL = `http://localhost:8080/api/views/reset-password/${token}`;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Recuperación de Contraseña',
    html: `Haz clic <a href="${resetURL}">aquí</a> para restablecer tu contraseña.`,
  });
  res.redirect('/api/views/forgot-password-sent');
});

app.get('/api/views/reset-password/:token', (req, res) => {
  const { token } = req.params;
  if (global.passwordResetToken && global.passwordResetToken.token === token) {
    res.render('resetPassword', { token });
  } else {
    res.redirect('/api/views/forgot-password-expired');
  }
});

app.post('/api/reset-password', (req, res) => {
  const { token, password } = req.body;
  if (global.passwordResetToken && global.passwordResetToken.token === token) {
    if (password === 'la-contrasena-antigua') {
      res.render('resetPassword', { token, error: 'La contraseña no puede ser la misma.' });
    } else {
      delete global.passwordResetToken;
      res.redirect('/api/views/reset-password-success');
    }
  } else {
    res.redirect('/api/views/forgot-password-expired');
  }
});

// Ruta admin de usuario
app.get('/api/views/admin/users', async (req, res) => {
  try {
    const users = await userModel.find({}, 'first_name last_name email role');
    res.render('adminViews', { users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mensajeria
app.use('/api/messages', messagesRouter);
app.use('/', viewsRouter);

// Mocking products (devuelve 50 productos utilizando FAKER)
app.get('/api/mockingproducts', async (req, res) => {
  const mockProducts = [];
  for (let i = 0; i < 50; i++) {
    const mockingProducts = generateMockingProducts();
    mockProducts.push(mockingProducts);
  }
  res.json(mockProducts);
});

// Ruta Test Log
app.get('/testLog', (req, res) => {
  logger.debug('Testing debug level message');
  logger.http('Testing http level message');
  logger.info('Testing info level message');
  logger.warning('Testing warning level message');
  logger.error('Testing error level message');
  logger.fatal('Testing fatal level message');
  res.send('Logs generados correctamente');
});

app.get('/testError', (req, res) => {
  throw new Error('se forzo el error correctamente');
});

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de Stor3D - Leonel Debiaggi",
      description: "Detalles sobre los métodos y funcionalidades implementados en proyecto Stor3D",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Declaración de puerto variable + llamado al puerto
const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

// Socket y eventos
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);

  socket.on('createProduct', (data) => {
    productManagerInstance.addProduct(data);
    const products = productManagerInstance.getProducts();
    socketServer.emit('productListUpdate', products);
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

export default app