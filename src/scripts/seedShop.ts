import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

type ProductJson = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    featured: boolean;
    stock: number;
};

type CustomerJson = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
};

type OrderJson = {
    id: number;
    userId: number;
    productIds: number[];
    total: number;
    status: string;
    createdAt: string;
};

function readJson<T>(relative: string): T {
    const filePath = path.join(__dirname, '..', 'public', 'data', relative);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
}

async function main() {
    const products = readJson<ProductJson[]>('products.json');
    const customers = readJson<CustomerJson[]>('customers.json');
    const orders = readJson<OrderJson[]>('orders.json');

    // Nettoyage des tables pour reseed (dev uniquement)
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.customer.deleteMany({});

    // Produits
    await prisma.product.createMany({
        data: products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            category: p.category,
            featured: p.featured,
            stock: p.stock,
        })),
    });

    // Clients
    await prisma.customer.createMany({
        data: customers.map(c => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            role: c.role,
            password: c.password,
        })),
    });

    // Commandes + OrderItems
    for (const o of orders) {
        await prisma.order.create({
            data: {
                id: o.id,
                userId: o.userId,
                total: o.total,
                status: o.status,
                createdAt: new Date(o.createdAt),
            },
        });

        // items
        await prisma.orderItem.createMany({
            data: o.productIds.map(pid => ({
                orderId: o.id,
                productId: pid,
            })),
        });
    }

    console.log('Seed terminé.');
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });