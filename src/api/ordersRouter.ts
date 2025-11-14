import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/orders
router.get('/', async (_req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { id: 'asc' },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        res.json(orders);
    } catch (err) {
        console.error('GET /api/orders error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// GET /api/orders/:id
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande introuvable.' });
        }

        res.json(order);
    } catch (err) {
        console.error('GET /api/orders/:id error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

export default router;