import type { Order } from '../types/shop.js';

const BASE_URL = '/api';

type PrismaOrder = {
    id: number;
    userId: number;
    total: number;
    status: string;
    createdAt: string;
    items?: { productId: number }[];
};

export default class OrdersService {
    private cache?: Order[];

    async getAll(): Promise<Order[]> {
        if (this.cache) return this.cache;
        const res = await fetch(`${BASE_URL}/orders`);
        if (!res.ok) {
            throw new Error('Impossible de charger la liste des commandes.');
        }
        const data = await res.json() as PrismaOrder[];

        // Mapping API Prisma -> type front (avec productIds)
        const mapped: Order[] = data.map(o => ({
            id: o.id,
            userId: o.userId,
            total: o.total,
            status: o.status as Order['status'],
            createdAt: o.createdAt,
            productIds: (o.items ?? []).map(i => i.productId),
        }));

        this.cache = mapped;
        return this.cache;
    }
}