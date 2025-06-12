import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistCardTestsQuery } from "__generated__/ArtistCardTestsQuery.graphql"
import { ArtistCardContainer } from "app/Scenes/HomeView/Components/ArtistRails/ArtistCard"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql, useMutation } from "react-relay"

const mockCommit = jest.fn()

jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  useMutation: jest.fn(() => [mockCommit]),
}))

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

  it("renders the artist meta", () => {
    renderWithRelay({ Artist: () => mockArtist })

    expect(screen.getByText("Juan Gris")).toBeOnTheScreen()
    expect(screen.getByText("Spanish, 1887–1927")).toBeOnTheScreen()
  })

  it("navigates to the artist page when tapped", () => {
    renderWithRelay({ Artist: () => mockArtist })

    fireEvent.press(screen.getByText("Juan Gris"))

    expect(navigate).toHaveBeenCalledWith("/artist/juan-gris")
  })

  it("follows the artist when tapped", () => {
    renderWithRelay({ Artist: () => mockArtist })

    fireEvent.press(screen.getByText("Follow"))

    expect(mockCommit).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: { artistID: "<Artist-mock-id-1>", unfollow: false },
        },
      })
    )
  })
})

const mockArtist = {
  id: "QXJ0aXN0Omp1YW4tZ3Jpcw==",
  formattedNationalityAndBirthday: "Spanish, 1887–1927",
  href: "/artist/juan-gris",
  gravityID: "juan-gris",
  internalID: "4d8b934a4eb68a1b2c0012a1",
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/wGMxL6TvlSORJzEHZsK9JA/large.jpg",
  },
  name: "Juan Gris",
  artworksConnection: {
    edges: [
      {
        node: {
          image: {
            url: "https://example.com/image.jpg",
          },
        },
      },
    ],
  },
}
