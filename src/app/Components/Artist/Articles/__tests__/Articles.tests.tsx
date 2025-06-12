import { screen, fireEvent } from "@testing-library/react-native"
import { ArticlesTestsQuery } from "__generated__/ArticlesTestsQuery.graphql"
import { Articles } from "app/Components/Artist/Articles/Articles"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Articles", () => {
  const { renderWithRelay } = setupTestWrapper<ArticlesTestsQuery>({
    Component: ({ artist, articlesConnection }) => {
      const articles = extractNodes(articlesConnection)
      return <Articles artist={artist!} articles={articles} />
    },
    query: graphql`
      query ArticlesTestsQuery @relay_test_operation {
        artist(id: "andy-warhol") {
          ...Articles_artist
        }

        articlesConnection(first: 5) {
          edges {
            node {
              ...Articles_articles
            }
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(
      screen.getByText(`Artsy Editorial Featuring <mock-value-for-field-"name">`)
    ).toBeOnTheScreen()
    expect(screen.getByText(`<mock-value-for-field-"vertical">`)).toBeOnTheScreen()
    expect(screen.getByText(`<mock-value-for-field-"thumbnailTitle">`)).toBeOnTheScreen()
    expect(screen.getByText(`By <mock-value-for-field-"byline">`)).toBeOnTheScreen()
  })

  it("navigates to a specific article via webview", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText(`<mock-value-for-field-"thumbnailTitle">`))
    expect(navigate).toHaveBeenCalledWith(`<mock-value-for-field-\"href\">`)
  })

  it("navigates to a specific article natively", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText(`<mock-value-for-field-"thumbnailTitle">`))
    expect(navigate).toHaveBeenCalledWith(`<mock-value-for-field-\"href\">`)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "marketNews",
      context_screen_owner_id: "<Artist-mock-id-2>",
      context_screen_owner_slug: "<Artist-mock-id-1>",
      context_screen_owner_type: "artist",
      destination_screen_owner_id: "<Article-mock-id-4>",
      destination_screen_owner_slug: '<mock-value-for-field-"slug">',
      destination_screen_owner_type: "article",
      type: "thumbnail",
    })
  })

  it("navigates to all articles", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("View All"))
    expect(navigate).toHaveBeenCalledWith("artist/<Artist-mock-id-1>/articles")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "marketNews",
      context_screen_owner_type: "artist",
      destination_screen_owner_type: "articles",
      type: "viewAll",
    })
  })
})
