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
exports.setupEventListeners = setupEventListeners;
const Contact_js_1 = __importDefault(require("../models/Contact.js"));
const ContactService_js_1 = __importDefault(require("../services/ContactService.js"));
const dom_js_1 = require("./dom.js");
const service = new ContactService_js_1.default();
function setupEventListeners() {
    const form = document.getElementById('contact-form');
    const list = document.getElementById('contact-list');
    const searchInput = document.getElementById('search');
    if (!form || !list)
        return;
    // Affichage initial
    void refreshList();
    form.addEventListener('submit', (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        event.preventDefault();
        (0, dom_js_1.clearAlert)();
        const formData = new FormData(form);
        const contact = new Contact_js_1.default({
            id: 0, // l’API génère l’ID
            nom: String((_a = formData.get('nom')) !== null && _a !== void 0 ? _a : ''),
            email: String((_b = formData.get('email')) !== null && _b !== void 0 ? _b : ''),
            telephone: String((_c = formData.get('telephone')) !== null && _c !== void 0 ? _c : ''),
            societe: String((_d = formData.get('societe')) !== null && _d !== void 0 ? _d : ''),
            fonction: String((_e = formData.get('fonction')) !== null && _e !== void 0 ? _e : ''),
            statut: (_f = formData.get('statut')) !== null && _f !== void 0 ? _f : 'prospect',
            source: String((_g = formData.get('source')) !== null && _g !== void 0 ? _g : ''),
        });
        try {
            const result = yield service.add(contact);
            if (!result.success) {
                (0, dom_js_1.showAlert)(result.errors.join(' '), 'error');
                return;
            }
            form.reset();
            (0, dom_js_1.showAlert)('Contact ajouté avec succès.', 'success');
            yield refreshList();
        }
        catch (_h) {
            (0, dom_js_1.showAlert)('Erreur réseau ou serveur lors de l’ajout.', 'error');
        }
    }));
    // Suppression (délégation d’événements)
    list.addEventListener('click', (event) => __awaiter(this, void 0, void 0, function* () {
        const target = event.target;
        if (!target.classList.contains('btn-danger'))
            return;
        const li = target.closest('li');
        if (!(li === null || li === void 0 ? void 0 : li.dataset.id))
            return;
        const id = Number(li.dataset.id);
        try {
            yield service.remove(id);
            (0, dom_js_1.showAlert)('Contact supprimé.', 'success');
            yield refreshList();
        }
        catch (_a) {
            (0, dom_js_1.showAlert)('Erreur réseau ou serveur lors de la suppression.', 'error');
        }
    }));
    // Recherche simple (filtrage côté client)
    if (searchInput) {
        searchInput.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
            const term = searchInput.value.toLowerCase();
            try {
                const contacts = yield service.getAll();
                const filtered = contacts.filter(c => c.nom.toLowerCase().includes(term) ||
                    c.email.toLowerCase().includes(term));
                (0, dom_js_1.renderContacts)(filtered);
            }
            catch (_a) {
                (0, dom_js_1.showAlert)('Erreur lors du rafraîchissement de la liste.', 'error');
            }
        }));
    }
}
function refreshList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, dom_js_1.showContactsSkeleton)();
            const contacts = yield service.getAll();
            (0, dom_js_1.renderContacts)(contacts);
        }
        catch (_a) {
            (0, dom_js_1.showAlert)('Impossible de charger les contacts (vérifiez le serveur).', 'error');
        }
    });
}
