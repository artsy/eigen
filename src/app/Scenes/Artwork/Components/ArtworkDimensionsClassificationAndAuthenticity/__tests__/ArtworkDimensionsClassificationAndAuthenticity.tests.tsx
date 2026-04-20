import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkDimensionsClassificationAndAuthenticityFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkDimensionsClassificationAndAuthenticity"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkDimensionsClassificationAndAuthenticity", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtworkDimensionsClassificationAndAuthenticityFragmentContainer,
    query: graphql`
      query ArtworkDimensionsClassificationAndAuthenticity_Test_Query {
        artwork(id: "example") {
          ...ArtworkDimensionsClassificationAndAuthenticity_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })
  })

  it("renders dimensions correctly", () => {
    renderWithRelay({
      Artwork: () => ({
        dimensions: { in: "4 × 3 1/2 in", cm: "10.2 × 8.9 cm" },
        editionSets: null,
      }),
    })

    expect(screen.getByText("4 × 3 1/2 in | 10.2 × 8.9 cm")).toBeTruthy()
  })

  it("renders rarity correctly", () => {
    renderWithRelay({
      Artwork: () => ({ attributionClass: { shortArrayDescription: ["", "Unique work"] } }),
    })

    expect(screen.getByText("Unique work")).toBeTruthy()
  })

  it("navigates to artwork classifications when tapped", () => {
    renderWithRelay({
      Artwork: () => ({ attributionClass: { shortArrayDescription: ["", "Unique work"] } }),
    })

    fireEvent.press(screen.getByText("Unique work"))
    expect(navigate).toHaveBeenCalledWith(`/artwork-classifications`)
  })

  it("renders authenticity correctly", () => {
    renderWithRelay({
      Artwork: () => ({ hasCertificateOfAuthenticity: true, isBiddable: false }),
    })

    expect(screen.getByText("Certificate of Authenticity")).toBeTruthy()
  })

  it("navigates to artwork certificate of authenticity when tapped", () => {
    renderWithRelay({
      Artwork: () => ({ hasCertificateOfAuthenticity: true, isBiddable: false }),
    })

    fireEvent.press(screen.getByText("Certificate of Authenticity"))
    expect(navigate).toHaveBeenCalledWith(`/artwork-certificate-of-authenticity`)
  })

  it("renders 'Frame not included' when there is no frame", () => {
    renderWithRelay({
      Artwork: () => ({ framed: { details: "not included" } }),
    })

    expect(screen.getByText("Frame not included")).toBeTruthy()
  })

  it("does not render a frame string when artwork is not unlisted", () => {
    renderWithRelay({
      Artwork: () => ({
        framed: { details: "not included" },
        isUnlisted: false,
      }),
    })

    expect(screen.queryByText("Frame not included")).toBeFalsy()
  })

  it("renders 'Frame included' when the frame is included", () => {
    renderWithRelay({
      Artwork: () => ({ framed: { details: "Included" } }),
    })

    expect(screen.getByText("Frame included")).toBeTruthy()
  })

  describe("with AREnableArtworksFramedSize feature flag enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })
    })

    it("renders framed dimensions with 'with frame included' text when framed dimensions exist", () => {
      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
          framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
          editionSets: null,
        }),
      })

      expect(screen.getByText("24 × 34 in | 61 × 86 cm with frame included")).toBeOnTheScreen()
      expect(screen.queryByText("20 × 30 in | 50 × 76 cm")).not.toBeOnTheScreen()
    })

    it("does not render frame status text when framed dimensions exist", () => {
      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
          framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
          framed: { details: "Included" },
          editionSets: null,
        }),
      })

      expect(screen.getByText("24 × 34 in | 61 × 86 cm with frame included")).toBeOnTheScreen()
      expect(screen.queryByText("Frame included")).not.toBeOnTheScreen()
      expect(screen.queryByText("Frame not included")).not.toBeOnTheScreen()
    })

    it("shows regular dimensions when framed dimensions do not exist", () => {
      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
          framedDimensions: null,
          editionSets: null,
        }),
      })

      expect(screen.getByText("20 × 30 in | 50 × 76 cm")).toBeOnTheScreen()
    })

    it("shows regular dimensions but hides frame text when no framed dimensions", () => {
      renderWithRelay({
        Artwork: () => ({
          dimensions: { in: "18 × 24 in", cm: "45 × 61 cm" },
          framedDimensions: null,
          framed: { details: "Included" },
          editionSets: null,
        }),
      })

      expect(screen.getByText("18 × 24 in | 45 × 61 cm")).toBeOnTheScreen()
      expect(screen.queryByText("Frame included")).not.toBeOnTheScreen()
    })

    it("hides all dimension info when both dimensions and framed dimensions are null", () => {
      renderWithRelay({
        Artwork: () => ({ dimensions: null, framedDimensions: null, editionSets: null }),
      })

      expect(screen.queryByText(/×/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/in/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/cm/)).not.toBeOnTheScreen()
    })

    describe("with edition sets", () => {
      it("uses single edition set framed dimensions when there is exactly one edition set", () => {
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

        expect(screen.getByText("22 × 32 in | 56 × 81 cm with frame included")).toBeOnTheScreen()
        expect(
          screen.queryByText("24 × 34 in | 61 × 86 cm with frame included")
        ).not.toBeOnTheScreen()
      })

      it("shows regular edition set dimensions when single edition set has no framed dimensions", () => {
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

        expect(screen.getByText("18 × 28 in | 46 × 71 cm")).toBeOnTheScreen()
        expect(screen.queryByText("20 × 30 in | 50 × 76 cm")).not.toBeOnTheScreen()
      })

      it("hides dimension text when there are multiple edition sets", () => {
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

        expect(screen.queryByText(/with frame included/)).not.toBeOnTheScreen()
        expect(screen.queryByText("20 × 30 in | 50 × 76 cm")).not.toBeOnTheScreen()
      })
    })
  })
})
