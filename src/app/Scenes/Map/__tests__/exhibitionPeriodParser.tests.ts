import { exhibitionDates } from "app/Scenes/Map/exhibitionPeriodParser"

describe("exhibitionDates", () => {
  it("returns the date range for an exhibition ending within 2 years", () => {
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    expect(exhibitionDates("Jan 1 – Feb 1, 2026", endDate)).toBe("Jan 1 – Feb 1, 2026")
  })

  it("returns 'Ongoing' for an exhibition with an end date beyond 2 years", () => {
    const endDate = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString() // 3 years from now
    expect(exhibitionDates("Jan 1 – Feb 1, 2030", endDate)).toBe("Ongoing")
  })

  it("returns the date range for a past exhibition", () => {
    const endDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    expect(exhibitionDates("Jan 1 – Feb 1, 2020", endDate)).toBe("Jan 1 – Feb 1, 2020")
  })
})
