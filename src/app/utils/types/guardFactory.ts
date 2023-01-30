/**
 * Useful for filtering arrays of union types, eg [{ __typename: "Foo" }, { __typename: "Bar" }]}]
 *
 * @example
 *
 * const artworkImages = artwork.figures.filter(guardFactory("__typename", "Image"))
 */
export const guardFactory = <T, K extends keyof T, V extends string & T[K]>(
  k: K,
  v: V
): ((o: T) => o is Extract<T, Record<K, V>>) => {
  return (o: T): o is Extract<T, Record<K, V>> => {
    return o[k] === v
  }
}
