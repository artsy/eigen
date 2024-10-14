import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionCardsChipsTestsQuery } from "__generated__/HomeViewSectionCardsChipsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionCardsChips } from "app/Scenes/HomeView/Sections/HomeViewSectionCardsChips"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionCardsChips", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionCardsChipsTestsQuery>({
    Component: (props) => {
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionCardsChips section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionCardsChipsTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-discover-marketing-collections") @required(action: NONE) {
            ... on HomeViewSectionCards {
              ...HomeViewSectionCardsChips_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        component: {
          title: "Discover Something New",
        },
        cardsConnection: {
          edges: [
            { node: { title: "Figurative Art", href: "/figurative-art" } },
            { node: { title: "Abstract Art", href: "/abstract-art" } },
            { node: { title: "Super Art", href: "/super-art" } },
            { node: { title: "Carrot Art", href: "/carrot-art" } },
          ],
        },
      }),
    })

    expect(screen.getByText("Discover Something New")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("Figurative Art"))
    expect(navigate).toHaveBeenCalledWith("/figurative-art")
  })
})
