"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const contactsRouter_1 = __importDefault(require("./api/contactsRouter"));
const productsRouter_1 = __importDefault(require("./api/productsRouter"));
const customersRouter_1 = __importDefault(require("./api/customersRouter"));
const ordersRouter_1 = __importDefault(require("./api/ordersRouter"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.disable('x-powered-by');
app.use(express_1.default.json({ limit: '100kb' }));
const publicPath = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(publicPath));
// API REST
app.use('/api/contacts', contactsRouter_1.default);
app.use('/api/products', productsRouter_1.default);
app.use('/api/customers', customersRouter_1.default);
app.use('/api/orders', ordersRouter_1.default);
// Route principale
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
