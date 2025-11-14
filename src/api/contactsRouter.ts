import { Router, Request, Response } from 'express';
import { PrismaClient, Statut as PrismaStatut, UserRole } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// En attendant l’auth : owner par défaut
const DEFAULT_USER_ID = 1;

type ContactStatut = 'prospect' | 'client' | 'inactif';

interface ContactRecord {
    id: number;
    nom: string;
    email: string;
    telephone: string;
    societe?: string;
    fonction?: string;
    statut: ContactStatut;
    source?: string;
}

// --- Helpers ---

async function ensureDefaultUser(): Promise<void> {
    // On vérifie si un user #1 existe, sinon on le crée
    const existing = await prisma.user.findUnique({ where: { id: DEFAULT_USER_ID } });
    if (existing) return;

    await prisma.user.create({
        data: {
            id: DEFAULT_USER_ID,
            email: 'default@example.com',
            password: 'TEMP_PASSWORD_CHANGE_ME', // pas utilisé pour le moment
            name: 'Default User',
            role: UserRole.USER,
        },
    });
}

// --- Validation d'entrée côté serveur (sécurité) ---

function sanitizeString(value: unknown, maxLength = 255): string {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
}

function validateContactPayload(body: any): { valid: boolean; errors: string[]; data?: Omit<ContactRecord, 'id'> } {
    const errors: string[] = [];

    const nom = sanitizeString(body.nom);
    const email = sanitizeString(body.email);
    const telephone = sanitizeString(body.telephone);
    const societe = sanitizeString(body.societe ?? '');
    const fonction = sanitizeString(body.fonction ?? '');
    const statut = (body.statut as ContactStatut) ?? 'prospect';
    const source = sanitizeString(body.source ?? '');

    if (!nom) errors.push('Le nom est obligatoire.');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) errors.push('Email invalide.');
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(telephone)) errors.push('Téléphone invalide (10 chiffres).');
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
router.get('/', async (req: Request, res: Response) => {
    try {
        await ensureDefaultUser();

        const contacts = await prisma.contact.findMany({
            where: { userId: DEFAULT_USER_ID },
            orderBy: { nom: 'asc' },
        });
        res.json(contacts);
    } catch (err) {
        console.error('GET /api/contacts error', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// Ajout d'un contact
router.post('/', async (req: Request, res: Response) => {
    const validation = validateContactPayload(req.body);
    if (!validation.valid || !validation.data) {
        return res.status(400).json({ errors: validation.errors });
    }

    try {
        await ensureDefaultUser();

        const created = await prisma.contact.create({
            data: {
                nom: validation.data.nom,
                email: validation.data.email,
                telephone: validation.data.telephone,
                societe: validation.data.societe || null,
                fonction: validation.data.fonction || null,
                statut: validation.data.statut as PrismaStatut,
                source: validation.data.source || null,
                // on relie au user #1
                user: {
                    connect: { id: DEFAULT_USER_ID },
                },
            },
        });

        res.status(201).json(created);
    } catch (err) {
        console.error('POST /api/contacts error', err);
        res.status(500).json({ errors: ['Erreur serveur lors de la création du contact.'] });
    }
});

// Suppression d'un contact
router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'ID invalide.' });
    }

    try {
        await prisma.contact.delete({
            where: { id },
        });
        res.status(204).end();
    } catch (err: any) {
        console.error('DELETE /api/contacts/:id error', err);
        return res.status(404).json({ error: 'Contact introuvable.' });
    }
});

export default router;