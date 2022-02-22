import { renderHook } from "@testing-library/react-hooks"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"
import { usePreferredThemeTracking } from "./usePreferredThemeTracking"

describe("usePreferredThemeTracking", () => {
  it("Should track the preferred theme of the user", () => {
    renderHook(() => usePreferredThemeTracking())

    expect(SegmentTrackingProvider.identify).toHaveBeenCalledTimes(1)
    expect(SegmentTrackingProvider.identify).toHaveBeenCalledWith(null, {
      "user interface style": "light",
    })
  })
})
