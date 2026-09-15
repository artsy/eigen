import { cityGuideEventDateRange } from "app/Scenes/CityGuide/utils/cityGuideEventDateRange"

describe("cityGuideEventDateRange", () => {
  it("condenses a range within the same month", () => {
    expect(cityGuideEventDateRange("2026-10-14T00:00:00Z", "2026-10-18T00:00:00Z")).toEqual(
      "October 14-18, 2026"
    )
  })

  it("names both months for a range spanning two months in the same year", () => {
    expect(cityGuideEventDateRange("2026-10-28T00:00:00Z", "2026-11-02T00:00:00Z")).toEqual(
      "October 28 - November 2, 2026"
    )
  })

  it("names both years for a range spanning two years", () => {
    expect(cityGuideEventDateRange("2026-12-30T00:00:00Z", "2027-01-02T00:00:00Z")).toEqual(
      "December 30, 2026 - January 2, 2027"
    )
  })

  it("shows a single date for a one-day event", () => {
    expect(cityGuideEventDateRange("2026-10-14T00:00:00Z", "2026-10-14T00:00:00Z")).toEqual(
      "October 14, 2026"
    )
  })

  it("returns an empty string for an unparseable date", () => {
    expect(cityGuideEventDateRange("not-a-date", "2026-10-18T00:00:00Z")).toEqual("")
  })
})
