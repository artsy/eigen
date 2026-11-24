import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistCardTestsQuery } from "__generated__/ArtistCardTestsQuery.graphql"
import { ArtistCardContainer } from "app/Components/ArtistCard/ArtistCard"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql, useMutation } from "react-relay"

const mockCommit = jest.fn()

jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  useMutation: jest.fn(() => [mockCommit]),
}))

jest.mock("@d11/react-native-fast-image", () => {
  const React = require("react")
  const { View } = require("react-native")
  const FastImage = (props: any) => React.createElement(View, { testID: "fast-image", ...props })
  FastImage.priority = { low: "low", normal: "normal", high: "high" }
  FastImage.resizeMode = {
    contain: "contain",
    cover: "cover",
    stretch: "stretch",
    center: "center",
  }
  return FastImage
})

describe("ArtistCard", () => {
  beforeEach(() => {
    ;(useMutation as jest.Mock).mockReturnValue([mockCommit])
  })

  const { renderWithRelay } = setupTestWrapper<ArtistCardTestsQuery>({
    Component: ({ artist }) => {
      if (!artist) {
        return null
      }
      return <ArtistCardContainer artist={artist} showDefaultFollowButton />
    },
    query: graphql`
      query ArtistCardTestsQuery @relay_test_operation {
        artist(id: "banksy") {
          ...ArtistCard_artist
        }
      }
    `,
  })

  it("renders the artist meta", async () => {
    await renderWithRelay({ Artist: () => mockArtist })

    expect(screen.getByText("Juan Gris")).toBeOnTheScreen()
    expect(screen.getByText("Spanish, 1887–1927")).toBeOnTheScreen()
  })

  it("navigates to the artist page when tapped", async () => {
    await renderWithRelay({ Artist: () => mockArtist })

    await fireEvent.press(screen.getByText("Juan Gris"))

    expect(navigate).toHaveBeenCalledWith("/artist/juan-gris")
  })

  it("follows the artist when tapped", async () => {
    await renderWithRelay({ Artist: () => mockArtist })

    await fireEvent.press(screen.getByText("Follow"))

    expect(mockCommit).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: { artistID: "<Artist-mock-id-1>", unfollow: false },
        },
      })
    )
  })

  it("renders an image for each representative artwork", async () => {
    await renderWithRelay({ Artist: () => mockArtist })

    const images = screen.getAllByTestId("artist-card-image")
    expect(images).toHaveLength(2)
    // ArtistCard renders with performResize={false}, so the raw src is passed through untouched.
    const uris = screen.getAllByTestId("fast-image").map((image) => image.props.source.uri)
    expect(uris).toEqual(["https://example.com/image-1.jpg", "https://example.com/image-2.jpg"])
    expect(screen.queryByTestId("artist-card-images-empty")).not.toBeOnTheScreen()
  })

  it("caps the rendered images at 3 even if more are returned", async () => {
    await renderWithRelay({
      Artist: () => ({ ...mockArtist, representativeArtworks: resizedImages(5) }),
    })

    expect(screen.getAllByTestId("artist-card-image")).toHaveLength(3)
  })

  it("renders the empty state when there are no representative artworks", async () => {
    await renderWithRelay({ Artist: () => ({ ...mockArtist, representativeArtworks: [] }) })

    expect(screen.queryAllByTestId("artist-card-image")).toHaveLength(0)
    expect(screen.getByTestId("artist-card-images-empty")).toBeOnTheScreen()
  })
})

const resizedImages = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    image: {
      resized: { src: `https://example.com/image-${i + 1}.jpg`, width: 590, height: 400 },
    },
  }))

const mockArtist = {
  id: "QXJ0aXN0Omp1YW4tZ3Jpcw==",
  formattedNationalityAndBirthday: "Spanish, 1887–1927",
  href: "/artist/juan-gris",
  gravityID: "juan-gris",
  internalID: "4d8b934a4eb68a1b2c0012a1",
  name: "Juan Gris",
  representativeArtworks: resizedImages(2),
}
