/**
 * Adds some runtime async storage utilities to the Flipper debugger.
 *
 * @see https://github.com/lbaldy/flipper-plugin-async-storage-advanced
 */

export const AsyncStorageDevtools: React.FC = () => {
  if (__DEV__) {
    const FlipperAsyncStorage = require("rn-flipper-async-storage-advanced").default
    return <FlipperAsyncStorage />
  }

  return null
}
