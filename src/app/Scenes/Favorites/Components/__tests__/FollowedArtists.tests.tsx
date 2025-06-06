import { screen } from "@testing-library/react-native"
import { FollowedArtistsTestsQuery } from "__generated__/FollowedArtistsTestsQuery.graphql"
import { FollowedArtists } from "app/Scenes/Favorites/Components/FollowedArtists"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FollowedArtists", () => {
  const { renderWithRelay } = setupTestWrapper<FollowedArtistsTestsQuery>({
    Component: ({ me }) => (
      <FavoritesContextStore.Provider>
        <FollowedArtists me={me} />
      </FavoritesContextStore.Provider>
    ),
    query: graphql`
      query FollowedArtistsTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...FollowedArtists_me
        }
      }
    `,
  })

  it("renders empty state screen when the user has no followed artists", () => {
    renderWithRelay({
      FollowArtistConnection: () => ({
        totalCount: 0,
      }),
    })

    expect(screen.getByText("You haven’t followed any artists yet")).toBeTruthy()
  })

  it("renders a list of artists", () => {
    renderWithRelay({
      FollowArtistConnection: () => ({
        totalCount: 2,
        edges: [
          {
            node: {
              artist: {
                name: "Artist 1",
                href: "artist-href",
                image: {
                  url: "image-url",
                },
              },
            },
          },
          {
            node: {
              artist: {
                name: "Artist 2",
                href: "artist-href",
                image: {
                  url: "image-url",
                },
              },
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Artist 1")).toBeTruthy()
    expect(screen.getByText("Artist 2")).toBeTruthy()
  })
})
