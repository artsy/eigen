import { normalizePostalCode } from "app/Scenes/CityGuide/utils/cityEventSections"
import { MOCK_NEIGHBORHOODS } from "app/Scenes/CityGuide/utils/mockCityNeighborhoods"

describe("MOCK_NEIGHBORHOODS", () => {
  it("covers London", () => {
    expect(MOCK_NEIGHBORHOODS["london-united-kingdom"]).toBeDefined()
  })

  it("covers all twenty Paris arrondissements", () => {
    expect(MOCK_NEIGHBORHOODS["paris-france"]).toHaveLength(20)
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
          expect(normalizePostalCode(prefix)).toEqual(prefix)
          expect(prefix.length).toBeGreaterThan(0)
        })
      })
    })
  })

  it("never lists the same prefix twice within a city", () => {
    Object.entries(MOCK_NEIGHBORHOODS).forEach(([slug, defs]) => {
      const prefixes = defs.flatMap((d) => d.postalPrefixes)
      const duplicates = prefixes.filter((p, i) => prefixes.indexOf(p) !== i)

      expect({ slug, duplicates }).toEqual({ slug, duplicates: [] })
    })
  })
})
