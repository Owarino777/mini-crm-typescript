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
// GET /api/orders
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany({
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
    }
    catch (err) {
        console.error('GET /api/orders error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}));
// GET /api/orders/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }
    try {
        const order = yield prisma.order.findUnique({
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
    }
    catch (err) {
        console.error('GET /api/orders/:id error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}));
exports.default = router;
