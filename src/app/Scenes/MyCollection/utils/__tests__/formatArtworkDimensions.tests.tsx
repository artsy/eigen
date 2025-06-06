import { formatArtworkDimensions } from "app/Scenes/MyCollection/utils/formatArtworkDimensions"

describe("formatArtworkDimensions", () => {
  it("return null if height width metric is missing", () => {
    expect(formatArtworkDimensions({} as any)).toBeNull()
  })

  it("formats dimensions", () => {
    expect(formatArtworkDimensions({ height: 10, width: 20, depth: 30, metric: "in" })).toBe(
      "10 × 20 × 30 in"
    )
  })
})
