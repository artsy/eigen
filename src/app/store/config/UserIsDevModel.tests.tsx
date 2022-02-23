import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { Platform } from "react-native"

const getState = () => {
  return __globalStoreTestUtils__?.getCurrentState().artsyPrefs.userIsDev!
}

describe("UserIsDevModel", () => {
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
    expect(getState().value).toEqual(false)
  })

  it("is true when developing", () => {
    // @ts-ignore
    global.__DEV__ = true
    expect(getState().value).toEqual(true)
  })

  it("is true for artsy emails for new onboarding", () => {
    Platform.OS = "android"
    __globalStoreTestUtils__?.injectState({
      auth: { userEmail: "pavlos@artsymail.com" },
    })
    expect(getState().value).toEqual(true)
  })

  it("is true for artsy emails for ios with old onboarding", () => {
    Platform.OS = "ios"
    __globalStoreTestUtils__?.injectState({
      native: { sessionState: { userEmail: "pavlos@artsymail.com" } },
    })
    // In the app, the above would cause a notif with name `"STATE_CHANGED"` that would cause the following
    __globalStoreTestUtils__?.injectState({
      auth: { userEmail: "pavlos@artsymail.com" },
    })
    expect(getState().value).toEqual(true)
  })

  it("is can be flipped", () => {
    expect(getState().value).toEqual(false)

    __globalStoreTestUtils__?.injectState({
      artsyPrefs: { userIsDev: { flipValue: true } },
    })
    expect(getState().value).toEqual(true)

    __globalStoreTestUtils__?.injectState({
      artsyPrefs: { userIsDev: { flipValue: false } },
    })
    expect(getState().value).toEqual(false)
  })

  it("is can be flipped 2", () => {
    // @ts-ignore
    global.__DEV__ = true
    expect(getState().value).toEqual(true)

    __globalStoreTestUtils__?.injectState({
      artsyPrefs: { userIsDev: { flipValue: true } },
    })
    expect(getState().value).toEqual(false)

    __globalStoreTestUtils__?.injectState({
      artsyPrefs: { userIsDev: { flipValue: false } },
    })
    expect(getState().value).toEqual(true)
  })
})
