export function setupSettings(): void {
    const toggle = document.getElementById('toggle-theme') as HTMLInputElement | null;
    if (!toggle) return;

    // Stocke le thème en localStorage pour sobriété (RGESN)
    const KEY = 'mini-crm-theme';
    const apply = (dark: boolean) => {
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