import { Router } from "express";
import { ProductManager } from "../productManager.js";
import { Server } from 'socket.io';
import { Message } from "../dao/models/messages.models.js";

const router = Router();
const productManagerInstance = new ProductManager('./productList.json');

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
router.get("/chat", async (req, res) => {
  try {
      const messages = await Message.find().sort({ createdAt: 1 });

      res.render("chat", { messages });
  } catch (error) {
      console.error("Error al obtener mensajes:", error);
      res.status(500).send("Error al obtener mensajes");
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
    socketServer.emit('productListUpdate', products); // Enviar actualización a todos los clientes
  });

  // Manejar la eliminación de un producto
  socket.on('deleteProduct', (productId) => {
    productManagerInstance.deleteProductById(productId);
    const products = productManagerInstance.getProducts();
    socketServer.emit('productListUpdate', products); // Enviar actualización a todos los clientes
  });

  // Manejar la desconexión de un cliente
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado de Websocket`);
  });
});


export default router 