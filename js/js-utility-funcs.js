export function qs(selector, parent = document) {
    return parent.querySelector(selector)
}

export function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

export function removePunctuation(string) {
    return string
        .replace(/[\.,\/#!¡¿\?\$%\^&\*;:\{\}=\\_~\(\)]/gm, "")
        .replace(/\s{2}/g, " ")
        .trim()
}