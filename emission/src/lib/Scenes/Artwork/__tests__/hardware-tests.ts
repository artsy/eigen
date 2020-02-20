jest.mock("react-native", () => ({
  Platform: jest.fn(),
}))

import { Platform } from "react-native"
import { isPad, truncatedTextLimit } from "../hardware"

describe(isPad, () => {
  it("returns true if device is an iPad", () => {
    ;(Platform as any).isPad = true
    expect(isPad()).toBe(true)
  })

  it("returns false if device is not an iPad", () => {
    ;(Platform as any).isPad = false
    expect(isPad()).toBe(false)
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
