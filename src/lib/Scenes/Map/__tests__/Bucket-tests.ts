import { CityFixture } from "lib/__fixtures__/CityFixture"
import { uniq } from "lodash"
import { bucketCityResults } from "../Bucket"

describe(bucketCityResults, () => {
  const results = bucketCityResults({ city: CityFixture } as any)

  it("doens't yet support saved results", () => {
    expect(results.saved.city.shows.edges).toEqual([])
    expect(results.saved.city.fairs).toEqual([])
  })

  it("calculates fairs correctly", () => {
    expect(results.fairs.city.shows.edges).toEqual([])
    expect(results.fairs.city.fairs.length).toEqual(CityFixture.fairs.length)
  })

  it("calculates galleries correctly", () => {
    expect(uniq(results.galleries.city.shows.edges.map(s => s.node.partner.type))).toEqual(["Gallery"])
    expect(results.galleries.city.fairs).toEqual([])
  })

  it("calculates museums correctly", () => {
    expect(uniq(results.museums.city.shows.edges.map(s => s.node.partner.type))).toEqual(["Institution"])
    expect(results.museums.city.fairs).toEqual([])
  })
})
