"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// GET /api/customers
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customer.findMany({
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
    }
    catch (err) {
        console.error('GET /api/customers error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}));
// GET /api/customers/:id (avec commandes + produits)
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }
    try {
        const customer = yield prisma.customer.findUnique({
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
    }
    catch (err) {
        console.error('GET /api/customers/:id error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}));
exports.default = router;
