import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkDimensionsClassificationAndAuthenticityFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkDimensionsClassificationAndAuthenticity"
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

  it("renders dimensions correctly", () => {
    renderWithRelay({
      Artwork: () => ({ dimensions: { in: "4 × 3 1/2 in", cm: "10.2 × 8.9 cm" } }),
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
})
