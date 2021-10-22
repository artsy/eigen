/**
 * The endash is used in ranges like `$10k – $20k`.
 * This export makes it easier to use in the code, without having to find
 * the character in unicode.
 * It is a different character to the regular minus, usually a bit longer.
 * (for reference: minus `-`, endash `–`)
 */
export const endash = "–"
export const emdash = "—"
export const bullet = "•"
export const nbsp = String.fromCharCode(160)
export const quoteLeft = "“"
export const quoteRight = "”"

/**
 * A helper func to create a range string out of two strings, by putting an endash between them.
 */
export const range = (left: string, right: string): string => `${left} ${endash} ${right}`
