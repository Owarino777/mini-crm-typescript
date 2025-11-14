import type { Order } from '../types/shop.js';

const BASE_URL = '/data';

export default class OrdersService {
    async getAll(): Promise<Order[]> {
        const res = await fetch(`${BASE_URL}/orders.json`);
        if (!res.ok) {
            throw new Error('Impossible de charger la liste des commandes.');
        }
        return await res.json() as Order[];
    }
}