import type { Customer } from '../types/shop.js';

const BASE_URL = '/data';

export default class CustomersService {
    async getAll(): Promise<Customer[]> {
        const res = await fetch(`${BASE_URL}/customers.json`);
        if (!res.ok) {
            throw new Error('Impossible de charger la liste des clients.');
        }
        return await res.json() as Customer[];
    }
}