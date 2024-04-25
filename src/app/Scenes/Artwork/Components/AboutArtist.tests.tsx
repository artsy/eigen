import { screen } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { AboutArtistFragmentContainer } from "./AboutArtist"

describe("AboutArtist", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: AboutArtistFragmentContainer,
    query: graphql`
      query AboutArtist_Test_Query {
        artwork(id: "example") {
          ...AboutArtist_artwork
        }
      }
    `,
  })

  it("renders about artist correctly for one artist", () => {
    renderWithRelay({
      Artist: () => ({
        name: "Abbas Kiarostami",
      }),
    })

    expect(screen.getByText("About the artist")).toBeTruthy()
    expect(screen.getByText("Abbas Kiarostami")).toBeTruthy()
  })

  it("renders about artist correctly for more than one artists", () => {
    renderWithRelay({
      Artist: () => ({
        name: "Abbas Kiarostami",
      }),
      Artwork: () => ({
        artists: [
          {
            biographyBlurb: {
              text: "Biography of Abbas Kiarostami",
            },
          },
          {
            biographyBlurb: {
              text: "Biography of Abbas Kiarostami",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("About the artists")).toBeTruthy()
    expect(screen.queryAllByText("Abbas Kiarostami")).toHaveLength(2)
  })

  it("does not render anything if unlisted is false and displayArtistBio is false", () => {
    renderWithRelay({
      Artwork: () => ({
        isUnlisted: true,
        displayArtistBio: false,
        artists: [
          {
            biographyBlurb: {
              text: "Biography of Abbas Kiarostami",
            },
          },
        ],
      }),
    })

    expect(screen.queryByText("Biography of Abbas Kiarostami")).not.toBeOnTheScreen()
  })
})
