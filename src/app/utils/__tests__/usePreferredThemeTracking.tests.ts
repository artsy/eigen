import { renderHook } from "@testing-library/react-hooks"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"
import { usePreferredThemeTracking } from "app/utils/usePreferredThemeTracking"

describe("usePreferredThemeTracking", () => {
  it("Should track the preferred theme of the user", () => {
    renderHook(() => usePreferredThemeTracking())

    expect(SegmentTrackingProvider.identify).toHaveBeenCalledTimes(1)
    expect(SegmentTrackingProvider.identify).toHaveBeenCalledWith(undefined, {
      "user interface style": "light",
    })
  })
})
