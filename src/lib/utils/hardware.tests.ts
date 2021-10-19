jest.mock("react-native", () => ({
  Platform: {
    isPad: true,
    OS: "ios",
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 300, height: 600 })),
  },
}))

beforeEach(() => {
  Platform.OS = "ios"
  ;(Platform as any).isPad = false
})

import { Dimensions, Platform } from "react-native"
import { isPad, truncatedTextLimit } from "./hardware"

describe(isPad, () => {
  it("returns true if device is an iPad", () => {
    ;(Platform as any).isPad = true
    expect(isPad()).toBe(true)
  })

  it("returns false if device is not an iPad", () => {
    ;(Platform as any).isPad = false
    expect(isPad()).toBe(false)
  })

  describe("on android", () => {
    let dimensions = {
      width: 300,
      height: 500,
    }
    beforeEach(() => {
      Platform.OS = "android"
      ;(Dimensions.get as jest.Mock).mockImplementationOnce(() => dimensions)
    })
    afterEach(() => {
      Platform.OS = "ios"
    })
    it('returns true if the device is bigger than 3.5" wide in portrait mode', () => {
      // nexus 7. values taken from simulator
      dimensions = {
        width: 600,
        height: 960,
      }
      expect(isPad()).toBe(true)
    })
    it('returns false if the device is smaller than 3.5" wide in portrait mode', () => {
      // pixel 2xl. values taken from simulator
      dimensions = {
        width: 411,
        height: 822,
      }
      expect(isPad()).toBe(false)
    })
  })
})

describe(truncatedTextLimit, () => {
  it("returns 320 if device is an iPad", () => {
    ;(Platform as any).isPad = true
    expect(truncatedTextLimit()).toBe(320)
  })

  it("returns 140 if device is not an iPad", () => {
    ;(Platform as any).isPad = false
    expect(truncatedTextLimit()).toBe(140)
  })
})
