import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkDetails_artwork_TestQuery } from "__generated__/ArtworkDetails_artwork_TestQuery.graphql"
import { ArtworkDetails } from "app/Scenes/Artwork/Components/ArtworkDetails"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkDetails", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkDetails_artwork_TestQuery>({
    Component: ({ artwork }) => <ArtworkDetails artwork={artwork!} />,
    query: graphql`
      query ArtworkDetails_artwork_TestQuery @relay_test_operation {
        artwork(id: "four-pence-coins-david-lynch") {
          ...ArtworkDetails_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })
  })

  it("renders all data correctly", async () => {
    renderWithRelay({})

    expect(screen.getByText("Medium")).toBeOnTheScreen()
    expect(screen.getByText("Condition")).toBeOnTheScreen()
    expect(screen.getByText("Certificate of Authenticity")).toBeOnTheScreen()
    expect(screen.getByText("Signature")).toBeOnTheScreen()
    expect(screen.getByText("Series")).toBeOnTheScreen()
    expect(screen.getByText("Publisher")).toBeOnTheScreen()
    expect(screen.getByText("Manufacturer")).toBeOnTheScreen()
    expect(screen.getByText("Image rights")).toBeOnTheScreen()
  })

  it("doesn't render fields that are null or empty string", async () => {
    renderWithRelay({
      Artwork: () => ({
        framed: {
          details: "",
        },
        publisher: null,
        manufacturer: null,
      }),
    })

    expect(screen.getByText("Medium")).toBeOnTheScreen()
    expect(screen.getByText("Condition")).toBeOnTheScreen()

    expect(screen.getByText("Signature")).toBeOnTheScreen()
    expect(screen.getByText("Series")).toBeOnTheScreen()

    expect(screen.getByText("Image rights")).toBeOnTheScreen()

    expect(screen.queryByText("Frame")).not.toBeOnTheScreen()
    expect(screen.queryByText("Publisher")).not.toBeOnTheScreen()
    expect(screen.queryByText("Manufacturer")).not.toBeOnTheScreen()
  })

  it("navigates to medium info when tapped", async () => {
    renderWithRelay({
      Artwork: () => ({
        slug: "slug-1",
        mediumType: {
          name: "mediumName",
        },
      }),
    })

    fireEvent.press(screen.getByText("mediumName"))

    expect(navigate).toHaveBeenCalledWith("/artwork/slug-1/medium")
  })

  it("should not render condition report button when canRequestLotConditionsReport false", async () => {
    renderWithRelay({
      Artwork: () => ({
        canRequestLotConditionsReport: false,
      }),
    })

    expect(screen.queryByTestId("request-condition-report")).not.toBeOnTheScreen()
  })

  describe("with AREnableArtworksFramedSize feature flag enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })
    })

    it("shows both Size and Framed Size when framed dimensions exist", () => {
      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
          framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
        }),
      })

      expect(screen.getByText("Size")).toBeOnTheScreen()
      expect(screen.getByText("20 × 30 in | 50 × 76 cm")).toBeOnTheScreen()
      expect(screen.getByText("Framed Size")).toBeOnTheScreen()
      expect(screen.getByText("24 × 34 in | 61 × 86 cm")).toBeOnTheScreen()
    })

    it("hides both Size and Framed Size when framed dimensions do not exist", () => {
      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
          framedDimensions: null,
        }),
      })

      expect(screen.queryByText("Size")).not.toBeOnTheScreen()
      expect(screen.queryByText("Framed Size")).not.toBeOnTheScreen()
      expect(screen.queryByText("20 × 30 in | 50 × 76 cm")).not.toBeOnTheScreen()
    })

    it("hides both Size and Framed Size when dimensions are empty", () => {
      renderWithRelay({
        Artwork: () => ({
          dimensions: null,
          framedDimensions: null,
        }),
      })

      expect(screen.queryByText("Size")).not.toBeOnTheScreen()
      expect(screen.queryByText("Framed Size")).not.toBeOnTheScreen()
    })
  })
})
