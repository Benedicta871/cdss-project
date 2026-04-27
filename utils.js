// Utility helper functions (shared across system)

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function calculatePercentage(part, total) {
    if (!total) return 0;
    return ((part / total) * 100).toFixed(1);
}