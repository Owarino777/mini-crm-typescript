"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Contact {
    constructor(params) {
        var _a, _b, _c, _d;
        this.id = params.id;
        this.nom = params.nom.trim();
        this.email = params.email.trim();
        this.telephone = params.telephone.trim();
        this.societe = (_a = params.societe) === null || _a === void 0 ? void 0 : _a.trim();
        this.fonction = (_b = params.fonction) === null || _b === void 0 ? void 0 : _b.trim();
        this.statut = (_c = params.statut) !== null && _c !== void 0 ? _c : 'prospect';
        this.source = (_d = params.source) === null || _d === void 0 ? void 0 : _d.trim();
    }
    validateEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(this.email);
    }
    validateTelephone() {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(this.telephone);
    }
    isValid() {
        const errors = [];
        if (!this.nom)
            errors.push('Le nom est obligatoire.');
        if (!this.validateEmail())
            errors.push('Email invalide.');
        if (!this.validateTelephone())
            errors.push('Téléphone invalide (10 chiffres).');
        return { valid: errors.length === 0, errors };
    }
}
exports.default = Contact;
