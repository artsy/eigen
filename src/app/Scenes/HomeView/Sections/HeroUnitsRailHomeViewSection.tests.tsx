import { fireEvent, screen } from "@testing-library/react-native"
import { HeroUnitsRailHomeViewSectionTestsQuery } from "__generated__/HeroUnitsRailHomeViewSectionTestsQuery.graphql"
import { HeroUnitsHomeViewSection } from "app/Scenes/HomeView/Sections/HeroUnitsHomeViewSection"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HeroUnitsRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<HeroUnitsRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      return <HeroUnitsHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query HeroUnitsRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-hero-units") @required(action: NONE) {
            ... on HeroUnitsHomeViewSection {
              ...HeroUnitsHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      HeroUnitsHomeViewSection: () => ({
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
      HeroUnitsHomeViewSection: () => ({
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
         "action": "tappedHeroUnitsGroup",
         "context_module": "home-view-section-hero-units",
         "context_screen_owner_type": "home",
         "destination_screen_owner_id": "hero-unit-1-id",
         "destination_screen_owner_type": "Collection",
         "destination_screen_owner_url": "/collection/collection-1",
         "type": "header",
       },
     ]
  `)
  })
})
