jest.mock("react-native", () => ({
  Platform: {
    isPad: true,
    OS: "ios",
  },
}))

jest.mock("react-native-safe-area-context", () => ({
  // workaround import issue in tests
  useSafeAreaInsets: jest.fn(),
}))

beforeEach(() => {
  Platform.OS = "ios"
  ;(Platform as any).isPad = false
})

import { osMajorVersion } from "app/utils/platformUtil"
import { Platform } from "react-native"

describe(osMajorVersion, () => {
  it("returns the correct version when version is a string", () => {
    ;(Platform as any).Version = "14.4.1"
    const version = osMajorVersion()
    expect(version).toEqual(14)
  })

  it("returns the correct version when version is a number", () => {
    ;(Platform as any).Version = 43
    const version = osMajorVersion()
    expect(version).toEqual(43)
  })
})
