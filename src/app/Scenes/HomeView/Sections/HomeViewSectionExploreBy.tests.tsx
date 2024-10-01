import { screen } from "@testing-library/react-native"
import { HomeViewSectionExploreByTestsQuery } from "__generated__/HomeViewSectionExploreByTestsQuery.graphql"
import { HomeViewSectionExploreBy } from "app/Scenes/HomeView/Sections/HomeViewSectionExploreBy"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionExploreBy", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionExploreByTestsQuery>({
    Component: (props) => <HomeViewSectionExploreBy section={props.homeView.section} />,
    query: graphql`
      query HomeViewSectionExploreByTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-explore-by-category") @required(action: NONE) {
            ...HomeViewSectionExploreBy_section
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        component: {
          title: "Explore by category",
        },
      }),
    })

    expect(screen.getByText("Explore by category")).toBeOnTheScreen()
  })
})
