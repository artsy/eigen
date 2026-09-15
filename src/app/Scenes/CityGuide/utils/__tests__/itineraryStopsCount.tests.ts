import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"

describe("itineraryStopsCount", () => {
  it("uses the itinerary's own count when it has one", () => {
    expect(itineraryStopsCount({ stopsCount: 16, sections: [{ stopsCount: 1 }] })).toEqual(16)
  })

  it("sums the sections when the itinerary has no count of its own", () => {
    expect(
      itineraryStopsCount({ sections: [{ stopsCount: 4 }, { stopsCount: 2 }, { stopsCount: 10 }] })
    ).toEqual(16)
  })

  it("is zero for an itinerary whose sections are all empty", () => {
    expect(itineraryStopsCount({ sections: [{ stopsCount: 0 }] })).toEqual(0)
  })

  // A listed itinerary has neither: Gravity's index omits `sections`, and older responses
  // carry no `stopsCount`. Claiming zero there would be a lie, so callers hide the line.
  it("is undefined when nothing knows", () => {
    expect(itineraryStopsCount({})).toBeUndefined()
    expect(itineraryStopsCount({ sections: [] })).toBeUndefined()
    expect(itineraryStopsCount({ stopsCount: null, sections: null })).toBeUndefined()
  })
})
