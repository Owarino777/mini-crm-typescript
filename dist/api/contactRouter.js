"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//// filepath: c:\Users\malik\M1-DFS 2025-2026\mini-crm-typescript\src\api\contactsRouter.ts
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const DATA_DIR = path_1.default.join(__dirname, '..', 'data');
const DATA_FILE = path_1.default.join(DATA_DIR, 'contacts.json');
// --- Utilitaires sécurisés de lecture / écriture ---
function ensureDataDir() {
    if (!fs_1.default.existsSync(DATA_DIR)) {
        fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    }
}
function readContacts() {
    ensureDataDir();
    if (!fs_1.default.existsSync(DATA_FILE)) {
        return [];
    }
    try {
        const content = fs_1.default.readFileSync(DATA_FILE, 'utf-8');
        if (!content.trim())
            return [];
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed))
            return [];
        return parsed;
    }
    catch (_a) {
        // Si le fichier est corrompu on repart d'une base saine
        return [];
    }
}
function writeContacts(contacts) {
    ensureDataDir();
    const tmpFile = DATA_FILE + '.tmp';
    // Écriture atomique pour éviter la corruption (sécurité / robustesse)
    fs_1.default.writeFileSync(tmpFile, JSON.stringify(contacts, null, 2), { encoding: 'utf-8' });
    fs_1.default.renameSync(tmpFile, DATA_FILE);
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
router.get('/', (req, res) => {
    const contacts = readContacts();
    // Pas de données sensibles -> renvoi direct
    res.json(contacts);
});
// Ajout d'un contact
router.post('/', (req, res) => {
    const validation = validateContactPayload(req.body);
    if (!validation.valid || !validation.data) {
        return res.status(400).json({ errors: validation.errors });
    }
    const contacts = readContacts();
    // ID simple mais unique (timestamp). Pour un vrai système : UUID.
    const newContact = Object.assign({ id: Date.now() }, validation.data);
    contacts.push(newContact);
    writeContacts(contacts);
    res.status(201).json(newContact);
});
// Suppression d'un contact
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }
    const contacts = readContacts();
    const remaining = contacts.filter(c => c.id !== id);
    if (remaining.length === contacts.length) {
        return res.status(404).json({ error: 'Contact introuvable.' });
    }
    writeContacts(remaining);
    res.status(204).end();
});
exports.default = router;
