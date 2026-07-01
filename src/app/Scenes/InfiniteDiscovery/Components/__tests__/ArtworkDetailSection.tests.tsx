import { screen } from "@testing-library/react-native"
import { ArtworkDetailSectionTestQuery } from "__generated__/ArtworkDetailSectionTestQuery.graphql"
import { ArtworkDetailSection } from "app/Scenes/InfiniteDiscovery/Components/ArtworkDetailSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkDetailSection", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkDetailSectionTestQuery>({
    Component: ({ artwork }: any) => <ArtworkDetailSection artwork={artwork} />,
    query: graphql`
      query ArtworkDetailSectionTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...ArtworkDetailSection_artwork
        }
      }
    `,
    preloaded: true,
  })

  it("renders all fields when data is available", () => {
    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Artwork: () => artwork })

    expect(screen.getByText("Oil on canvas")).toBeOnTheScreen()
    expect(screen.getByText("20 × 24 in | 50.8 × 61 cm")).toBeOnTheScreen()
    expect(screen.getByText("Unique")).toBeOnTheScreen()
    expect(screen.getByText("Painting")).toBeOnTheScreen()
    expect(screen.getByText("Excellent condition")).toBeOnTheScreen()
    expect(screen.getByText("Signed and dated lower right")).toBeOnTheScreen()
    expect(screen.getByText("Includes gallery certificate")).toBeOnTheScreen()
    expect(screen.getByText("Test Publisher")).toBeOnTheScreen()
    expect(screen.getByText("Frame included")).toBeOnTheScreen()
  })

  it("does not render optional rows when data is missing", () => {
    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({
      Artwork: () => ({
        ...artwork,
        mediumType: null,
        condition: null,
        signatureInfo: null,
        certificateOfAuthenticity: null,
        publisher: null,
      }),
    })

    expect(screen.getByText("Oil on canvas")).toBeOnTheScreen()

    expect(screen.queryByText("Medium")).not.toBeOnTheScreen()
    expect(screen.queryByText("Condition")).not.toBeOnTheScreen()
    expect(screen.queryByText("Signature")).not.toBeOnTheScreen()
    expect(screen.queryByText("Certificate of Authenticity")).not.toBeOnTheScreen()
    expect(screen.queryByText("Publisher")).not.toBeOnTheScreen()
  })

  it("shows 'Frame not included' when isFramed is false", () => {
    const { mockResolveLastOperation } = renderWithRelay()
    mockResolveLastOperation({ Artwork: () => ({ ...artwork, isFramed: false }) })

    expect(screen.getByText("Frame not included")).toBeOnTheScreen()
  })

  describe("framed dimensions", () => {
    it("shows framed dimensions row when data is available", () => {
      const { mockResolveLastOperation } = renderWithRelay()
      mockResolveLastOperation({
        Artwork: () => ({
          ...artwork,
          framedDimensions: { in: "24 × 28 in", cm: "61 × 71.1 cm" },
        }),
      })

      expect(screen.getByText("20 × 24 in | 50.8 × 61 cm")).toBeOnTheScreen()
      expect(screen.getByText("24 × 28 in | 61 × 71.1 cm")).toBeOnTheScreen()
    })

    it("does not show framed dimensions row when data is missing", () => {
      const { mockResolveLastOperation } = renderWithRelay()
      mockResolveLastOperation({ Artwork: () => ({ ...artwork, framedDimensions: null }) })

      expect(screen.getByText("20 × 24 in | 50.8 × 61 cm")).toBeOnTheScreen()

      expect(screen.queryByText("Framed Dimensions")).not.toBeOnTheScreen()
    })
  })
})

const artwork = {
  medium: "Oil on canvas",
  dimensions: { in: "20 × 24 in", cm: "50.8 × 61 cm" },
  framedDimensions: null,
  attributionClass: { name: "Unique" },
  mediumType: { name: "Painting" },
  condition: { displayText: "Excellent condition" },
  signatureInfo: { details: "Signed and dated lower right" },
  certificateOfAuthenticity: { details: "Includes gallery certificate" },
  publisher: "Test Publisher",
  isFramed: true,
}
