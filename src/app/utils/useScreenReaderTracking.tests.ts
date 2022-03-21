import { renderHook } from "@testing-library/react-hooks"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"
import { useScreenReaderTracking } from "./useScreenReaderTracking"

import { waitFor } from "@testing-library/react-native"

jest.mock("react-native", () => ({
  AccessibilityInfo: { isScreenReaderEnabled: jest.fn().mockResolvedValue(true) },
}))

describe("useScreenReaderTracking", () => {
  it("Should track the status of the screen reader of a user", async () => {
    renderHook(() => useScreenReaderTracking())

    await waitFor(() => {
      expect(SegmentTrackingProvider.identify).toHaveBeenCalledTimes(1)
      expect(SegmentTrackingProvider.identify).toHaveBeenCalledWith(null, {
        "screen reader status": "enabled",
      })
    })
  })
})
