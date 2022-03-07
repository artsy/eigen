/**
 * Basically the opposite of `Type | undefined`.
 *
 * It's useful for then we get a type that has `undefined` inside it, and we want to remove it.
 */
export type NoUndefined<T> = T extends undefined ? never : T

/**
 * Useful for writing wrapper functions that accept the same args as the wrapped function.
 */
export type Wrapped<T extends (...args: any) => any> = (
  a: Parameters<T>[0],
  b: Parameters<T>[1]
) => ReturnType<T>
