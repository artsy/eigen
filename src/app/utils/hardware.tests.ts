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

import { Platform } from "react-native"
import { truncatedTextLimit } from "./hardware"

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
