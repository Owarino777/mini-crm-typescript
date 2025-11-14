import ProductsService from '../services/ProductsService.js';
import CustomersService from '../services/CustomersService.js';
import OrdersService from '../services/OrdersService.js';
import type { ProductPreview, Customer, Order, Product } from '../types/shop.js';

const productsService = new ProductsService();
const customersService = new CustomersService();
const ordersService = new OrdersService();

function createButton(id: string, label: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = id;
    btn.className = 'btn btn-primary';
    btn.textContent = label;
    return btn;
}

function getViewContainer(): HTMLDivElement | null {
    return document.getElementById('shop-view') as HTMLDivElement | null;
}

function clearView(): HTMLDivElement | null {
    const container = getViewContainer();
    if (!container) return null;
    container.innerHTML = '';
    return container;
}

function createBackButton(label: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = label;
    btn.addEventListener('click', () => onClick());
    return btn;
}

/* ---------- VUES DÉTAILLÉES ---------- */

async function showProductDetails(productId: number) {
    const container = clearView();
    if (!container) return;

    try {
        const products = await productsService.getAll();
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
    } catch (error) {
        container.textContent = String(error);
    }
}

async function showCustomerDetails(customerId: number) {
    const container = clearView();
    if (!container) return;

    try {
        const [customers, orders, products] = await Promise.all([
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
        } else {
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
    } catch (error) {
        container.textContent = String(error);
    }
}

/* On prépare aussi une vue détaillée de commande si tu veux l'utiliser plus tard */
async function showOrderDetails(orderId: number) {
    const container = clearView();
    if (!container) return;

    try {
        const [orders, products, customers] = await Promise.all([
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
    } catch (error) {
        container.textContent = String(error);
    }
}

/* ---------- VUES LISTES ---------- */

async function showProducts() {
    const container = clearView();
    if (!container) return;

    try {
        const products = await productsService.getAll();
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';

        products.forEach((p: Product) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.addEventListener('click', () => {
                void showProductDetails(p.id);
            });

            const header = document.createElement('div');
            header.className = 'card-header';
            
            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = p.name;
            
            const price = document.createElement('div');
            price.className = 'card-price';
            price.textContent = `${p.price.toFixed(2)} €`;
            
            header.appendChild(title);
            header.appendChild(price);
            card.appendChild(header);

            const description = document.createElement('p');
            description.className = 'card-description';
            description.textContent = p.description;
            card.appendChild(description);

            const body = document.createElement('div');
            body.className = 'card-body';
            
            const categoryField = document.createElement('div');
            categoryField.className = 'card-field';
            categoryField.innerHTML = `
                <span class="card-label">Catégorie</span>
                <span class="card-value">${p.category}</span>
            `;
            body.appendChild(categoryField);

            const stockField = document.createElement('div');
            stockField.className = 'card-field';
            const stockBadgeClass = p.stock === 0 ? 'badge-stock-out' : p.stock < 20 ? 'badge-stock-low' : 'badge-stock-ok';
            stockField.innerHTML = `
                <span class="card-label">Stock</span>
                <span class="card-badge ${stockBadgeClass}">${p.stock} unités</span>
            `;
            body.appendChild(stockField);

            card.appendChild(body);

            const footer = document.createElement('div');
            footer.className = 'card-footer';
            
            const categoryBadge = document.createElement('span');
            categoryBadge.className = `card-badge badge-${p.category}`;
            categoryBadge.textContent = p.category;
            footer.appendChild(categoryBadge);

            if (p.featured) {
                const featuredBadge = document.createElement('span');
                featuredBadge.className = 'card-badge badge-featured';
                featuredBadge.textContent = '⭐ En vitrine';
                footer.appendChild(featuredBadge);
            }

            card.appendChild(footer);
            cardGrid.appendChild(card);
        });

        container.appendChild(cardGrid);
    } catch (error) {
        container.textContent = String(error);
    }
}

async function showProductsWithOrders() {
    const container = clearView();
    if (!container) return;

    try {
        const [products, orders] = await Promise.all([
            productsService.getAll(),
            ordersService.getAll(),
        ]);

        const productById: Record<number, ProductPreview> = {};
        products.forEach(p => {
            productById[p.id] = {
                id: p.id,
                name: p.name,
                price: p.price,
                category: p.category,
            };
        });

        orders.forEach((order: Order) => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card-modern';

            const header = document.createElement('div');
            header.className = 'order-card-header';
            header.addEventListener('click', () => {
                void showOrderDetails(order.id);
            });

            const titleDiv = document.createElement('div');
            const title = document.createElement('h3');
            title.className = 'order-card-title';
            title.textContent = `Commande #${order.id}`;
            
            const dateSpan = document.createElement('span');
            dateSpan.style.fontSize = '.8rem';
            dateSpan.style.color = 'var(--muted)';
            dateSpan.style.fontWeight = 'normal';
            dateSpan.textContent = ` — ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`;
            title.appendChild(dateSpan);
            
            titleDiv.appendChild(title);
            header.appendChild(titleDiv);

            const meta = document.createElement('div');
            meta.className = 'order-card-meta';
            
            const statusBadge = document.createElement('span');
            statusBadge.className = `card-badge badge-${order.status}`;
            statusBadge.textContent = order.status;
            meta.appendChild(statusBadge);

            const priceTag = document.createElement('span');
            priceTag.className = 'card-price';
            priceTag.textContent = `${order.total.toFixed(2)} €`;
            meta.appendChild(priceTag);

            header.appendChild(meta);
            orderCard.appendChild(header);

            const itemsList = document.createElement('ul');
            itemsList.className = 'order-items';
            
            order.productIds.forEach(pid => {
                const prod = productById[pid];
                const li = document.createElement('li');
                li.className = 'order-item';
                
                if (prod) {
                    const itemName = document.createElement('span');
                    itemName.textContent = prod.name;
                    li.appendChild(itemName);

                    const itemInfo = document.createElement('span');
                    itemInfo.style.display = 'flex';
                    itemInfo.style.gap = '.5rem';
                    itemInfo.style.alignItems = 'center';

                    const categoryBadge = document.createElement('span');
                    categoryBadge.className = `card-badge badge-${prod.category}`;
                    categoryBadge.textContent = prod.category;
                    categoryBadge.style.fontSize = '.65rem';
                    itemInfo.appendChild(categoryBadge);

                    const price = document.createElement('span');
                    price.style.color = 'var(--accent)';
                    price.style.fontWeight = '600';
                    price.textContent = `${prod.price.toFixed(2)} €`;
                    itemInfo.appendChild(price);

                    li.appendChild(itemInfo);

                    li.addEventListener('click', (e) => {
                        e.stopPropagation();
                        void showProductDetails(prod.id);
                    });
                } else {
                    li.textContent = `Produit #${pid} (inconnu)`;
                    li.style.cursor = 'default';
                }
                
                itemsList.appendChild(li);
            });

            orderCard.appendChild(itemsList);
            container.appendChild(orderCard);
        });
    } catch (error) {
        container.textContent = String(error);
    }
}

async function showCustomers() {
    const container = clearView();
    if (!container) return;

    try {
        const customers = await customersService.getAll();
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';

        customers.forEach((c: Customer) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.addEventListener('click', () => {
                void showCustomerDetails(c.id);
            });

            const header = document.createElement('div');
            header.className = 'card-header';
            
            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = `${c.firstName} ${c.lastName}`;
            
            const roleBadge = document.createElement('span');
            roleBadge.className = `card-badge badge-${c.role}`;
            roleBadge.textContent = c.role;
            
            header.appendChild(title);
            header.appendChild(roleBadge);
            card.appendChild(header);

            const body = document.createElement('div');
            body.className = 'card-body';
            
            const emailField = document.createElement('div');
            emailField.className = 'card-field';
            emailField.innerHTML = `
                <span class="card-label">📧 Email</span>
                <span class="card-value">${c.email}</span>
            `;
            body.appendChild(emailField);

            const idField = document.createElement('div');
            idField.className = 'card-field';
            idField.innerHTML = `
                <span class="card-label">ID</span>
                <span class="card-value">#${c.id}</span>
            `;
            body.appendChild(idField);

            card.appendChild(body);
            cardGrid.appendChild(card);
        });

        container.appendChild(cardGrid);
    } catch (error) {
        container.textContent = String(error);
    }
}

/* ---------- INITIALISATION ---------- */

export function setupShopUI(): void {
    const toolbar = document.getElementById('shop-toolbar');
    if (!toolbar) return;

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