export type ContactStatut = 'prospect' | 'client' | 'inactif';

class Contact {
    id: number;
    nom: string;
    email: string;
    telephone: string;
    societe?: string;
    fonction?: string;
    statut: ContactStatut;
    source?: string; // ex : "site web", "LinkedIn"

    constructor(params: {
        id: number;
        nom: string;
        email: string;
        telephone: string;
        societe?: string;
        fonction?: string;
        statut?: ContactStatut;
        source?: string;
    }) {
        this.id = params.id;
        this.nom = params.nom.trim();
        this.email = params.email.trim();
        this.telephone = params.telephone.trim();
        this.societe = params.societe?.trim();
        this.fonction = params.fonction?.trim();
        this.statut = params.statut ?? 'prospect';
        this.source = params.source?.trim();
    }

    validateEmail(): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(this.email);
    }

    validateTelephone(): boolean {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(this.telephone);
    }

    isValid(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (!this.nom) errors.push('Le nom est obligatoire.');
        if (!this.validateEmail()) errors.push('Email invalide.');
        if (!this.validateTelephone()) errors.push('Téléphone invalide (10 chiffres).');
        return { valid: errors.length === 0, errors };
    }
}

export default Contact;