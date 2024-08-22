import { screen } from "@testing-library/react-native"
import { ArticlesRailHomeViewSectionTestsQuery } from "__generated__/ArticlesRailHomeViewSectionTestsQuery.graphql"
import { ArticlesRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArticlesRailHomeViewSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticlesRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<ArticlesRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <ArticlesRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query ArticlesRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-articles-rail") {
            ... on ArticlesRailHomeViewSection {
              ...ArticlesRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders a list of articles", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "Latest Articles",
      }),
      ArticleConnection: () => ({
        edges: [
          {
            node: {
              thumbnailTitle: "Article 1",
            },
          },
          {
            node: {
              thumbnailTitle: "Article 2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Latest Articles")).toBeOnTheScreen()
    expect(screen.getByText("Article 1")).toBeOnTheScreen()
    expect(screen.getByText("Article 2")).toBeOnTheScreen()
  })
})
