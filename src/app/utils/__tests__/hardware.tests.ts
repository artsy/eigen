import { truncatedTextLimit } from "app/utils/hardware"
import RNDeviceInfo from "react-native-device-info"

jest.mock("react-native", () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 300, height: 600 })),
  },
}))

describe(truncatedTextLimit, () => {
  it("returns 320 if device is an iPad", () => {
    jest.spyOn(RNDeviceInfo, "isTablet").mockReturnValue(true)

    expect(truncatedTextLimit()).toBe(320)
  })

  it("returns 140 if device is not an iPad", () => {
    jest.spyOn(RNDeviceInfo, "isTablet").mockReturnValue(false)

    expect(truncatedTextLimit()).toBe(140)
  })
})
