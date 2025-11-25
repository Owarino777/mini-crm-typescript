import ProductsService from '../services/ProductsService.js';
import CustomersService from '../services/CustomersService.js';
import OrdersService from '../services/OrdersService.js';
import type { ProductPreview, Customer, Order, Product } from '../types/shop.js';

const productsService = new ProductsService();
const customersService = new CustomersService();
const ordersService = new OrdersService();

function createButton(id: string, label: string, variant: 'primary' | 'secondary' = 'primary'): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = id;
    btn.className = `btn btn-${variant}`;
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

function paginate<T>(arr: T[], page: number, size: number) {
    const start = (page - 1) * size;
    return arr.slice(start, start + size);
}
function renderPager(total: number, page: number, size: number, onChange: (p: number) => void) {
    const pager = document.createElement('div');
    pager.className = 'pagination';
    const pages = Math.max(1, Math.ceil(total / size));
    const prev = createButton('pager-prev', 'Précédent', 'secondary');
    const next = createButton('pager-next', 'Suivant', 'secondary');
    const info = document.createElement('span');
    info.className = 'contact-counter';
    info.textContent = `Page ${page}/${pages}`;
    prev.disabled = page <= 1;
    next.disabled = page >= pages;
    prev.addEventListener('click', () => onChange(page - 1));
    next.addEventListener('click', () => onChange(page + 1));
    pager.append(prev, info, next);
    return pager;
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
            <dt>Stock</dt><dd>${product.stock > 0 ? product.stock : '<span class="badge badge-order-cancelled">Rupture</span>'}</dd>
            <dt>Image</dt><dd>${product.image}</dd>
        `;
        dl.className = 'detail-list';
        container.appendChild(dl);

        // Optionnel: commandes contenant ce produit
        const orders = await ordersService.getAll();
        const related = orders.filter(o => o.productIds.includes(product.id));
        const section = document.createElement('section');
        const h3 = document.createElement('h3');
        h3.textContent = `Commandes contenant ce produit (${related.length})`;
        section.appendChild(h3);

        if (related.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Aucune commande ne contient ce produit.';
            section.appendChild(p);
        } else {
            related.forEach(o => {
                const div = document.createElement('div');
                div.className = 'order-card';
                div.textContent = `Commande #${o.id} — ${o.total.toFixed(2)} € — ${o.status}`;
                section.appendChild(div);
            });
        }
        container.appendChild(section);
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
            <dt>Rôle</dt><dd><span class="badge ${customer.role === 'admin' ? 'badge-role-admin' : 'badge-role-customer'}">${customer.role}</span></dd>
        `;
        dl.className = 'detail-list';
        container.appendChild(dl);

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
                const badgeCls =
                    order.status === 'paid' ? 'badge-order-paid' :
                        order.status === 'pending' ? 'badge-order-pending' :
                            'badge-order-cancelled';
                orderTitle.innerHTML = `Commande #${order.id} — ${order.total.toFixed(2)} € — <span class="badge ${badgeCls}">${order.status}</span>`;
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
        header.appendChild(createBackButton('← Retour aux commandes', () => {
            void showOrders();
        }));
        container.appendChild(header);

        const dl = document.createElement('dl');
        const badgeCls =
            order.status === 'paid' ? 'badge-order-paid' :
                order.status === 'pending' ? 'badge-order-pending' :
                    'badge-order-cancelled';

        dl.innerHTML = `
            <dt>Total</dt><dd>${order.total.toFixed(2)} €</dd>
            <dt>Statut</dt><dd><span class="badge ${badgeCls}">${order.status}</span></dd>
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

/* ---------- VUES LISTES + FILTRES ---------- */

async function showProducts() {
    const container = clearView();
    if (!container) return;

    try {
        const products = await productsService.getAll();

        // Filtres
        let page = 1;
        let pageSize = 10;
        let category = 'all';
        let onlyInStock = false;
        let sort: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' = 'name-asc';

        const tools = document.createElement('div');
        tools.className = 'contacts-tools';
        tools.innerHTML = `
          <select id="p-sort" aria-label="Trier">
            <option value="name-asc">Nom (A→Z)</option>
            <option value="name-desc">Nom (Z→A)</option>
            <option value="price-asc">Prix (croissant)</option>
            <option value="price-desc">Prix (décroissant)</option>
          </select>
          <select id="p-category" aria-label="Catégorie"></select>
          <label><input id="p-stock" type="checkbox"> En stock uniquement</label>
          <select id="p-size" aria-label="Taille de page">
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        `;
        container.appendChild(tools);

        const catSelect = tools.querySelector('#p-category') as HTMLSelectElement;
        const uniqueCats = Array.from(new Set(products.map(p => p.category))).sort();
        catSelect.innerHTML = `<option value="all">Toutes catégories</option>` + uniqueCats.map(c => `<option value="${c}">${c}</option>`).join('');

        const list = document.createElement('ul');
        container.appendChild(list);

        const render = () => {
            let data = [...products];
            if (category !== 'all') data = data.filter(p => p.category === category);
            if (onlyInStock) data = data.filter(p => p.stock > 0);

            switch (sort) {
                case 'name-asc': data.sort((a, b) => a.name.localeCompare(b.name)); break;
                case 'name-desc': data.sort((a, b) => b.name.localeCompare(a.name)); break;
                case 'price-asc': data.sort((a, b) => a.price - b.price); break;
                case 'price-desc': data.sort((a, b) => b.price - a.price); break;
            }

            const total = data.length;
            const paged = paginate(data, page, pageSize);

            list.innerHTML = '';
            paged.forEach((p: Product) => {
                const preview: ProductPreview = { id: p.id, name: p.name, price: p.price, category: p.category };
                const li = document.createElement('li');
                const stockBadge = p.stock > 0 ? '' : ' <span class="badge badge-order-cancelled">Rupture</span>';
                li.innerHTML = `${preview.name} — ${preview.price.toFixed(2)} € — ${preview.category}${stockBadge}`;
                li.className = 'clickable';
                li.addEventListener('click', () => { void showProductDetails(preview.id); });
                list.appendChild(li);
            });

            // Pager
            const oldPager = container.querySelector('.pagination');
            if (oldPager) oldPager.remove();
            container.appendChild(renderPager(total, page, pageSize, (p) => { page = p; render(); }));
        };

        // Listeners
        (tools.querySelector('#p-sort') as HTMLSelectElement).addEventListener('change', e => {
            sort = (e.target as HTMLSelectElement).value as any; page = 1; render();
        });
        catSelect.addEventListener('change', e => {
            category = (e.target as HTMLSelectElement).value; page = 1; render();
        });
        (tools.querySelector('#p-stock') as HTMLInputElement).addEventListener('change', e => {
            onlyInStock = !!(e.target as HTMLInputElement).checked; page = 1; render();
        });
        (tools.querySelector('#p-size') as HTMLSelectElement).addEventListener('change', e => {
            pageSize = Number((e.target as HTMLSelectElement).value || 10); page = 1; render();
        });

        render();
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
            const section = document.createElement('section');
            section.className = 'order-section';

            const title = document.createElement('h3');
            const badgeCls =
                order.status === 'paid' ? 'badge-order-paid' :
                    order.status === 'pending' ? 'badge-order-pending' :
                        'badge-order-cancelled';
            title.innerHTML = `Commande #${order.id} — ${order.total.toFixed(2)} € — <span class="badge ${badgeCls}">${order.status}</span>`;
            title.className = 'clickable';
            title.addEventListener('click', () => { void showOrderDetails(order.id); });
            section.appendChild(title);

            const list = document.createElement('ul');
            order.productIds.forEach(pid => {
                const prod = productById[pid];
                const li = document.createElement('li');
                if (prod) {
                    li.textContent = `${prod.name} — ${prod.price.toFixed(2)} € (${prod.category})`;
                    li.className = 'clickable';
                    li.addEventListener('click', () => { void showProductDetails(prod.id); });
                } else {
                    li.textContent = `Produit #${pid} (inconnu)`;
                }
                list.appendChild(li);
            });

            section.appendChild(list);
            container.appendChild(section);
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

        // Filtres
        let page = 1;
        let pageSize = 10;
        let role: 'all' | 'customer' | 'admin' = 'all';
        let term = '';

        const tools = document.createElement('div');
        tools.className = 'contacts-tools';
        tools.innerHTML = `
          <input id="c-search" type="search" placeholder="Rechercher client…" aria-label="Rechercher client"/>
          <select id="c-role" aria-label="Rôle">
            <option value="all">Tous les rôles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <select id="c-size" aria-label="Taille de page">
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        `;
        container.appendChild(tools);

        const list = document.createElement('ul');
        container.appendChild(list);

        const render = () => {
            let data = customers.filter(c =>
                `${c.firstName} ${c.lastName}`.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term)
            );
            if (role !== 'all') data = data.filter(c => c.role === role);

            const total = data.length;
            const paged = paginate(data, page, pageSize);

            list.innerHTML = '';
            paged.forEach((c: Customer) => {
                const li = document.createElement('li');
                const fullName = `${c.firstName} ${c.lastName}`;
                const badgeCls = c.role === 'admin' ? 'badge-role-admin' : 'badge-role-customer';
                li.innerHTML = `${fullName} — ${c.email} — <span class="badge ${badgeCls}">${c.role}</span>`;
                li.className = 'clickable';
                li.addEventListener('click', () => { void showCustomerDetails(c.id); });
                list.appendChild(li);
            });

            const oldPager = container.querySelector('.pagination');
            if (oldPager) oldPager.remove();
            container.appendChild(renderPager(total, page, pageSize, (p) => { page = p; render(); }));
        };

        (tools.querySelector('#c-search') as HTMLInputElement).addEventListener('input', e => {
            term = (e.target as HTMLInputElement).value.toLowerCase(); page = 1; render();
        });
        (tools.querySelector('#c-role') as HTMLSelectElement).addEventListener('change', e => {
            role = (e.target as HTMLSelectElement).value as any; page = 1; render();
        });
        (tools.querySelector('#c-size') as HTMLSelectElement).addEventListener('change', e => {
            pageSize = Number((e.target as HTMLSelectElement).value || 10); page = 1; render();
        });

        render();
    } catch (error) {
        container.textContent = String(error);
    }
}

