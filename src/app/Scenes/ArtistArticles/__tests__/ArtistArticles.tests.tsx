import { screen } from "@testing-library/react-native"
import { ArtistArticlesTestsQuery } from "__generated__/ArtistArticlesTestsQuery.graphql"
import { ArtistArticlesContainer } from "app/Scenes/ArtistArticles/ArtistArticles"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Artist Articles", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistArticlesTestsQuery>({
    Component: ({ artist }) => <ArtistArticlesContainer artist={artist!} />,
    query: graphql`
      query ArtistArticlesTestsQuery @relay_test_operation {
        artist(id: "some-id") {
          ...ArtistArticles_artist
        }
      }
    `,
  })

  it("renders without throwing an error", () => {
    renderWithRelay({
      Article: () => ({ thumbnailTitle: "An Article Title" }),
    })

    expect(screen.getAllByText("Articles").length).toBeGreaterThan(0)
    expect(screen.getByText("An Article Title")).toBeOnTheScreen()
  })
})
