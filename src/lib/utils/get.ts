/**
 * Type-safe access of deep property of an object
 *
 * Thanks! https://github.com/claudepache/es-optional-chaining/issues/2#issuecomment-318680932
 *
 * @param obj                     Object to get deep property
 * @param unsafeDataOperation     Function that returns the deep property
 * @param valueIfFailOrUndefined  Value to return in case if there is no such property
 */
export function get<O, T>(obj: O, unsafeDataOperation: (x: O) => T, valueIfFailOrUndefined?: T): T | undefined {
  try {
    const result = unsafeDataOperation(obj)
    if (result) {
      return result
    } else {
      throw new Error()
    }
    return
  } catch (error) {
    return valueIfFailOrUndefined
  }
}
