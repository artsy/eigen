import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionHeroUnitsTestsQuery } from "__generated__/HomeViewSectionHeroUnitsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionHeroUnits } from "app/Scenes/HomeView/Sections/HomeViewSectionHeroUnits"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionHeroUnits", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionHeroUnitsTestsQuery>({
    Component: (props) => {
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionHeroUnits section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionHeroUnitsTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-hero-units") @required(action: NONE) {
            ... on HomeViewSectionHeroUnits {
              ...HomeViewSectionHeroUnits_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      HomeViewSectionHeroUnits: () => ({
        internalID: "home-view-section-hero-units",
        heroUnitsConnection: {
          edges: [
            {
              node: {
                title: "Featured Fair",
                link: {
                  text: "See Fair",
                  url: "/fair/fair-1",
                },
              },
            },
            {
              node: {
                title: "Featured Collection",
                link: {
                  text: "See Collection",
                  url: "/collection/collection-1",
                },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Featured Fair")).toBeOnTheScreen()
    expect(screen.getByText("Featured Collection")).toBeOnTheScreen()
    expect(screen.getByText("See Fair")).toBeOnTheScreen()
    expect(screen.getByText("See Collection")).toBeOnTheScreen()
  })

  it("navigates and tracks hero unit taps", () => {
    renderWithRelay({
      HomeViewSectionHeroUnits: () => ({
        internalID: "home-view-section-hero-units",
        heroUnitsConnection: {
          edges: [
            {
              node: {
                title: "Featured Fair",
                link: {
                  text: "See Fair",
                  url: "/fair/fair-1",
                },
              },
            },
            {
              node: {
                internalID: "hero-unit-1-id",
                title: "Featured Collection",
                link: {
                  text: "See Collection",
                  url: "/collection/collection-1",
                },
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText("See Collection"))
    expect(navigate).toHaveBeenCalledWith("/collection/collection-1")
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
     [
       {
         "action": "tappedHeroUnitGroup",
         "context_module": "<mock-value-for-field-"contextModule">",
         "context_screen_owner_type": "home",
         "destination_path": "/collection/collection-1",
         "horizontal_slide_position": 1,
         "type": "header",
       },
     ]
  `)
  })
})
