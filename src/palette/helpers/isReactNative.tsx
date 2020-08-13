/**
 * A helper used to detect if we're running in a React Native environment. Useful For
 * universal (shared) platform code.
 */
export function isReactNative(): boolean {
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return true
  } else {
    return false
  }
}
