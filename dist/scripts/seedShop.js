"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function readJson(relative) {
    const filePath = path_1.default.join(__dirname, '..', 'public', 'data', relative);
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const products = readJson('products.json');
        const customers = readJson('customers.json');
        const orders = readJson('orders.json');
        // Nettoyage des tables pour reseed (dev uniquement)
        yield prisma.orderItem.deleteMany({});
        yield prisma.order.deleteMany({});
        yield prisma.product.deleteMany({});
        yield prisma.customer.deleteMany({});
        // Produits
        yield prisma.product.createMany({
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
        yield prisma.customer.createMany({
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
            yield prisma.order.create({
                data: {
                    id: o.id,
                    userId: o.userId,
                    total: o.total,
                    status: o.status,
                    createdAt: new Date(o.createdAt),
                },
            });
            // items
            yield prisma.orderItem.createMany({
                data: o.productIds.map(pid => ({
                    orderId: o.id,
                    productId: pid,
                })),
            });
        }
        console.log('Seed terminé.');
    });
}
main()
    .catch(err => {
    console.error(err);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
