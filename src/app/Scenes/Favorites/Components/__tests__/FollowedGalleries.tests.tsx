import { screen } from "@testing-library/react-native"
import { FollowedGalleriesTestsQuery } from "__generated__/FollowedGalleriesTestsQuery.graphql"
import { FollowedGalleries } from "app/Scenes/Favorites/Components/FollowedGalleries"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Partner item has a nested query renderer that messes up tests
// We are using using to improve the query performance
jest.mock("app/Components/PartnerFollowButton", () => ({
  PartnerFollowButtonQueryRenderer: () => null,
}))

describe("FollowedGalleries", () => {
  const { renderWithRelay } = setupTestWrapper<FollowedGalleriesTestsQuery>({
    Component: ({ me }) => (
      <FavoritesContextStore.Provider>
        <FollowedGalleries me={me} />
      </FavoritesContextStore.Provider>
    ),
    query: graphql`
      query FollowedGalleriesTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...FollowedGalleries_me
        }
      }
    `,
  })

  it("renders empty state screen when the user has no saved galleries", () => {
    renderWithRelay({
      FollowedGalleryConnection: () => ({
        edges: [],
      }),
    })

    expect(screen.getByText("You haven’t followed any galleries yet")).toBeTruthy()
  })

  it("renders a list of galleries", async () => {
    renderWithRelay({
      FollowedGalleryConnection: () => ({
        edges: [
          {
            node: {
              id: "id-1",
              name: "Gallery 1",
              href: "gallery-1-href",
              image: {
                url: "image-url",
              },
            },
          },
          {
            node: {
              id: "id-2",
              name: "Gallery 2",
              href: "gallery-2-href",
              image: {
                url: "image-url",
              },
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Gallery 1")).toBeTruthy()
    expect(screen.getByText("Gallery 2")).toBeTruthy()
  })
})
