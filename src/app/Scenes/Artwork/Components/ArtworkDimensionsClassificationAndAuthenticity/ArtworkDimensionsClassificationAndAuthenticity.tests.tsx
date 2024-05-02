import { fireEvent, screen } from "@testing-library/react-native"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtworkDimensionsClassificationAndAuthenticityFragmentContainer } from "./ArtworkDimensionsClassificationAndAuthenticity"

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

  it("clicking rarity opens modal", () => {
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

  it("clicking authenticity opens modal", () => {
    renderWithRelay({
      Artwork: () => ({ hasCertificateOfAuthenticity: true, isBiddable: false }),
    })

    fireEvent.press(screen.getByText("Certificate of Authenticity"))
    expect(navigate).toHaveBeenCalledWith(`/artwork-certificate-of-authenticity`)
  })
})
