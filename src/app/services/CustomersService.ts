import type { Customer } from '../types/shop.js';

const BASE_URL = '/api';

export default class CustomersService {
    private cache?: Customer[];

    async getAll(): Promise<Customer[]> {
        if (this.cache) return this.cache;
        const res = await fetch(`${BASE_URL}/customers`);
        if (!res.ok) {
            throw new Error('Impossible de charger la liste des clients.');
        }
        this.cache = await res.json() as Customer[];
        return this.cache;
    }
}