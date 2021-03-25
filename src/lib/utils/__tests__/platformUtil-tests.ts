import { Platform } from "react-native"
import { osMajorVersion } from "../platformUtil"

describe(osMajorVersion, () => {
  it("returns the correct version when version is a string", () => {
    ;(Platform as any).Version = "12"
    const version = osMajorVersion()
    expect(version).toEqual(12)
  })

  it("returns the correct version when version is a number", () => {
    ;(Platform as any).Version = 15
    const version = osMajorVersion()
    expect(version).toEqual(15)
  })
})
