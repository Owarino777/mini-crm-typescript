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
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// En attendant l’auth : owner par défaut
const DEFAULT_USER_ID = 1;
// --- Helpers ---
function ensureDefaultUser() {
    return __awaiter(this, void 0, void 0, function* () {
        // On vérifie si un user #1 existe, sinon on le crée
        const existing = yield prisma.user.findUnique({ where: { id: DEFAULT_USER_ID } });
        if (existing)
            return;
        yield prisma.user.create({
            data: {
                id: DEFAULT_USER_ID,
                email: 'default@example.com',
                password: 'TEMP_PASSWORD_CHANGE_ME', // pas utilisé pour le moment
                name: 'Default User',
                role: client_1.UserRole.USER,
            },
        });
    });
}
// --- Validation d'entrée côté serveur (sécurité) ---
function sanitizeString(value, maxLength = 255) {
    if (typeof value !== 'string')
        return '';
    return value.trim().slice(0, maxLength);
}
function validateContactPayload(body) {
    var _a, _b, _c, _d;
    const errors = [];
    const nom = sanitizeString(body.nom);
    const email = sanitizeString(body.email);
    const telephone = sanitizeString(body.telephone);
    const societe = sanitizeString((_a = body.societe) !== null && _a !== void 0 ? _a : '');
    const fonction = sanitizeString((_b = body.fonction) !== null && _b !== void 0 ? _b : '');
    const statut = (_c = body.statut) !== null && _c !== void 0 ? _c : 'prospect';
    const source = sanitizeString((_d = body.source) !== null && _d !== void 0 ? _d : '');
    if (!nom)
        errors.push('Le nom est obligatoire.');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
        errors.push('Email invalide.');
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(telephone))
        errors.push('Téléphone invalide (10 chiffres).');
    if (!['prospect', 'client', 'inactif'].includes(statut)) {
        errors.push('Statut invalide.');
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return {
        valid: true,
        errors: [],
        data: { nom, email, telephone, societe, fonction, statut, source },
    };
}
// --- Routes ---
// Liste des contacts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ensureDefaultUser();
        const contacts = yield prisma.contact.findMany({
            where: { userId: DEFAULT_USER_ID },
            orderBy: { nom: 'asc' },
        });
        res.json(contacts);
    }
    catch (err) {
        console.error('GET /api/contacts error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}));
// Ajout d'un contact
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = validateContactPayload(req.body);
    if (!validation.valid || !validation.data) {
        return res.status(400).json({ errors: validation.errors });
    }
    try {
        yield ensureDefaultUser();
        const created = yield prisma.contact.create({
            data: {
                nom: validation.data.nom,
                email: validation.data.email,
                telephone: validation.data.telephone,
                societe: validation.data.societe || null,
                fonction: validation.data.fonction || null,
                statut: validation.data.statut,
                source: validation.data.source || null,
                // on relie au user #1
                user: {
                    connect: { id: DEFAULT_USER_ID },
                },
            },
        });
        res.status(201).json(created);
    }
    catch (err) {
        console.error('POST /api/contacts error', err);
        res.status(500).json({ errors: ['Erreur serveur lors de la création du contact.'] });
    }
}));
// Suppression d'un contact
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }
    try {
        yield prisma.contact.delete({
            where: { id },
        });
        res.status(204).end();
    }
    catch (err) {
        console.error('DELETE /api/contacts/:id error', err);
        return res.status(404).json({ error: 'Contact introuvable.' });
    }
}));
exports.default = router;
