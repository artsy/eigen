import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionArticlesTestsQuery } from "__generated__/HomeViewSectionArticlesTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArticles } from "app/Scenes/HomeView/Sections/HomeViewSectionArticles"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionArticles", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionArticlesTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionArticles section={props.homeView.section} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionArticlesTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-articles-rail") {
            ... on HomeViewSectionArticles {
              ...HomeViewSectionArticles_section
            }
          }
        }
      }
    `,
  })

  it("renders a list of articles", () => {
    renderWithRelay({
      HomeViewSectionArticles: () => ({
        internalID: "home-view-section-latest-articles",
        component: {
          title: "Latest Articles",
        },
        articlesConnection: {
          edges: [
            {
              node: {
                thumbnailTitle: "Article 1",
                slug: "article-1",
                internalID: "article-1-id",
              },
            },
            {
              node: {
                thumbnailTitle: "Article 2",
                slug: "article-2",
                internalID: "article-2-id",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Latest Articles")).toBeOnTheScreen()
    expect(screen.getByText("Article 1")).toBeOnTheScreen()
    expect(screen.getByText("Article 2")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Article 2"))
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedArticleGroup",
            "context_module": "<mock-value-for-field-"contextModule">",
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "article-2-id",
            "destination_screen_owner_slug": "article-2",
            "destination_screen_owner_type": "article",
            "horizontal_slide_position": 1,
            "module_height": "double",
            "type": "thumbnail",
          },
        ]
      `)
  })
})
