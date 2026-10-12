import { itineraryStopHref } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopHref"

const options = { citySlug: "london", itineraryId: "itinerary-1", isCustom: false }

describe("itineraryStopHref", () => {
  it("sends a custom stop to its own screen", () => {
    expect(
      itineraryStopHref(
        { internalID: "stop-1", note: "Hi" },
        { href: "https://example.com" },
        { ...options, isCustom: true }
      )
    ).toEqual("/city-guide/london/itinerary/itinerary-1/stop/stop-1")
  })

  it("leaves the entity's href alone when the stop has no note", () => {
    expect(
      itineraryStopHref({ internalID: "stop-1", note: null }, { href: "/show/a-show" }, options)
    ).toEqual("/show/a-show")
  })

  it("tells the entity's page which stop it came from when the stop has a note", () => {
    expect(
      itineraryStopHref({ internalID: "stop-1", note: "Hi" }, { href: "/show/a-show" }, options)
    ).toEqual("/show/a-show?stopID=stop-1")
  })

  it("appends to an href that already has a query, with the share token", () => {
    expect(
      itineraryStopHref(
        { internalID: "stop-1", note: "Hi" },
        { href: "/partner/gagosian?locationID=loc-1" },
        { ...options, shareToken: "token" }
      )
    ).toEqual("/partner/gagosian?locationID=loc-1&stopID=stop-1&shareToken=token")
  })

  it("has nowhere to go when the entity has no href", () => {
    expect(
      itineraryStopHref({ internalID: "stop-1", note: "Hi" }, { href: undefined }, options)
    ).toBeUndefined()
  })
})
