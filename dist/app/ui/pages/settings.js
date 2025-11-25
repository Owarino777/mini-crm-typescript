"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSettings = setupSettings;
function setupSettings() {
    const toggle = document.getElementById('toggle-theme');
    if (!toggle)
        return;
    // Stocke le thème en localStorage pour sobriété (RGESN)
    const KEY = 'mini-crm-theme';
    const apply = (dark) => {
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    };
    const stored = localStorage.getItem(KEY);
    const initialDark = stored ? stored === 'dark' : true;
    toggle.checked = initialDark;
    apply(initialDark);
    toggle.addEventListener('change', () => {
        const dark = !!toggle.checked;
        localStorage.setItem(KEY, dark ? 'dark' : 'light');
        apply(dark);
    });
}
