"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderContacts = renderContacts;
exports.showAlert = showAlert;
exports.clearAlert = clearAlert;
const contactList = () => document.getElementById('contact-list');
const alertBox = () => document.getElementById('alert');
function renderContacts(contacts) {
    const list = contactList();
    if (!list)
        return;
    list.innerHTML = '';
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
function showAlert(message, type = 'success') {
    const box = alertBox();
    if (!box)
        return;
    box.textContent = message;
    box.className = `alert alert-${type}`;
    box.setAttribute('role', 'status');
    box.style.display = 'block';
}
function clearAlert() {
    const box = alertBox();
    if (!box)
        return;
    box.style.display = 'none';
    box.textContent = '';
}
