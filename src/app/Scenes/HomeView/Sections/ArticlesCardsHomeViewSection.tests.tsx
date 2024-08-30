import { screen } from "@testing-library/react-native"
import { ArticlesCardsHomeViewSectionTestsQuery } from "__generated__/ArticlesCardsHomeViewSectionTestsQuery.graphql"
import { ArticlesCardsHomeViewSection } from "app/Scenes/HomeView/Sections/ArticlesCardsHomeViewSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticlesCardsHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<ArticlesCardsHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <ArticlesCardsHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query ArticlesCardsHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-activity") {
            ... on ArticlesHomeViewSection {
              ...ArticlesCardsHomeViewSection_section
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
