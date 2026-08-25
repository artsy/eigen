import { extractShowAndFairMaps } from "app/Scenes/CityGuide/utils/extractShowAndFairMaps"

describe(extractShowAndFairMaps, () => {
  it("returns empty maps when there are no shows or fairs", () => {
    const result = extractShowAndFairMaps([], [], [])

    expect(result).toEqual({ shows: {}, fairs: {} })
  })

  it("keys shows and fairs by slug", () => {
    const shows: any = [
      {
        slug: "some-show",
        is_followed: false,
        location: { coordinates: { lat: 1, lng: 2 } },
      },
    ]
    const fairs: any = [
      {
        slug: "some-fair",
        location: { coordinates: { lat: 3, lng: 4 } },
      },
    ]

    const result = extractShowAndFairMaps(shows, [], fairs)

    expect(Object.keys(result.shows)).toEqual(["some-show"])
    expect(Object.keys(result.fairs)).toEqual(["some-fair"])
    expect(result.fairs["some-fair"].type).toBe("Fair")
  })

  it("skips shows and fairs without location coordinates", () => {
    const shows: any = [{ slug: "no-location-show", is_followed: false, location: null }]
    const fairs: any = [{ slug: "no-location-fair", location: { coordinates: null } }]

    const result = extractShowAndFairMaps(shows, [], fairs)

    expect(result.shows).toEqual({})
    expect(result.fairs).toEqual({})
  })

  it("merges followed upcoming shows with running shows", () => {
    const upcomingShows: any = [
      {
        slug: "upcoming-followed",
        is_followed: true,
        location: { coordinates: { lat: 1, lng: 2 } },
      },
      {
        slug: "upcoming-not-followed",
        is_followed: false,
        location: { coordinates: { lat: 1, lng: 2 } },
      },
    ]

    const result = extractShowAndFairMaps([], upcomingShows, [])

    expect(Object.keys(result.shows)).toEqual(["upcoming-followed"])
  })
})
