import { bucketCityResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
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
