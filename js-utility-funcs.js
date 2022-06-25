export function qs(selector, parent = document) {
    return parent.querySelector(selector)
}

export function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}
