import { CityFixture } from "lib/__fixtures__/CityFixture"
import { uniq } from "lodash"
import { bucketCityResults } from "../Bucket"

describe(bucketCityResults, () => {
  const results = bucketCityResults({ city: CityFixture } as any)

  it("doens't yet support saved results", () => {
    expect(results.saved).toEqual([])
  })

  it("calculates galleries correctly", () => {
    expect(uniq(results.galleries.map(s => s.node.partner.type))).toEqual(["Gallery"])
  })

  it("calculates museums correctly", () => {
    expect(uniq(results.museums.map(s => s.node.partner.type))).toEqual(["Institution"])
  })
})
