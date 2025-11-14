import Contact from '../models/Contact.js';

const STORAGE_KEY = 'mini-crm-contacts';

export default class ContactStorage {
    save(contacts: Contact[]): void {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(contacts)
        );
    }

    load(): Contact[] {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const raw = JSON.parse(data) as any[];
        return raw.map(c => new Contact(c));
    }
}