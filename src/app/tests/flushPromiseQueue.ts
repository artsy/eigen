/**
 * test utility to wait for all promises to be resolved.
 *
 * @deprecated use `waitForSuspenseToBeRemoved` or `waitForElementToBeRemoved` instead.
 */
export const flushPromiseQueue = () =>
  new Promise((r) => setTimeout(() => requestAnimationFrame(r), 0))
