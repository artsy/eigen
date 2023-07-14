import { fireEvent, screen } from "@testing-library/react-native"
import { RelatedArtistsRailCellTestQuery } from "__generated__/RelatedArtistsRailCellTestQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { RelatedArtistsRailCell } from "./RelatedArtistsRailCell"

describe("RelatedArtistsRail", () => {
  const { renderWithRelay } = setupTestWrapper<RelatedArtistsRailCellTestQuery>({
    Component: ({ artist }) => {
      return <RelatedArtistsRailCell artist={artist} />
    },
    query: graphql`
      query RelatedArtistsRailCellTestQuery @relay_test_operation {
        artist(id: "artist-id") @required(action: NONE) {
          ...RelatedArtistsRailCell_artist
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({ Artist: () => artist })

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("American, 01-01-01")).toBeOnTheScreen()
    expect(screen.getByText("Follow")).toBeOnTheScreen()
  })

  it("navigates to the artist href", () => {
    renderWithRelay({ Artist: () => artist })

    fireEvent.press(screen.getByText("Andy Warhol"))

    expect(navigate).toHaveBeenCalledWith("artist-href")
  })

  it("follows the artist", () => {
    const { mockResolveLastOperation } = renderWithRelay({ Artist: () => artist })

    fireEvent.press(screen.getByText("Follow"))

    mockResolveLastOperation({
      Artist: () => ({
        ...artist,
        isFollowed: true,
      }),
    })

    expect(screen.getByText("Following")).toBeOnTheScreen()
  })

  it("unfollows the artist", () => {
    const { mockResolveLastOperation } = renderWithRelay({
      Artist: () => ({
        ...artist,
        isFollowed: true,
      }),
    })

    fireEvent.press(screen.getByText("Following"))

    mockResolveLastOperation({ Artist: () => artist })

    expect(screen.getByText("Follow")).toBeOnTheScreen()
  })
})

const artist = {
  id: "id",
  internalID: "artist-id",
  formattedNationalityAndBirthday: "American, 01-01-01",
  name: "Andy Warhol",
  href: "artist-href",
  isFollowed: false,
  image: {
    url: "image-url",
  },
}
