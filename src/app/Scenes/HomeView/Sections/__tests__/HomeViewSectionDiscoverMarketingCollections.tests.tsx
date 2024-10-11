import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionDiscoverMarketingCollectionsTestsQuery } from "__generated__/HomeViewSectionDiscoverMarketingCollectionsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionDiscoverMarketingCollections } from "app/Scenes/HomeView/Sections/HomeViewSectionDiscoverMarketingCollections"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionDiscoverMarketingCollections", () => {
  const { renderWithRelay } =
    setupTestWrapper<HomeViewSectionDiscoverMarketingCollectionsTestsQuery>({
      Component: (props) => {
        return (
          <HomeViewStoreProvider>
            <HomeViewSectionDiscoverMarketingCollections
              section={props.homeView.section}
              index={0}
            />
          </HomeViewStoreProvider>
        )
      },
      query: graphql`
        query HomeViewSectionDiscoverMarketingCollectionsTestsQuery @relay_test_operation {
          homeView @required(action: NONE) {
            section(id: "home-view-section-discover-marketing-collections")
              @required(action: NONE) {
              ... on HomeViewSectionCards {
                ...HomeViewSectionDiscoverMarketingCollections_section
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
            {
              node: {
                title: "Figurative Art",
                subtitle: "Movement",
                href: "/figurative-art",
              },
            },
            {
              node: {
                title: "Abstract Art",
                subtitle: "Movement",
                href: "/abstract-art",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Discover Something New")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("Figurative Art"))
    expect(navigate).toHaveBeenCalledWith("/figurative-art")
  })
})