async function showOrders() {
    const container = clearView();
    if (!container) return;

    try {
        const [orders, customers] = await Promise.all([
            ordersService.getAll(),
            customersService.getAll(),
        ]);

        let page = 1;
        let pageSize = 10;
        let status: 'all' | 'pending' | 'paid' | 'cancelled' = 'all';

        const tools = document.createElement('div');
        tools.className = 'contacts-tools';
        tools.innerHTML = `
          <select id="o-status" aria-label="Statut">
            <option value="all">Tous les statuts</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select id="o-size" aria-label="Taille de page">
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        `;
        container.appendChild(tools);

        const list = document.createElement('ul');
        container.appendChild(list);

        const render = () => {
            let data = [...orders];
            if (status !== 'all') data = data.filter(o => o.status === status);

            const total = data.length;
            const paged = paginate(data, page, pageSize);

            list.innerHTML = '';
            paged.forEach(o => {
                const cust = customers.find(c => c.id === o.userId);
                const badgeCls =
                    o.status === 'paid' ? 'badge-order-paid' :
                        o.status === 'pending' ? 'badge-order-pending' :
                            'badge-order-cancelled';
                const li = document.createElement('li');
                li.className = 'clickable';
                li.innerHTML = `#${o.id} — ${o.total.toFixed(2)} € — <span class="badge ${badgeCls}">${o.status}</span> — ${new Date(o.createdAt).toLocaleDateString()} — ${cust ? cust.firstName + ' ' + cust.lastName : 'Client inconnu'}`;
                li.addEventListener('click', () => { void showOrderDetails(o.id); });
                list.appendChild(li);
            });

            const oldPager = container.querySelector('.pagination');
            if (oldPager) oldPager.remove();
            container.appendChild(renderPager(total, page, pageSize, (p) => { page = p; render(); }));
        };

        (tools.querySelector('#o-status') as HTMLSelectElement).addEventListener('change', e => {
            status = (e.target as HTMLSelectElement).value as any; page = 1; render();
        });
        (tools.querySelector('#o-size') as HTMLSelectElement).addEventListener('change', e => {
            pageSize = Number((e.target as HTMLSelectElement).value || 10); page = 1; render();
        });

        render();
    } catch (error) {
        container.textContent = String(error);
    }
}

/* ---------- INITIALISATION ---------- */

export function setupShopUI(): void {
    const toolbar = document.getElementById('shop-toolbar');
    if (!toolbar) return;

    toolbar.innerHTML = '';
    const btnProducts = createButton('btn-products', 'Liste des produits');
    const btnProductsOrders = createButton('btn-products-orders', 'Produits avec achats');
    const btnCustomers = createButton('btn-customers', 'Liste des clients');
    const btnOrders = createButton('btn-orders', 'Liste des commandes');

    toolbar.appendChild(btnProducts);
    toolbar.appendChild(btnProductsOrders);
    toolbar.appendChild(btnCustomers);
    toolbar.appendChild(btnOrders);

    btnProducts.addEventListener('click', () => { void showProducts(); });
    btnProductsOrders.addEventListener('click', () => { void showProductsWithOrders(); });
    btnCustomers.addEventListener('click', () => { void showCustomers(); });
    btnOrders.addEventListener('click', () => { void showOrders(); });
}