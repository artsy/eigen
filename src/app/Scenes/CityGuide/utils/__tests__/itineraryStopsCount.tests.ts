import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"

describe("itineraryStopsCount", () => {
  it("sums the count across every section", () => {
    expect(
      itineraryStopsCount({ sections: [{ stopsCount: 4 }, { stopsCount: 2 }, { stopsCount: 10 }] })
    ).toEqual(16)
  })

  it("is zero with no sections", () => {
    expect(itineraryStopsCount({ sections: [] })).toEqual(0)
    expect(itineraryStopsCount({ sections: null })).toEqual(0)
    expect(itineraryStopsCount({})).toEqual(0)
  })
})
