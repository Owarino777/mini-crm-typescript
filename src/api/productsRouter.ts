import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/products
router.get('/', async (_req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { id: 'asc' },
        });
        res.json(products);
    } catch (err) {
        console.error('GET /api/products error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({ error: 'Produit introuvable.' });
        }
        res.json(product);
    } catch (err) {
        console.error('GET /api/products/:id error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

export default router;