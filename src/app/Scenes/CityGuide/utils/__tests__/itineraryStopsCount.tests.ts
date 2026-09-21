import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"

describe("itineraryStopsCount", () => {
  it("uses the itinerary's own count", () => {
    expect(itineraryStopsCount({ stopsCount: 16 })).toEqual(16)
    expect(itineraryStopsCount({ stopsCount: 0 })).toEqual(0)
  })

  // Older listing responses carry no `stopsCount`. Claiming zero there would be a lie, so
  // callers hide the line.
  it("is undefined when nothing knows", () => {
    expect(itineraryStopsCount({})).toBeUndefined()
    expect(itineraryStopsCount({ stopsCount: null })).toBeUndefined()
  })
})
