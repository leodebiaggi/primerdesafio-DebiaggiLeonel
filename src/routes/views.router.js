import { Router } from "express";
//import { ProductManager } from "../productManager.js";
import { Server } from 'socket.io';
import { Message } from '../data/mongoDB/models/messages.models.js';
import { ProductDAO } from "../data/DAOs/product.dao.js";
import Product from '../data/mongoDB/models/products.model.js';
import Cart from '../data/mongoDB/models/carts.model.js';
import { isUser } from "../middlewares/auth.middlewares.js";
import userModel from '../data/mongoDB/models/user.model.js'

const router = Router();
//const productManagerInstance = new ProductManager('./productList.json');
//const productManagerInstance = new ProductManagerMongo()
const productManagerInstance = new ProductDAO()

// Ruta para mostrar la vista "home.handlebars"
router.get("/", (req, res) => {
  const products = productManagerInstance.getProducts();
  res.render("home", { products });
});

// Ruta para mostrar la vista "realTimeProducts.handlebars"
router.get("/realtimeproducts", (req, res) => {
  const products = productManagerInstance.getProducts();
  res.render("realtimeproducts", { products });
});

// Ruta para mostrar la vista "Chat"
router.get("/chat", isUser, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.render("chat", { messages });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).send("Error al obtener mensajes");
  }
});

// Ruta para mostrar la vista "Products"
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    const user = req.session ? req.session.user : null;
    res.render('products', { products, user });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error al obtener los productos');
  }
});

// Ruta para mostrar la vista "ProductDetails"
router.get('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.render('productDetails', { product });
  } catch (error) {
    console.error('Error al obtener los detalles del producto:', error);
    res.status(500).send('Error al obtener los detalles del producto');
  }
});

// Ruta para ver un carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartDetails = await Cart.findById(cartId).populate('products.product');

    if (!cartDetails) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.render('cart', { cart: cartDetails });
  } catch (error) {
    console.error('Error al obtener los detalles del carrito:', error);
    res.status(500).send('Error al obtener los detalles del carrito: ' + error.message);
  }

  // Ruta para vistas Register, Login y Profile
  const publicAcces = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile');
    next();
  }

  const privateAcces = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
  }


  router.get('/register', publicAcces, (req, res) => {
    res.render('register')
  })

  router.get('/login', publicAcces, (req, res) => {
    res.render('login')
  })

  router.get('/profile', privateAcces, (req, res) => {
    res.render('profile', {
      user: req.session.user
    })
  })

});

//Ruta para mensajeria

router.get('/messages', (req, res) => {
  res.render('messages');
})

// Ruta para administrar usuarios

router.get('/admin/users', async (req, res) => {
  try {
    const users = await userModel.find({}, { username: 1, first_name: 1, last_name: 1, email: 1, role: 1 }).lean();
    res.render('adminViews', { users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/:userId/updateRole', async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    await userModel.findByIdAndUpdate(userId, { role });
    res.redirect('/admin/users');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/:userId/delete', async (req, res) => {
  const { userId } = req.params;

  try {
    await userModel.findByIdAndDelete(userId);
    res.redirect('/admin/users');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar un usuario
router.post('/admin/users/:userId/delete', async (req, res) => {
  const { userId } = req.params;

  try {
    // Eliminar al usuario por su ID
    await userModel.findByIdAndDelete(userId);

    // Enviar correo al usuario eliminado
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      }
    });

    // Obtener el correo del usuario eliminado
    const user = await userModel.findById(userId);
    const userEmail = user.email;

    // Configurar el mensaje de correo
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: 'Cuenta eliminada por inactividad',
      text: 'Tu cuenta en nuestro ecommerce ha sido eliminada debido a inactividad durante los últimos 2 días.'
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    // Redireccionar a la vista de administración de usuarios
    res.redirect('/api/views/admin/users');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error al eliminar el usuario');
  }
});


// Inicializar el servidor de Websockets
const socketServer = new Server();

// Manejar la conexión de Websockets
socketServer.on('connection', (socket) => {
  console.log('Cliente conectado a Websocket', socket.id);

  // Manejar la creación de un nuevo producto
  socket.on('createProduct', (data) => {
    productManagerInstance.addProduct(data.title, data.description, data.price, data.code, data.stock, data.category);
    const products = productManagerInstance.getProducts();
    socketServer.emit('productListUpdate', products);
  });

  // Manejar la eliminación de un producto
  socket.on('deleteProduct', (productId) => {
    productManagerInstance.deleteProductById(productId);
    const products = productManagerInstance.getProducts();
    socketServer.emit('productListUpdate', products);
  });

  // Manejar la desconexión de un cliente
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado de Websocket`);
  });
});


export default router 