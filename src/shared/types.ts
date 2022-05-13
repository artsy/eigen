/**
 * Basically the opposite of `Type | undefined`.
 *
 * It's useful for then we get a type that has `undefined` inside it, and we want to remove it.
 */
export type NoUndefined<T> = T extends undefined ? never : T
