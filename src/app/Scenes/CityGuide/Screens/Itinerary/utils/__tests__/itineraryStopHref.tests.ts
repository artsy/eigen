import { itineraryStopHref } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopHref"

describe("itineraryStopHref", () => {
  it("routes a show to its show page", () => {
    expect(
      itineraryStopHref({ type: "SHOW", slug: "white-cube-georg-baselitz-back-again" })
    ).toEqual("/show/white-cube-georg-baselitz-back-again")
  })

  it("routes a gallery or museum to its partner page", () => {
    expect(itineraryStopHref({ type: "PARTNER", slug: "white-cube" })).toEqual(
      "/partner/white-cube"
    )
  })

  it("routes a fair to its fair page", () => {
    expect(itineraryStopHref({ type: "FAIR", slug: "frieze-london-2026" })).toEqual(
      "/fair/frieze-london-2026"
    )
  })

  it("returns null for a stop that is not an Artsy entity", () => {
    expect(itineraryStopHref(null)).toBeNull()
  })
})
