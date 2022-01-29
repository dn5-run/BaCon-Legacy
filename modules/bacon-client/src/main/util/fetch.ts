export const fetch: typeof window.fetch = async (...args) => {
    return typeof window === 'undefined' ? await fetch(...args) : await window.fetch(...args)
}
