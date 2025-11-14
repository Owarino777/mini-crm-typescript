var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ProductsService from '../services/ProductsService.js';
import CustomersService from '../services/CustomersService.js';
import OrdersService from '../services/OrdersService.js';
const productsService = new ProductsService();
const customersService = new CustomersService();
const ordersService = new OrdersService();
function createButton(id, label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = id;
    btn.className = 'btn btn-primary';
    btn.textContent = label;
    return btn;
}
function getViewContainer() {
    return document.getElementById('shop-view');
}
function clearView() {
    const container = getViewContainer();
    if (!container)
        return null;
    container.innerHTML = '';
    return container;
}
function createBackButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = label;
    btn.addEventListener('click', () => onClick());
    return btn;
}
/* ---------- VUES DÉTAILLÉES ---------- */
function showProductDetails(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = clearView();
        if (!container)
            return;
        try {
            const products = yield productsService.getAll();
            const product = products.find(p => p.id === productId);
            if (!product) {
                container.textContent = `Produit #${productId} introuvable.`;
                return;
            }
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            const title = document.createElement('h3');
            title.textContent = `Fiche produit #${product.id}`;
            header.appendChild(title);
            header.appendChild(createBackButton('← Retour à la liste des produits', () => {
                void showProducts();
            }));
            container.appendChild(header);
            const dl = document.createElement('dl');
            dl.innerHTML = `
            <dt>Nom</dt><dd>${product.name}</dd>
            <dt>Description</dt><dd>${product.description}</dd>
            <dt>Prix</dt><dd>${product.price.toFixed(2)} €</dd>
            <dt>Catégorie</dt><dd>${product.category}</dd>
            <dt>En vitrine</dt><dd>${product.featured ? 'Oui' : 'Non'}</dd>
            <dt>Stock</dt><dd>${product.stock}</dd>
            <dt>Image</dt><dd>${product.image}</dd>
        `;
            dl.className = 'detail-list';
            container.appendChild(dl);
        }
        catch (error) {
            container.textContent = String(error);
        }
    });
}
function showCustomerDetails(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = clearView();
        if (!container)
            return;
        try {
            const [customers, orders, products] = yield Promise.all([
                customersService.getAll(),
                ordersService.getAll(),
                productsService.getAll(),
            ]);
            const customer = customers.find(c => c.id === customerId);
            if (!customer) {
                container.textContent = `Client #${customerId} introuvable.`;
                return;
            }
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            const title = document.createElement('h3');
            title.textContent = `Fiche client #${customer.id}`;
            header.appendChild(title);
            header.appendChild(createBackButton('← Retour à la liste des clients', () => {
                void showCustomers();
            }));
            container.appendChild(header);
            const dl = document.createElement('dl');
            const fullName = `${customer.firstName} ${customer.lastName}`;
            dl.innerHTML = `
            <dt>Nom complet</dt><dd>${fullName}</dd>
            <dt>Email</dt><dd>${customer.email}</dd>
            <dt>Rôle</dt><dd>${customer.role}</dd>
        `;
            dl.className = 'detail-list';
            container.appendChild(dl);
            // Commandes de ce client
            const customerOrders = orders.filter(o => o.userId === customer.id);
            const sectionOrders = document.createElement('section');
            const h4 = document.createElement('h4');
            h4.textContent = `Commandes de ${fullName} (${customerOrders.length})`;
            sectionOrders.appendChild(h4);
            if (customerOrders.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'Aucune commande pour ce client.';
                sectionOrders.appendChild(p);
            }
            else {
                customerOrders.forEach(order => {
                    const orderDiv = document.createElement('div');
                    orderDiv.className = 'order-card';
                    const orderTitle = document.createElement('h5');
                    orderTitle.textContent = `Commande #${order.id} — ${order.total.toFixed(2)} € — ${order.status}`;
                    orderDiv.appendChild(orderTitle);
                    const list = document.createElement('ul');
                    order.productIds.forEach(pid => {
                        const prod = products.find(p => p.id === pid);
                        const li = document.createElement('li');
                        li.textContent = prod
                            ? `${prod.name} — ${prod.price.toFixed(2)} € (${prod.category})`
                            : `Produit #${pid} (inconnu)`;
                        list.appendChild(li);
                    });
                    orderDiv.appendChild(list);
                    sectionOrders.appendChild(orderDiv);
                });
            }
            container.appendChild(sectionOrders);
        }
        catch (error) {
            container.textContent = String(error);
        }
    });
}
/* On prépare aussi une vue détaillée de commande si tu veux l'utiliser plus tard */
function showOrderDetails(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = clearView();
        if (!container)
            return;
        try {
            const [orders, products, customers] = yield Promise.all([
                ordersService.getAll(),
                productsService.getAll(),
                customersService.getAll(),
            ]);
            const order = orders.find(o => o.id === orderId);
            if (!order) {
                container.textContent = `Commande #${orderId} introuvable.`;
                return;
            }
            const customer = customers.find(c => c.id === order.userId);
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            const title = document.createElement('h3');
            title.textContent = `Fiche commande #${order.id}`;
            header.appendChild(title);
            header.appendChild(createBackButton('← Retour aux produits avec achats', () => {
                void showProductsWithOrders();
            }));
            container.appendChild(header);
            const dl = document.createElement('dl');
            dl.innerHTML = `
            <dt>Total</dt><dd>${order.total.toFixed(2)} €</dd>
            <dt>Statut</dt><dd>${order.status}</dd>
            <dt>Date</dt><dd>${new Date(order.createdAt).toLocaleString()}</dd>
            <dt>Client</dt><dd>${customer ? customer.firstName + ' ' + customer.lastName : 'Inconnu'}</dd>
        `;
            dl.className = 'detail-list';
            container.appendChild(dl);
            const h4 = document.createElement('h4');
            h4.textContent = 'Produits de la commande';
            container.appendChild(h4);
            const list = document.createElement('ul');
            order.productIds.forEach(pid => {
                const prod = products.find(p => p.id === pid);
                const li = document.createElement('li');
                li.textContent = prod
                    ? `${prod.name} — ${prod.price.toFixed(2)} € (${prod.category})`
                    : `Produit #${pid} (inconnu)`;
                list.appendChild(li);
            });
            container.appendChild(list);
        }
        catch (error) {
            container.textContent = String(error);
        }
    });
}
/* ---------- VUES LISTES ---------- */
function showProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = clearView();
        if (!container)
            return;
        try {
            const products = yield productsService.getAll();
            const list = document.createElement('ul');
            products.forEach((p) => {
                const preview = {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    category: p.category,
                };
                const li = document.createElement('li');
                li.textContent = `${preview.name} — ${preview.price.toFixed(2)} € — ${preview.category}`;
                li.className = 'clickable';
                li.addEventListener('click', () => {
                    void showProductDetails(preview.id);
                });
                list.appendChild(li);
            });
            container.appendChild(list);
        }
        catch (error) {
            container.textContent = String(error);
        }
    });
}
function showProductsWithOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = clearView();
        if (!container)
            return;
        try {
            const [products, orders] = yield Promise.all([
                productsService.getAll(),
                ordersService.getAll(),
            ]);
            const productById = {};
            products.forEach(p => {
                productById[p.id] = {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    category: p.category,
                };
            });
            orders.forEach((order) => {
                const section = document.createElement('section');
                section.className = 'order-section';
                const title = document.createElement('h3');
                title.textContent = `Commande #${order.id} — total ${order.total.toFixed(2)} € — statut: ${order.status}`;
                title.className = 'clickable';
                // Si tu veux un clic sur le titre de la commande :
                title.addEventListener('click', () => {
                    void showOrderDetails(order.id);
                });
                section.appendChild(title);
                const list = document.createElement('ul');
                order.productIds.forEach(pid => {
                    const prod = productById[pid];
                    const li = document.createElement('li');
                    if (prod) {
                        li.textContent = `${prod.name} — ${prod.price.toFixed(2)} € (${prod.category})`;
                        li.className = 'clickable';
                        li.addEventListener('click', () => {
                            void showProductDetails(prod.id);
                        });
                    }
                    else {
                        li.textContent = `Produit #${pid} (inconnu)`;
                    }
                    list.appendChild(li);
                });
                section.appendChild(list);
                container.appendChild(section);
            });
        }
        catch (error) {
            container.textContent = String(error);
        }
    });
}
function showCustomers() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = clearView();
        if (!container)
            return;
        try {
            const customers = yield customersService.getAll();
            const list = document.createElement('ul');
            customers.forEach((c) => {
                const li = document.createElement('li');
                const fullName = `${c.firstName} ${c.lastName}`;
                li.textContent = `${fullName} — ${c.email} — rôle: ${c.role}`;
                li.className = 'clickable';
                li.addEventListener('click', () => {
                    void showCustomerDetails(c.id);
                });
                list.appendChild(li);
            });
            container.appendChild(list);
        }
        catch (error) {
            container.textContent = String(error);
        }
    });
}
/* ---------- INITIALISATION ---------- */
export function setupShopUI() {
    const toolbar = document.getElementById('shop-toolbar');
    if (!toolbar)
        return;
    const btnProducts = createButton('btn-products', 'Liste des produits');
    const btnProductsOrders = createButton('btn-products-orders', 'Produits avec achats');
    const btnCustomers = createButton('btn-customers', 'Liste des clients');
    toolbar.appendChild(btnProducts);
    toolbar.appendChild(btnProductsOrders);
    toolbar.appendChild(btnCustomers);
    btnProducts.addEventListener('click', () => { void showProducts(); });
    btnProductsOrders.addEventListener('click', () => { void showProductsWithOrders(); });
    btnCustomers.addEventListener('click', () => { void showCustomers(); });
}
