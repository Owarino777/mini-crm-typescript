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
// GET /api/products
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            orderBy: { id: 'asc' },
        });
        res.json(products);
    }
    catch (err) {
        console.error('GET /api/products error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}));
// GET /api/products/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }
    try {
        const product = yield prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({ error: 'Produit introuvable.' });
        }
        res.json(product);
    }
    catch (err) {
        console.error('GET /api/products/:id error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}));
exports.default = router;
