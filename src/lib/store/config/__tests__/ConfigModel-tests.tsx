import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { Platform } from "react-native"

const getConfigState = () => {
  return __globalStoreTestUtils__?.getCurrentState().config!
}

describe("ConfigModel", () => {
  describe("userIsDev", () => {
    // we need to play with `__DEV__` here, so we set it before each and we restore after all.
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = false
    })
    afterAll(() => {
      // @ts-ignore
      global.__DEV__ = true
    })

    it("is false by default", () => {
      expect(getConfigState().userIsDev).toEqual(false)
    })

    it("is true when developing", () => {
      // @ts-ignore
      global.__DEV__ = true
      expect(getConfigState().userIsDev).toEqual(true)
    })

    it("is true for artsy emails for android", () => {
      Platform.OS = "android"
      __globalStoreTestUtils__?.injectState({
        auth: { androidUserEmail: "pavlos@artsymail.com" },
      })
      expect(getConfigState().userIsDev).toEqual(true)
    })

    it("is true for artsy emails for ios", () => {
      Platform.OS = "ios"
      __globalStoreTestUtils__?.injectState({
        native: { sessionState: { userEmail: "pavlos@artsymail.com" } },
      })
      expect(getConfigState().userIsDev).toEqual(true)
    })

    it("is can be flipped", () => {
      expect(getConfigState().userIsDev).toEqual(false)

      __globalStoreTestUtils__?.injectState({
        config: { userIsDevFlipValue: true },
      })
      expect(getConfigState().userIsDev).toEqual(true)

      __globalStoreTestUtils__?.injectState({
        config: { userIsDevFlipValue: false },
      })
      expect(getConfigState().userIsDev).toEqual(false)
    })

    it("is can be flipped 2", () => {
      // @ts-ignore
      global.__DEV__ = true
      expect(getConfigState().userIsDev).toEqual(true)

      __globalStoreTestUtils__?.injectState({
        config: { userIsDevFlipValue: true },
      })
      expect(getConfigState().userIsDev).toEqual(false)

      __globalStoreTestUtils__?.injectState({
        config: { userIsDevFlipValue: false },
      })
      expect(getConfigState().userIsDev).toEqual(true)
    })
  })
})
