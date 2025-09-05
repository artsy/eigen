import { renderHook, waitFor } from "@testing-library/react-native"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"
import { useScreenReaderAndFontScaleTracking } from "app/utils/useScreenReaderAndFontScaleTracking"

jest.mock("react-native", () => ({
  AccessibilityInfo: { isScreenReaderEnabled: jest.fn().mockResolvedValue(true) },
}))

jest.mock("react-native-device-info", () => ({
  getFontScale: jest.fn().mockResolvedValue(1.2),
}))

describe("useScreenReaderTracking", () => {
  it("Should track the status of the screen reader of a user", async () => {
    renderHook(() => useScreenReaderAndFontScaleTracking())

    await waitFor(() => {
      expect(SegmentTrackingProvider.identify).toHaveBeenCalledTimes(1)
    })

    expect(SegmentTrackingProvider.identify).toHaveBeenCalledWith(undefined, {
      "screen reader status": "enabled",
      fontScale: 1.2,
    })
  })
})
