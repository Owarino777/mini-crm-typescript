import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/customers
router.get('/', async (_req: Request, res: Response) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { id: 'asc' },
        });
        // On évite d'exposer le mot de passe
        res.json(customers.map(c => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            role: c.role,
        })));
    } catch (err) {
        console.error('GET /api/customers error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// GET /api/customers/:id (avec commandes + produits)
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }

    try {
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                orders: {
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Client introuvable.' });
        }

        res.json({
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            role: customer.role,
            orders: customer.orders.map(o => ({
                id: o.id,
                total: o.total,
                status: o.status,
                createdAt: o.createdAt,
                items: o.items.map(item => ({
                    productId: item.productId,
                    product: item.product,
                })),
            })),
        });
    } catch (err) {
        console.error('GET /api/customers/:id error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

export default router;