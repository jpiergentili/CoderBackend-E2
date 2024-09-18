import { Router } from 'express';
import { productManager } from "../app.js";

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    try {
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body;
    try {
        const newProduct = await productManager.addProduct({ title, description, price, thumbnail, code, stock, category });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const deletedProduct = await productManager.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;
