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
          <HomeViewSectionArticles section={props.homeView.section} index={0} />
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

  it("does not render the section if no articles are available", () => {
    renderWithRelay({
      HomeViewSectionArticles: () => ({
        internalID: "home-view-section-latest-articles",
        component: {
          title: "Latest Articles",
        },
        articlesConnection: null,
      }),
    })

    expect(screen.queryByText("Latest Articles")).not.toBeOnTheScreen()
    expect(screen.toJSON()).toBeNull()
  })

  it("renders a list of articles", () => {
    renderWithRelay({
      HomeViewSectionArticles: () => ({
        internalID: "home-view-section-latest-articles",
        contextModule: "articleRail",
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
  })

  it("tracks article navigation", () => {
    renderWithRelay({
      HomeViewSectionArticles: () => ({
        internalID: "home-view-section-latest-articles",
        contextModule: "articleRail",
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

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "articleRail",
      context_screen_owner_type: "home",
      destination_screen_owner_id: "article-2-id",
      destination_screen_owner_slug: "article-2",
      destination_screen_owner_type: "article",
      horizontal_slide_position: 1,
      module_height: "double",
      type: "thumbnail",
    })
  })

  it("tracks view-all navigation", () => {
    renderWithRelay({
      HomeViewSectionArticles: () => ({
        internalID: "home-view-section-latest-articles",
        contextModule: "articleRail",
        component: {
          title: "Latest Articles",
          behaviors: {
            viewAll: {
              ownerType: "articles",
              href: "/articles",
            },
          },
        },
        articlesConnection: {
          edges: [
            {
              node: {
                thumbnailTitle: "Article 1",
                internalID: "article-1-id",
              },
            },
            {
              node: {
                thumbnailTitle: "Article 2",
                internalID: "article-2-id",
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText("Latest Articles"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "articleRail",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "articles",
      type: "viewAll",
    })
  })
})
