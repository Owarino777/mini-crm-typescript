//// filepath: c:\Users\malik\M1-DFS 2025-2026\mini-crm-typescript\src\app\ui\events.ts
import Contact from '../models/Contact.js';
import ContactService from '../services/ContactService.js';
import { renderContacts, showAlert, clearAlert } from './dom.js';

const service = new ContactService();

export function setupEventListeners(): void {
    const form = document.getElementById('contact-form') as HTMLFormElement | null;
    const list = document.getElementById('contact-list') as HTMLUListElement | null;
    const searchInput = document.getElementById('search') as HTMLInputElement | null;

    if (!form || !list) return;

    // Affichage initial
    void refreshList();

    form.addEventListener('submit', async event => {
        event.preventDefault();
        clearAlert();

        const formData = new FormData(form);
        const contact = new Contact({
            id: 0, // l’API génère l’ID
            nom: String(formData.get('nom') ?? ''),
            email: String(formData.get('email') ?? ''),
            telephone: String(formData.get('telephone') ?? ''),
            societe: String(formData.get('societe') ?? ''),
            fonction: String(formData.get('fonction') ?? ''),
            statut: (formData.get('statut') as any) ?? 'prospect',
            source: String(formData.get('source') ?? ''),
        });

        try {
            const result = await service.add(contact);
            if (!result.success) {
                showAlert(result.errors!.join(' '), 'error');
                return;
            }

            form.reset();
            showAlert('Contact ajouté avec succès.', 'success');
            await refreshList();
        } catch {
            showAlert('Erreur réseau ou serveur lors de l’ajout.', 'error');
        }
    });

    // Suppression (délégation d’événements)
    list.addEventListener('click', async event => {
        const target = event.target as HTMLElement;
        if (!target.classList.contains('btn-danger')) return;

        const li = target.closest('li') as HTMLLIElement | null;
        if (!li?.dataset.id) return;

        const id = Number(li.dataset.id);

        try {
            await service.remove(id);
            showAlert('Contact supprimé.', 'success');
            await refreshList();
        } catch {
            showAlert('Erreur réseau ou serveur lors de la suppression.', 'error');
        }
    });

    // Recherche simple (filtrage côté client)
    if (searchInput) {
        searchInput.addEventListener('input', async () => {
            const term = searchInput.value.toLowerCase();
            try {
                const contacts = await service.getAll();
                const filtered = contacts.filter(c =>
                    c.nom.toLowerCase().includes(term) ||
                    c.email.toLowerCase().includes(term)
                );
                renderContacts(filtered);
            } catch {
                showAlert('Erreur lors du rafraîchissement de la liste.', 'error');
            }
        });
    }
}

async function refreshList(): Promise<void> {
    try {
        const contacts = await service.getAll();
        renderContacts(contacts);
    } catch {
        showAlert('Impossible de charger les contacts (vérifiez le serveur).', 'error');
    }
}