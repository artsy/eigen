import { MOCK_NEIGHBORHOODS } from "app/Scenes/CityGuide/utils/mockCityNeighborhoods"

describe("MOCK_NEIGHBORHOODS", () => {
  it("covers London", () => {
    expect(MOCK_NEIGHBORHOODS["london-united-kingdom"]).toBeDefined()
  })

  it("gives every entry a unique id", () => {
    Object.values(MOCK_NEIGHBORHOODS).forEach((defs) => {
      const ids = defs.map((d) => d.id)
      expect(new Set(ids).size).toEqual(ids.length)
    })
  })

  it("uses normalised, non-empty prefixes throughout", () => {
    Object.values(MOCK_NEIGHBORHOODS).forEach((defs) => {
      defs.forEach((def) => {
        expect(def.postalPrefixes.length).toBeGreaterThan(0)
        def.postalPrefixes.forEach((prefix) => {
          expect(prefix).toEqual(prefix.toUpperCase().replace(/\s+/g, ""))
          expect(prefix.length).toBeGreaterThan(0)
        })
      })
    })
  })
})
