export function updateStatus(msg, type) {
    const el = document.getElementById('status-display');
    const dot = document.getElementById('status-dot');
    if (!el || !dot) return;

    el.textContent = msg;
    if (type === 'success') {
        el.className = "text-xs font-semibold text-green-600 uppercase tracking-wide";
        dot.className = "w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse";
    } else if (type === 'error') {
        el.className = "text-xs font-semibold text-red-600 uppercase tracking-wide";
        dot.className = "w-2.5 h-2.5 rounded-full bg-red-500";
    } else {
        el.className = "text-xs font-semibold text-yellow-600 uppercase tracking-wide";
        dot.className = "w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping";
    }
}