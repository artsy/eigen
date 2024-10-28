import { screen } from "@testing-library/react-native"
import { HomeViewSectionCardsTestsQuery } from "__generated__/HomeViewSectionCardsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionCards } from "app/Scenes/HomeView/Sections/HomeViewSectionCards"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionCards", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionCardsTestsQuery>({
    Component: (props) => (
      <HomeViewStoreProvider>
        <HomeViewSectionCards
          index={4}
          section={props.homeView.section}
          homeViewSectionId="test-id"
        />
      </HomeViewStoreProvider>
    ),
    query: graphql`
      query HomeViewSectionCardsTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-explore-by-category") @required(action: NONE) {
            ...HomeViewSectionCards_section
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        component: { title: "Explore by category" },
      }),
    })

    expect(screen.getByText("Explore by category")).toBeOnTheScreen()
  })
})
