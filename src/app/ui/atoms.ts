// Atomes réutilisables (boutons, badges, textes)

export function createButton(options: {
    id?: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
}): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    if (options.id) btn.id = options.id;

    const variant = options.variant ?? 'primary';
    btn.className = `btn btn-${variant}`;
    btn.textContent = options.label;

    if (options.onClick) {
        btn.addEventListener('click', () => options.onClick?.());
    }
    return btn;
}

export function createBadge(text: string, classes: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.className = `badge ${classes}`;
    span.textContent = text;
    return span;
}