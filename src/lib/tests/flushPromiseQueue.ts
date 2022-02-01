/**
 * test utility to wait for all promises to be resolved
 */
export const flushPromiseQueue = () =>
  new Promise((r) => setTimeout(() => requestAnimationFrame(r), 0))
