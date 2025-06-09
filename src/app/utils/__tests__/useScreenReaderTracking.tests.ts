import { renderHook } from "@testing-library/react-hooks"
import { waitFor } from "@testing-library/react-native"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"
import { useScreenReaderTracking } from "app/utils/useScreenReaderTracking"

jest.mock("react-native", () => ({
  AccessibilityInfo: { isScreenReaderEnabled: jest.fn().mockResolvedValue(true) },
}))

describe("useScreenReaderTracking", () => {
  it("Should track the status of the screen reader of a user", async () => {
    renderHook(() => useScreenReaderTracking())

    await waitFor(() => {
      expect(SegmentTrackingProvider.identify).toHaveBeenCalledTimes(1)
    })

    expect(SegmentTrackingProvider.identify).toHaveBeenCalledWith(undefined, {
      "screen reader status": "enabled",
    })
  })
})
