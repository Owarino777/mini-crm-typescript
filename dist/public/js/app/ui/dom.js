const contactList = () => document.getElementById('contact-list');
const alertBox = () => document.getElementById('alert');
// Nouveau : container du header de la liste (h2 + compteur)
function contactListHeader() {
    return document.querySelector('[aria-labelledby="contacts-list-title"] .panel-header');
}
let loadingTimeout = null;
export function renderContacts(contacts) {
    const list = contactList();
    if (!list)
        return;
    list.innerHTML = '';
    // Compteur
    const header = contactListHeader();
    if (header) {
        let counter = header.querySelector('.contact-counter');
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'contact-counter';
            header.appendChild(counter);
        }
        counter.textContent = contacts.length === 0
            ? '0 contact'
            : `${contacts.length} contact${contacts.length > 1 ? 's' : ''}`;
    }
    if (contacts.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = 'Aucun contact pour le moment. Ajoutez un premier contact avec le formulaire ci-dessus.';
        list.appendChild(empty);
        return;
    }
    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.className = 'contact-item';
        li.dataset.id = String(contact.id);
        li.innerHTML = `
            <div class="contact-main">
              <strong>${contact.nom}</strong>
              <span>${contact.email}</span>
              <span>${contact.telephone}</span>
              ${contact.societe ? `<span>${contact.societe}</span>` : ''}
            </div>
            <div class="contact-meta">
              <span class="badge badge-${contact.statut}">
                ${contact.statut.toUpperCase()}
              </span>
              <button class="btn btn-danger btn-sm" aria-label="Supprimer le contact">
                Supprimer
              </button>
            </div>
        `;
        list.appendChild(li);
    });
}
export function showAlert(message, type = 'success') {
    const box = alertBox();
    if (!box)
        return;
    box.textContent = message;
    box.className = `alert alert-${type}`;
    box.setAttribute('role', 'status');
    box.style.display = 'block';
}
export function clearAlert() {
    const box = alertBox();
    if (!box)
        return;
    box.style.display = 'none';
    box.textContent = '';
}
// --- SKELETON CHARGEMENT LISTE ---
export function showContactsSkeleton() {
    const list = contactList();
    if (!list)
        return;
    list.innerHTML = '';
    const skeletonCount = 3;
    for (let i = 0; i < skeletonCount; i++) {
        const li = document.createElement('li');
        li.className = 'contact-item';
        li.innerHTML = `
          <div class="contact-main">
            <div class="skeleton skeleton-line" style="width: 40%;"></div>
            <div class="skeleton skeleton-line" style="width: 55%;"></div>
            <div class="skeleton skeleton-line" style="width: 30%;"></div>
          </div>
          <div class="contact-meta">
            <span class="badge skeleton" style="width: 60px; height: 18px;"></span>
            <div class="skeleton skeleton-line" style="width: 70px;"></div>
          </div>
        `;
        list.appendChild(li);
    }
}
export function delayHideSkeleton() {
    if (loadingTimeout !== null) {
        window.clearTimeout(loadingTimeout);
    }
    loadingTimeout = window.setTimeout(() => {
        // on ne fait rien ici, c’est juste pour avoir une durée mini d’affichage
    }, 250);
}
