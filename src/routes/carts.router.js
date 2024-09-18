import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// Inicializa los productos cuando se carga el router
(async () => {
    try {
        await cartManager.init();
    } catch (err) {
        console.error('Error al inicializar los carritos:', err);
    }
})();

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(parseInt(req.params.cid));
        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// POST /api/carts/
router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// DELETE /api/carts/:cid/product/:pid
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(parseInt(req.params.cid), parseInt(req.params.pid));
        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// PUT /api/carts/:cid/product/:pid/quantity
router.put('/:cid/product/:pid/quantity', async (req, res) => {
    const quantity = req.body.quantity;
    if (quantity === undefined || quantity < 0) {
        return res.status(400).json({ error: 'Cantidad inválida' });
    }

    try {
        const cart = await cartManager.updateProductQuantity(parseInt(req.params.cid), parseInt(req.params.pid), quantity);
        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.clearCart(parseInt(req.params.cid));
        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default router;
