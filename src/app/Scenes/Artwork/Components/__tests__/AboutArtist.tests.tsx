import { fireEvent, screen } from "@testing-library/react-native"
import { AboutArtistFragmentContainer } from "app/Scenes/Artwork/Components/AboutArtist"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

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

  it("tracks taps on artist bio read more", () => {
    renderWithRelay({
      Artwork: () => ({
        isUnlisted: true,
        displayArtistBio: true,
        artists: [
          {
            biographyBlurb: {
              text: "Jon Allured, an acclaimed contemporary artist, has carved a niche for himself in the art world with his vibrant and thought-provoking abstract paintings. Born and raised in a small coastal town, Jon's early exposure to the raw beauty of nature deeply influenced his artistic perspective. He studied fine arts at a prestigious university, where he honed his skills and developed his distinctive style. Jon's work is characterized by bold color palettes, dynamic textures, and fluid, organic shapes that invite viewers to interpret their own meanings. His paintings often incorporate mixed media, using everything from traditional oils to experimental materials, which add depth and intrigue to his canvases.",
            },
          },
        ],
      }),
    })

    const readMoreLink = screen.getByText("Read more")
    fireEvent.press(readMoreLink)
    expect(mockTrackEvent).toBeCalledWith({
      action_name: "readMore",
      action_type: "tap",
      context_module: "ArtistBiography",
      flow: "AboutTheArtist",
    })
  })
})
