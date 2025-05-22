import { screen } from "@testing-library/react-native"
import { FollowedShowsTestsQuery } from "__generated__/FollowedShowsTestsQuery.graphql"
import { FollowedShows } from "app/Scenes/Favorites/Components/FollowedShows"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FollowedShows", () => {
  const { renderWithRelay } = setupTestWrapper<FollowedShowsTestsQuery>({
    Component: ({ me }) => (
      <FavoritesContextStore.Provider>
        <FollowedShows me={me} />
      </FavoritesContextStore.Provider>
    ),
    query: graphql`
      query FollowedShowsTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...FollowedShows_me
        }
      }
    `,
  })

  it("renders empty state screen when the user has no saved shows", () => {
    renderWithRelay({
      FollowedShowConnection: () => ({
        edges: [],
      }),
    })

    expect(screen.getByText("You haven’t saved any shows yet")).toBeTruthy()
  })

  it("renders a list of shows", () => {
    renderWithRelay({
      FollowedShowConnection: () => ({
        edges: [
          {
            node: {
              id: "id-1",
              name: "Show 1",
              href: "show-href",
              image: {
                url: "image-url",
              },
            },
          },
          {
            node: {
              id: "id-2",
              name: "Show 2",
              href: "show-href",
              image: {
                url: "image-url",
              },
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Show 1")).toBeTruthy()
    expect(screen.getByText("Show 2")).toBeTruthy()
  })
})
