import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionArticlesCardsTestsQuery } from "__generated__/HomeViewSectionArticlesCardsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArticlesCards } from "app/Scenes/HomeView/Sections/HomeViewSectionArticlesCards"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionArticlesCards", () => {
  afterEach(() => {
    mockTrackEvent.mockClear()
  })

  const { renderWithRelay } = setupTestWrapper<HomeViewSectionArticlesCardsTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionArticlesCards section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionArticlesCardsTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-activity") {
            ... on HomeViewSectionArticles {
              ...HomeViewSectionArticlesCards_section
            }
          }
        }
      }
    `,
  })

  it("renders a list of articles", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "Some news items",
        behaviors: {
          viewAll: {
            href: "/articles",
            buttonText: "All the news",
          },
        },
      }),
      ArticleConnection: () => mockArticleconnection,
    })

    expect(screen.getByText(/Some news items/)).toBeOnTheScreen()
    expect(screen.getByText(/The first news item/)).toBeOnTheScreen()
    expect(screen.getByText(/The second news item/)).toBeOnTheScreen()
    expect(screen.getByText(/The third news item/)).toBeOnTheScreen()
    expect(screen.getByText(/All the news/)).toBeOnTheScreen()
  })

  it("handles item press", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "Some news items",
        behaviors: {
          viewAll: {
            href: "/articles",
            buttonText: "All the news",
          },
        },
      }),
      ArticleConnection: () => mockArticleconnection,
    })

    expect(screen.getByText(/Some news items/)).toBeOnTheScreen()
    expect(screen.getByText(/The first news item/)).toBeOnTheScreen()
    expect(screen.getByText(/The second news item/)).toBeOnTheScreen()
    expect(screen.getByText(/The third news item/)).toBeOnTheScreen()
    expect(screen.getByText(/All the news/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/The first news item/))

    expect(navigate).toHaveBeenCalledWith("/article/one")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: '<mock-value-for-field-"contextModule">',
      context_screen_owner_type: "home",
      destination_screen_owner_id: "<Article-mock-id-2>",
      destination_screen_owner_slug: '<mock-value-for-field-"slug">',
      destination_screen_owner_type: "article",
      horizontal_slide_position: 0,
      module_height: "double",
      type: "thumbnail",
    })
  })

  it("handles title press", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "Some news items",
        behaviors: {
          viewAll: {
            href: "/articles",
            buttonText: "All the news",
          },
        },
      }),
      ArticleConnection: () => mockArticleconnection,
    })

    fireEvent.press(screen.getByText(/All the news/))

    expect(navigate).toHaveBeenCalledWith("/articles")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: '<mock-value-for-field-"contextModule">',
      context_screen_owner_type: "home",
      destination_screen_owner_type: '<mock-value-for-field-"ownerType">',
      type: "viewAll",
    })
  })
})

const mockArticleconnection = {
  edges: [
    {
      node: {
        title: "The first news item",
        href: "/article/one",
      },
    },
    {
      node: {
        title: "The second news item",
        href: "/article/two",
      },
    },
    {
      node: {
        title: "The third news item",
        href: "/article/three",
      },
    },
  ],
}
