/**
 * Continuously lets JS continue doing its async work and then check if the predicate matches what the user expects, in
 * which case the test may continue.
 */

/**
 * @deprecated avoid using this, use [waitFor](https://testing-library.com/docs/dom-testing-library/api-async/) instead.
 */
export async function waitUntil(predicate: () => boolean) {
  while (!predicate()) {
    await new Promise((r) => {
      setImmediate(r)
      jest.runOnlyPendingTimers()
    })
  }
}
