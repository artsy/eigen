/**
 * The reanimated pieces `react-native-drax` needs that the stock `react-native-reanimated/mock`
 * does not provide. Kept out of `setupJest` so only the tests that render drax pick it up:
 *
 *   jest.mock("react-native-reanimated", () => require("app/utils/tests/draxReanimatedMock").draxReanimatedMock())
 */
export const draxReanimatedMock = () => {
  const mock = require("react-native-reanimated/mock")

  return {
    ...mock,
    // Left out of the stock mock ("ADD ME IF NEEDED"); drax calls it.
    useReducedMotion: () => false,
    // The stock mock's shared value is a Proxy whose `set` trap rejects any property but
    // `value`, so `modify`, which drax uses to update its registry in place, can't be attached
    // to it after the fact. A plain object instead.
    useSharedValue: (init: unknown) => {
      const sharedValue = {
        value: init,
        get: () => sharedValue.value,
        set: (newValue: unknown) => {
          sharedValue.value =
            typeof newValue === "function" ? (newValue as Function)(sharedValue.value) : newValue
        },
        modify: (modifier: (current: unknown) => unknown) => {
          sharedValue.value = modifier(sharedValue.value)
        },
      }

      return sharedValue
    },
  }
}
