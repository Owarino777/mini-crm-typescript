//// filepath: c:\Users\malik\M1-DFS 2025-2026\mini-crm-typescript\src\app\services\ContactService.ts
import Contact from '../models/Contact.js';

const API_URL = '/api/contacts';

export default class ContactService {
    async getAll(): Promise<Contact[]> {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!res.ok) {
            // Ne pas exposer d’infos internes à l’utilisateur
            throw new Error('Erreur lors du chargement des contacts.');
        }

        const data = await res.json() as any[];
        return data.map(c => new Contact(c));
    }

    async add(contact: Contact): Promise<{ success: boolean; errors?: string[] }> {
        // Validation côté front (UX) + revalidation côté serveur (sécurité)
        const { valid, errors } = contact.isValid();
        if (!valid) return { success: false, errors };

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(contact),
        });

        if (res.status === 400) {
            const body = await res.json().catch(() => ({}));
            return { success: false, errors: body.errors ?? ['Données invalides.'] };
        }

        if (!res.ok) {
            return { success: false, errors: ['Erreur serveur inattendue.'] };
        }

        return { success: true };
    }

    async remove(id: number): Promise<void> {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!res.ok && res.status !== 404) {
            // On ne remonte pas le détail pour éviter de leak l’implémentation
            throw new Error('Erreur lors de la suppression du contact.');
        }
    }
}