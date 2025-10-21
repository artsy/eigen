import { screen } from "@testing-library/react-native"
import { ArtworksCardTestQuery } from "__generated__/ArtworksCardTestQuery.graphql"
import { ArtworksCard } from "app/Scenes/HomeView/Components/ArtworksCard"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import RNDeviceInfo from "react-native-device-info"
import { graphql } from "react-relay"

describe("ArtworksCard", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworksCardTestQuery>({
    Component: (props) => {
      if (!props.artwork) {
        return null
      }

      return <ArtworksCard artworks={[props.artwork]} />
    },
    query: graphql`
      query ArtworksCardTestQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          ...ArtworksCard_artworks
        }
      }
    `,
    variables: {
      artworkID: "test-artwork-id",
    },
  })

  it("renders three artwork images with horizontal layout", () => {
    renderWithRelay({
      Artwork: () => ({
        image: {
          url: "https://example0.com/image.jpg",
          aspectRatio: 1.5, // horizontal aspect ratio
          blurhash: "bh1",
        },
      }),
    })

    const images = screen.queryAllByTestId("artwork-image")
    expect(images).toHaveLength(3)

    const flexWrapper = screen.getByTestId("artworks-card")
    expect(flexWrapper.props.flexDirection).toBe("column")
  })

  it("renders three artwork images with vertical layout", () => {
    renderWithRelay({
      Artwork: () => ({
        image: {
          url: "https://example1.com/image.jpg",
          aspectRatio: 0.5, // vertical aspect ratio
          blurhash: "bh1",
        },
      }),
    })

    const images = screen.queryAllByTestId("artwork-image")
    expect(images).toHaveLength(3)

    const flexWrapper = screen.getByTestId("artworks-card")
    expect(flexWrapper.props.flexDirection).toBe("row")
  })

  it("renders with correct dimensions for vertical leading image on iPad", () => {
    jest.spyOn(RNDeviceInfo, "isTablet").mockReturnValue(true)

    renderWithRelay({
      Artwork: () => ({
        image: {
          url: "https://example2.com/image.jpg",
          aspectRatio: 2, // horizontal aspect ratio
          blurhash: "bh2",
        },
      }),
    })

    const images = screen.queryAllByTestId("artwork-image")
    expect(images).toHaveLength(3)

    const flexWrapper = screen.getByTestId("artworks-card")
    expect(flexWrapper.props.flexDirection).toBe("row")
  })
})
