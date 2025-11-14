import express, { Request, Response } from 'express';
import path from 'path';
import contactsRouter from './api/contactsRouter';
import productsRouter from './api/productsRouter';
import customersRouter from './api/customersRouter';
import ordersRouter from './api/ordersRouter';

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// API REST
app.use('/api/contacts', contactsRouter);
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);

// Route principale
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});