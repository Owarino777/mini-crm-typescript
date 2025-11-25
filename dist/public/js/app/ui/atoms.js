// Atomes réutilisables (boutons, badges, textes)
export function createButton(options) {
    var _a;
    const btn = document.createElement('button');
    btn.type = 'button';
    if (options.id)
        btn.id = options.id;
    const variant = (_a = options.variant) !== null && _a !== void 0 ? _a : 'primary';
    btn.className = `btn btn-${variant}`;
    btn.textContent = options.label;
    if (options.onClick) {
        btn.addEventListener('click', () => { var _a; return (_a = options.onClick) === null || _a === void 0 ? void 0 : _a.call(options); });
    }
    return btn;
}
export function createBadge(text, classes) {
    const span = document.createElement('span');
    span.className = `badge ${classes}`;
    span.textContent = text;
    return span;
}
