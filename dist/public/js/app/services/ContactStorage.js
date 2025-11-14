import Contact from '../models/Contact.js';
const STORAGE_KEY = 'mini-crm-contacts';
export default class ContactStorage {
    save(contacts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
    load() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data)
            return [];
        const raw = JSON.parse(data);
        return raw.map(c => new Contact(c));
    }
}
