/**
 * Test utility to wait for all promises to be resolved.
 *
 * Use this for tests *not* using jest's fake timers.
 * If you do use fake timers, use `flushPromiseQueueFakeTimers` instead.
 */
export const flushPromiseQueue = () => {
  return new Promise((r) => setTimeout(() => requestAnimationFrame(r), 0))
}

/**
 * Test utility to wait for all promises to be resolved.
 *
 * Use this for tests using jest's fake timers.
 * If you *do not* use fake timers, use `flushPromiseQueue` instead.
 */
export const flushPromiseQueueFakeTimers = async () => {
  return new Promise((res, _) => res(null))
}
