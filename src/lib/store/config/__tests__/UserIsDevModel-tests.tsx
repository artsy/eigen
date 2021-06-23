import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { Platform } from "react-native"

const getState = () => {
  return __globalStoreTestUtils__?.getCurrentState().config.userIsDev!
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

  it("is true for artsy emails for android", () => {
    Platform.OS = "android"
    __globalStoreTestUtils__?.injectState({
      auth: { userEmail: "pavlos@artsymail.com" },
    })
    expect(getState().value).toEqual(true)
  })

  it("is true for artsy emails for ios", () => {
    Platform.OS = "ios"
    __globalStoreTestUtils__?.injectState({
      auth: { userEmail: "pavlos@artsymail.com" },
    })
    expect(getState().value).toEqual(true)
  })

  it("is can be flipped", () => {
    expect(getState().value).toEqual(false)

    __globalStoreTestUtils__?.injectState({
      config: { userIsDev: { flipValue: true } },
    })
    expect(getState().value).toEqual(true)

    __globalStoreTestUtils__?.injectState({
      config: { userIsDev: { flipValue: false } },
    })
    expect(getState().value).toEqual(false)
  })

  it("is can be flipped 2", () => {
    // @ts-ignore
    global.__DEV__ = true
    expect(getState().value).toEqual(true)

    __globalStoreTestUtils__?.injectState({
      config: { userIsDev: { flipValue: true } },
    })
    expect(getState().value).toEqual(false)

    __globalStoreTestUtils__?.injectState({
      config: { userIsDev: { flipValue: false } },
    })
    expect(getState().value).toEqual(true)
  })
})
