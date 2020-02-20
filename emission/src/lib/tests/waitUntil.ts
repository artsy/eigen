/**
 * Continuously lets JS continue doing its async work and then check if the predicate matches what the user expects, in
 * which case the test may continue.
 */
export function waitUntil(predicate: () => boolean) {
  return new Promise(resolve => {
    const wait = () => {
      if (predicate()) {
        resolve()
      } else {
        setImmediate(() => {
          wait()
        })
      }
    }
    /**
     * Start recursive waiting process.
     */
    wait()
  })
}
