import { Router } from "express";
import { productManager } from "../app.js";

const router = Router();

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts(); // Método para obtener todos los productos
    res.render("realTimeProducts", {
      products,
      title: "Mercadoliebre",
      style: "realTimeProducts.css",
    });
});

// Ruta para la vista estática de productos (sin WebSockets)
router.get("/", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  try {
    const products = await productManager.getProducts(limit);
    res.render("home", {
      products,
      title: "Mercadoliebre",
      style: "home.css",
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;
