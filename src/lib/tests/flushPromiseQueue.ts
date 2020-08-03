/**
 * test utility to wait for all promises to be resolved
 */
export function flushPromiseQueue() {
  return new Promise(r => setTimeout(() => requestAnimationFrame(r), 0))
}
