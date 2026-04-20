import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { CollapsibleArtworkDetailsTestsQuery } from "__generated__/CollapsibleArtworkDetailsTestsQuery.graphql"
import { CollapsibleArtworkDetailsFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CollapsibleArtworkDetails", () => {
  const { renderWithRelay } = setupTestWrapper<CollapsibleArtworkDetailsTestsQuery>({
    Component: ({ artwork }) => <CollapsibleArtworkDetailsFragmentContainer artwork={artwork!} />,
    query: graphql`
      query CollapsibleArtworkDetailsTestsQuery @relay_test_operation {
        artwork(id: "some-slug") {
          ...CollapsibleArtworkDetails_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })
  })

  it("displays basic artwork details when collapsed", () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Artwork Title",
        date: "Artwork Date",
        artistNames: "Artist Names",
      }),
    })

    expect(screen.getByLabelText("Image of Artwork Title")).toBeVisible()
    expect(screen.getByText("Artist Names")).toBeVisible()
    expect(screen.getByText("Artwork Title, Artwork Date")).toBeVisible()
  })

  it("displays additonal artwork details when expanded", async () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Artwork Title",
        date: "Artwork Date",
        artistNames: "Artist Names",
        saleMessage: "Artwork Sale Message",
        mediumType: {
          name: "Artwork Medium Type Name",
        },
        manufacturer: "Artwork Manufacturer",
        publisher: "Artwork Publisher",
        medium: "Artwork Medium",
        attributionClass: {
          name: "Artwork Attribution Class Name",
        },
        dimensions: {
          in: "1 Artwork Dimensions Inches",
          cm: "1 Artwork Dimensions Centimeters",
        },
        signatureInfo: {
          details: "Artwork Signature Info Details",
        },
        isFramed: true,
        certificateOfAuthenticity: {
          details: "Artwork Certificate Of Authenticity Details",
        },
        conditionDescription: {
          details: "Artwork Condition Description Details",
        },
      }),
    })

    fireEvent.press(screen.getByLabelText("Show artwork details"))

    await waitFor(() => {
      expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
    })

    expect(screen.getByLabelText("Image of Artwork Title")).toBeVisible()
    expect(screen.getByText("Artist Names")).toBeVisible()
    expect(screen.getByText("Artwork Title, Artwork Date")).toBeVisible()
    expect(screen.getByText("Artwork Sale Message")).toBeVisible()
    expect(screen.getByText("Artwork Medium Type Name")).toBeVisible()
    expect(screen.getByText("Artwork Manufacturer")).toBeVisible()
    expect(screen.getByText("Artwork Publisher")).toBeVisible()
    expect(screen.getByText("Artwork Medium")).toBeVisible()
    expect(screen.getByText("Artwork Attribution Class Name")).toBeVisible()
    expect(
      screen.getByText("1 Artwork Dimensions Inches\n1 Artwork Dimensions Centimeters")
    ).toBeVisible()
    expect(screen.getByText("Artwork Signature Info Details")).toBeVisible()
    expect(screen.getByText("Included")).toBeVisible()
    expect(screen.getByText("Artwork Certificate Of Authenticity Details")).toBeVisible()
    expect(screen.getByText("Artwork Condition Description Details")).toBeVisible()
  })

  it("doesn't display missing artwork details when expanded", async () => {
    renderWithRelay({
      Artwork: () => ({
        saleMessage: "Artwork Sale Message",
        manufacturer: null,
        publisher: null,
        medium: "Artwork Medium",
      }),
    })

    fireEvent.press(screen.getByLabelText("Show artwork details"))

    await waitFor(() => {
      expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
    })

    expect(screen.getByText("Price")).toBeVisible()
    expect(screen.queryByText("Manufacturer")).toBeNull()
    expect(screen.queryByText("Publisher")).toBeNull()
    expect(screen.getByText("Materials")).toBeVisible()
  })

  it("diplays 'not included' when the artwork is not framed", async () => {
    renderWithRelay({
      Artwork: () => ({
        isFramed: false,
      }),
    })

    fireEvent.press(screen.getByLabelText("Show artwork details"))

    await waitFor(() => {
      expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
    })

    expect(screen.getByText("Frame")).toBeVisible()
    expect(screen.getByText("Not included")).toBeVisible()
  })

  describe("framed dimensions", () => {
    it("shows framed dimensions when feature flag is enabled and data is available", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })

      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 24 in", cm: "50.8 × 61 cm" },
          framedDimensions: { in: "24 × 28 in", cm: "61 × 71.1 cm" },
        }),
      })

      fireEvent.press(screen.getByLabelText("Show artwork details"))

      await waitFor(() => {
        expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
      })

      expect(screen.getByText("Dimensions")).toBeVisible()
      expect(screen.getByText("20 × 24 in\n50.8 × 61 cm")).toBeVisible()
      expect(screen.getByText("Framed Dimensions")).toBeVisible()
      expect(screen.getByText("24 × 28 in\n61 × 71.1 cm")).toBeVisible()
    })

    it("does not show framed dimensions when feature flag is disabled", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })

      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 24 in", cm: "50.8 × 61 cm" },
          framedDimensions: { in: "24 × 28 in", cm: "61 × 71.1 cm" },
        }),
      })

      fireEvent.press(screen.getByLabelText("Show artwork details"))

      await waitFor(() => {
        expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
      })

      expect(screen.getByText("Dimensions")).toBeVisible()
      expect(screen.getByText("20 × 24 in\n50.8 × 61 cm")).toBeVisible()
      expect(screen.queryByText("Framed Dimensions")).toBeNull()
      expect(screen.queryByText("24 × 28 in\n61 × 71.1 cm")).toBeNull()
    })

    it("does not show framed dimensions when data is missing", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })

      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 24 in", cm: "50.8 × 61 cm" },
          framedDimensions: null,
        }),
      })

      fireEvent.press(screen.getByLabelText("Show artwork details"))

      await waitFor(() => {
        expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
      })

      expect(screen.getByText("Dimensions")).toBeVisible()
      expect(screen.getByText("20 × 24 in\n50.8 × 61 cm")).toBeVisible()
      expect(screen.queryByText("Framed Dimensions")).toBeNull()
    })
  })
})
