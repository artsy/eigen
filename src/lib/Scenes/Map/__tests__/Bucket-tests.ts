import { CityFixture } from "lib/__fixtures__/CityFixture"
import { uniq } from "lodash"
import { bucketCityResults } from "../bucketCityResults"

// The stubbed data needs re-creating
//
describe.skip(bucketCityResults, () => {
  const results = bucketCityResults({ city: CityFixture } as any)

  it("doesn't yet support saved results", () => {
    expect(results.saved).toEqual([])
  })

  it("calculates galleries correctly", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    expect(uniq(results.galleries.map(s => s.partner.type))).toEqual(["Gallery"])
  })

  it("calculates museums correctly", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    expect(uniq(results.museums.map(s => s.partner.type))).toEqual(["Institution"])
  })
})
