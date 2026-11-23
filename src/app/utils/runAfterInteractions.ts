/**
 * Defers `callback` until the JS thread is idle.
 *
 * Replaces `InteractionManager.runAfterInteractions`, which React Native 0.87 removed
 * (accessing it now throws in dev and is `undefined` in release builds). RN recommends
 * `requestIdleCallback` as the replacement.
 *
 * Like the old API, the returned handle is thenable (resolves after `callback` ran)
 * and can be cancelled.
 */
export const runAfterInteractions = (callback?: () => void) => {
  let handle: number | undefined

  const promise = new Promise<void>((resolve) => {
    handle = requestIdleCallback(() => {
      callback?.()
      resolve()
    })
  })

  return {
    then: promise.then.bind(promise),
    cancel: () => {
      if (handle !== undefined) cancelIdleCallback(handle)
    },
  }
}
