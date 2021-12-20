import { renderHook } from "@testing-library/react-hooks"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"
import { useScreenReaderTracking } from "./useScreenReaderTracking"

describe("useScreenReaderTracking", () => {
  it("Should track the status of the screen reader of a user", () => {
    renderHook(() => useScreenReaderTracking())

    expect(SegmentTrackingProvider.identify).toHaveBeenCalledTimes(1)
    expect(SegmentTrackingProvider.identify).toHaveBeenCalledWith(null, { "screen reader status": "disabled" })
  })
})
