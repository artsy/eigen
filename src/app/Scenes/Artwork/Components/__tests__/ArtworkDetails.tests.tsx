import { act, fireEvent, screen } from "@testing-library/react-native"
import { ArtworkDetails_artwork_TestQuery } from "__generated__/ArtworkDetails_artwork_TestQuery.graphql"
import { ArtworkStore, ArtworkStoreProvider, artworkModel } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkDetails } from "app/Scenes/Artwork/Components/ArtworkDetails"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkDetails", () => {
  let mockArtworkStore: ReturnType<typeof ArtworkStore.useStore>

  const ArtworkStoreDebug = () => {
    mockArtworkStore = ArtworkStore.useStore()
    return null
  }

  const { renderWithRelay } = setupTestWrapper<ArtworkDetails_artwork_TestQuery>({
    Component: ({ artwork }) => (
      <ArtworkStoreProvider runtimeModel={artworkModel}>
        <ArtworkDetails artwork={artwork!} />

        <ArtworkStoreDebug />
      </ArtworkStoreProvider>
    ),
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
          editionSets: null,
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
          editionSets: null,
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
          editionSets: null,
        }),
      })

      expect(screen.queryByText("Size")).not.toBeOnTheScreen()
      expect(screen.queryByText("Framed Size")).not.toBeOnTheScreen()
    })

    describe("with edition sets", () => {
      it("shows edition set dimensions when there is only one edition set", () => {
        renderWithRelay({
          Artwork: () => ({
            dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
            framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
            editionSets: [
              {
                internalID: "edition-1",
                dimensions: { in: "18 × 28 in", cm: "46 × 71 cm" },
                framedDimensions: { in: "22 × 32 in", cm: "56 × 81 cm" },
              },
            ],
          }),
        })

        expect(screen.getByText("Size")).toBeOnTheScreen()
        expect(screen.getByText("18 × 28 in | 46 × 71 cm")).toBeOnTheScreen()
        expect(screen.getByText("Framed Size")).toBeOnTheScreen()
        expect(screen.getByText("22 × 32 in | 56 × 81 cm")).toBeOnTheScreen()
      })

      it("hides dimensions when the single edition set has no framed dimensions", () => {
        renderWithRelay({
          Artwork: () => ({
            dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
            framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
            editionSets: [
              {
                internalID: "edition-1",
                dimensions: { in: "18 × 28 in", cm: "46 × 71 cm" },
                framedDimensions: null,
              },
            ],
          }),
        })

        expect(screen.queryByText("Size")).not.toBeOnTheScreen()
        expect(screen.queryByText("Framed Size")).not.toBeOnTheScreen()
      })

      it("shows selected edition dimensions when there are multiple edition sets", () => {
        renderWithRelay({
          Artwork: () => ({
            dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
            framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
            editionSets: [
              {
                internalID: "edition-1",
                dimensions: { in: "18 × 28 in", cm: "46 × 71 cm" },
                framedDimensions: { in: "22 × 32 in", cm: "56 × 81 cm" },
              },
              {
                internalID: "edition-2",
                dimensions: { in: "16 × 24 in", cm: "41 × 61 cm" },
                framedDimensions: { in: "20 × 28 in", cm: "51 × 71 cm" },
              },
            ],
          }),
        })

        act(() => {
          mockArtworkStore.getActions().setSelectedEditionId("edition-2")
        })

        expect(screen.getByText("Size")).toBeOnTheScreen()
        expect(screen.getByText("16 × 24 in | 41 × 61 cm")).toBeOnTheScreen()
        expect(screen.getByText("Framed Size")).toBeOnTheScreen()
        expect(screen.getByText("20 × 28 in | 51 × 71 cm")).toBeOnTheScreen()
      })

      it("hides dimensions when selected edition has no framed dimensions", () => {
        renderWithRelay({
          Artwork: () => ({
            dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
            framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
            editionSets: [
              {
                internalID: "edition-1",
                dimensions: { in: "18 × 28 in", cm: "46 × 71 cm" },
                framedDimensions: { in: "22 × 32 in", cm: "56 × 81 cm" },
              },
              {
                internalID: "edition-2",
                dimensions: { in: "16 × 24 in", cm: "41 × 61 cm" },
                framedDimensions: null,
              },
            ],
          }),
        })

        act(() => {
          mockArtworkStore.getActions().setSelectedEditionId("edition-2")
        })

        expect(screen.queryByText("Size")).not.toBeOnTheScreen()
        expect(screen.queryByText("Framed Size")).not.toBeOnTheScreen()
      })
    })
  })
})
