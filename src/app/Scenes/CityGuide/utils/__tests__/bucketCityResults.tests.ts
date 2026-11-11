import { bucketCityResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { CityFixture } from "app/__fixtures__/CityFixture"
import { uniq } from "lodash"

// The stubbed data needs re-creating
//
describe.skip(bucketCityResults, () => {
  const results = bucketCityResults(
    CityFixture.shows.edges.map((e: any) => e.node),
    CityFixture.upcomingShows.edges.map((e: any) => e.node),
    CityFixture.fairs.edges.map((e: any) => e.node)
  )

  it("doesn't yet support saved results", () => {
    expect(results.saved).toEqual([])
  })

  it("calculates galleries correctly", () => {
    expect(uniq(results.galleries.map((s) => s!.partner!.type))).toEqual(["Gallery"])
  })

  it("calculates museums correctly", () => {
    expect(uniq(results.museums.map((s) => s!.partner!.type))).toEqual(["Institution"])
  })
})

describe("bucketCityResults saved", () => {
  const followedShow = { slug: "followed", is_followed: true, isOnMyItineraries: false } as Show
  const itineraryShow = { slug: "itinerary", is_followed: false, isOnMyItineraries: true } as Show
  const upcomingItineraryShow = {
    slug: "upcoming-itinerary",
    is_followed: false,
    isOnMyItineraries: true,
  } as Show
  const itineraryFair = { slug: "fair-itinerary", isOnMyItineraries: true } as Fair
  const otherFair = { slug: "fair-other", isOnMyItineraries: false } as Fair

  const shows = [followedShow, itineraryShow]
  const upcomingShows = [upcomingItineraryShow]
  const fairs = [itineraryFair, otherFair]

  describe("with itineraries off", () => {
    const results = bucketCityResults(shows, upcomingShows, fairs)

    it("counts followed shows as saved", () => {
      expect(results.saved.map((show) => show.slug)).toEqual(["followed"])
    })

    it("has no saved fairs", () => {
      expect(results.savedFairs).toEqual([])
    })
  })

  describe("with itineraries on", () => {
    const results = bucketCityResults(shows, upcomingShows, fairs, {
      savedMeansOnItineraries: true,
    })

    it("counts running and upcoming shows on an itinerary as saved", () => {
      expect(results.saved.map((show) => show.slug).sort()).toEqual([
        "itinerary",
        "upcoming-itinerary",
      ])
    })

    it("counts fairs on an itinerary as saved", () => {
      expect(results.savedFairs.map((fair) => fair.slug)).toEqual(["fair-itinerary"])
    })
  })
})
