import express from "express";

import path from "path";
import __dirname from "./utils.js";

import handlebars from "express-handlebars";
import { Server } from "socket.io";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import ProductManager from "./managers/ProductManager.js";
const productManager = new ProductManager(); // Instanciar ProductManager

// Inicializa los productos
(async () => {
  await productManager.init();
})();


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// configuracion de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Inicializar el servidor http
const httpServer = app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

// Configuración de WebSockets
const io = new Server(httpServer);

// Creo una conexión WebSocket
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Agregar producto
  socket.on("addProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit("productAdded", newProduct);
      io.emit("productsUpdated", await productManager.getProducts());
    } catch (error) {
      socket.emit("productAddError", "Hubo un error al agregar el producto");
    }
  });

  // Eliminar producto
  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(Number(productId));
      io.emit("productDeleted", "Producto eliminado exitosamente");
      io.emit("productsUpdated", await productManager.getProducts());
    } catch (error) {
      socket.emit(
        "productDeleteError",
        "Hubo un error al eliminar el producto"
      );
    }
  });
});

export { io, productManager };
