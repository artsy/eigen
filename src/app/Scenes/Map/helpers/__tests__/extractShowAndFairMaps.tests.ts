import { extractShowAndFairMaps } from "app/Scenes/Map/helpers/extractShowAndFairMaps"

describe(extractShowAndFairMaps, () => {
  it("returns empty maps when there is no city", () => {
    const result = extractShowAndFairMaps(null)

    expect(result).toEqual({ shows: {}, fairs: {} })
  })

  it("keys shows and fairs by slug", () => {
    const city: any = {
      upcomingShows: { edges: [] },
      shows: {
        edges: [
          {
            node: {
              slug: "some-show",
              is_followed: false,
              location: { coordinates: { lat: 1, lng: 2 } },
            },
          },
        ],
      },
      fairs: {
        edges: [
          {
            node: {
              slug: "some-fair",
              location: { coordinates: { lat: 3, lng: 4 } },
            },
          },
        ],
      },
    }

    const result = extractShowAndFairMaps(city)

    expect(Object.keys(result.shows)).toEqual(["some-show"])
    expect(Object.keys(result.fairs)).toEqual(["some-fair"])
    expect(result.fairs["some-fair"].type).toBe("Fair")
  })

  it("skips shows and fairs without location coordinates", () => {
    const city: any = {
      upcomingShows: { edges: [] },
      shows: {
        edges: [{ node: { slug: "no-location-show", is_followed: false, location: null } }],
      },
      fairs: {
        edges: [{ node: { slug: "no-location-fair", location: { coordinates: null } } }],
      },
    }

    const result = extractShowAndFairMaps(city)

    expect(result.shows).toEqual({})
    expect(result.fairs).toEqual({})
  })

  it("merges followed upcoming shows with running shows", () => {
    const city: any = {
      upcomingShows: {
        edges: [
          {
            node: {
              slug: "upcoming-followed",
              is_followed: true,
              location: { coordinates: { lat: 1, lng: 2 } },
            },
          },
          {
            node: {
              slug: "upcoming-not-followed",
              is_followed: false,
              location: { coordinates: { lat: 1, lng: 2 } },
            },
          },
        ],
      },
      shows: { edges: [] },
      fairs: { edges: [] },
    }

    const result = extractShowAndFairMaps(city)

    expect(Object.keys(result.shows)).toEqual(["upcoming-followed"])
  })
})
