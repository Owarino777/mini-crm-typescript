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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//// filepath: c:\Users\malik\M1-DFS 2025-2026\mini-crm-typescript\src\app\services\ContactService.ts
const Contact_js_1 = __importDefault(require("../models/Contact.js"));
const API_URL = '/api/contacts';
class ContactService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!res.ok) {
                // Ne pas exposer d’infos internes à l’utilisateur
                throw new Error('Erreur lors du chargement des contacts.');
            }
            const data = yield res.json();
            return data.map(c => new Contact_js_1.default(c));
        });
    }
    add(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Validation côté front (UX) + revalidation côté serveur (sécurité)
            const { valid, errors } = contact.isValid();
            if (!valid)
                return { success: false, errors };
            const res = yield fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(contact),
            });
            if (res.status === 400) {
                const body = yield res.json().catch(() => ({}));
                return { success: false, errors: (_a = body.errors) !== null && _a !== void 0 ? _a : ['Données invalides.'] };
            }
            if (!res.ok) {
                return { success: false, errors: ['Erreur serveur inattendue.'] };
            }
            return { success: true };
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!res.ok && res.status !== 404) {
                // On ne remonte pas le détail pour éviter de leak l’implémentation
                throw new Error('Erreur lors de la suppression du contact.');
            }
        });
    }
}
exports.default = ContactService;
