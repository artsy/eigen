import { screen } from "@testing-library/react-native"
import { HomeViewSectionArticlesCardsTestsQuery } from "__generated__/HomeViewSectionArticlesCardsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArticlesCards } from "app/Scenes/HomeView/Sections/HomeViewSectionArticlesCards"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionArticlesCards", () => {
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
      ArticleConnection: () => ({
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
      }),
    })

    expect(screen.getByText(/Some news items/)).toBeOnTheScreen()
    expect(screen.getByText(/The first news item/)).toBeOnTheScreen()
    expect(screen.getByText(/The second news item/)).toBeOnTheScreen()
    expect(screen.getByText(/The third news item/)).toBeOnTheScreen()
    expect(screen.getByText(/All the news/)).toBeOnTheScreen()
  })
})
