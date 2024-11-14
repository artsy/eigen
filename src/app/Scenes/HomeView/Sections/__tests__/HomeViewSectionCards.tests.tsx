import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionCardsTestsQuery } from "__generated__/HomeViewSectionCardsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionCards } from "app/Scenes/HomeView/Sections/HomeViewSectionCards"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
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

  it("does not render if no cards are available", () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        component: { title: "Explore by category" },
        cardsConnection: null,
      }),
    })

    expect(screen.queryByText("Explore by category")).not.toBeOnTheScreen()
  })

  it("renders a list of cards", () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        component: { title: "Explore by category" },
        cardsConnection: {
          edges: [
            {
              node: {
                title: "Card 1",
              },
            },
            {
              node: {
                title: "Card 2",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Explore by category")).toBeOnTheScreen()
    expect(screen.getByText(/Card 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Card 2/)).toBeOnTheScreen()
  })

  it("navigates and tracks card clicks", () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        component: { title: "Explore by category" },
        contextModule: "some-cards",
        cardsConnection: {
          edges: [
            {
              node: {
                title: "Card 1",
                href: "/card-1",
                entityID: "Collect by Price",
                entityType: "collectionsCategory",
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText(/Card 1/))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedCardGroup",
        context_module: "some-cards",
        context_screen_owner_type: "home",
        destination_screen_owner_id: "Collect by Price",
        destination_screen_owner_type: "collectionsCategory",
      })
    )

    expect(navigate).toHaveBeenCalledWith(expect.stringMatching("/collections-by-category/Card 1"))
  })
})
