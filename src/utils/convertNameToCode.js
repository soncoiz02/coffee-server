import { toNonAccentVietnamese } from "./convertVietnameseText"

export const convertNameToCode = (name) => {
    const nonAccentText = toNonAccentVietnamese(name)
    return nonAccentText.toLowerCase().replace(/[{()}"']/g, '').split(" ").reduce((s, c) => s + (c.charAt(0).toUpperCase() + c.slice(1)));
}