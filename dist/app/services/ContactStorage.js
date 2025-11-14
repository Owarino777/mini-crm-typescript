"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contact_js_1 = __importDefault(require("../models/Contact.js"));
const STORAGE_KEY = 'mini-crm-contacts';
class ContactStorage {
    save(contacts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
    load() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data)
            return [];
        const raw = JSON.parse(data);
        return raw.map(c => new Contact_js_1.default(c));
    }
}
exports.default = ContactStorage;
