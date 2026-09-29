import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleSectionArtworkGridTestQuery } from "__generated__/ArticleSectionArtworkGridTestQuery.graphql"
import { ArticleSectionArtworkGrid } from "app/Scenes/Article/Components/Sections/ArticleSectionArtworkGrid"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSectionArtworkGrid", () => {
  const { renderWithRelay } = setupTestWrapper<ArticleSectionArtworkGridTestQuery>({
    Component: ({ article }) => {
      return <ArticleSectionArtworkGrid article={article!} section={article!.sections[0]} />
    },
    query: graphql`
      query ArticleSectionArtworkGridTestQuery @relay_test_operation {
        article(id: "article-id") {
          ...ArticleSectionArtworkGrid_article
          sections {
            ... on ArticleSectionArtworkGrid {
              ...ArticleSectionArtworkGrid_section
            }
          }
        }
      }
    `,
  })

  it("renders the artworks", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            __typename: "ArticleSectionArtworkGrid",
            columns: 3,
            artworksConnection: {
              edges: [
                { node: { title: "First Artwork" } },
                { node: { title: "Second Artwork" } },
              ],
            },
          },
        ],
      }),
    })

    expect(screen.getByTestId("ArticleSectionArtworkGrid")).toBeOnTheScreen()
    expect(screen.getByTestId("artworkGridItem-First Artwork")).toBeOnTheScreen()
    expect(screen.getByTestId("artworkGridItem-Second Artwork")).toBeOnTheScreen()
  })

  it("tracks taps on artworks", () => {
    renderWithRelay({
      Article: () => ({
        internalID: "article-id",
        slug: "article-slug",
        sections: [
          {
            __typename: "ArticleSectionArtworkGrid",
            columns: 3,
            artworksConnection: {
              edges: [
                {
                  node: {
                    internalID: "artwork-id",
                    slug: "example-artwork",
                    title: "Example Artwork",
                    collectorSignals: null,
                  },
                },
              ],
            },
          },
        ],
      }),
    })

    fireEvent.press(screen.getByTestId("artworkGridItem-Example Artwork"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedMainArtworkGrid",
        context_module: "artworkGrid",
        context_screen_owner_type: "article",
        context_screen_owner_id: "article-id",
        context_screen_owner_slug: "article-slug",
        destination_screen_owner_type: "artwork",
        destination_screen_owner_id: "artwork-id",
        destination_screen_owner_slug: "example-artwork",
        position: 0,
      })
    )
  })

  it("renders nothing when there are no artworks", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            __typename: "ArticleSectionArtworkGrid",
            columns: 3,
            artworksConnection: { edges: [] },
          },
        ],
      }),
    })

    expect(screen.queryByTestId("ArticleSectionArtworkGrid")).not.toBeOnTheScreen()
  })
})
