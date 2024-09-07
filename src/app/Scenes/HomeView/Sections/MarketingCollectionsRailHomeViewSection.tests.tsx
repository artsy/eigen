import { fireEvent, screen } from "@testing-library/react-native"
import { MarketingCollectionsRailHomeViewSectionTestsQuery } from "__generated__/MarketingCollectionsRailHomeViewSectionTestsQuery.graphql"
import { MarketingCollectionsRailHomeViewSection } from "app/Scenes/HomeView/Sections/MarketingCollectionsRailHomeViewSection"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MarketingCollectionsRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<MarketingCollectionsRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      return <MarketingCollectionsRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query MarketingCollectionsRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-latest-auction-results") @required(action: NONE) {
            ... on MarketingCollectionsRailHomeViewSection {
              ...MarketingCollectionsRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders nothing when there are no marketing colections", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Marketing Collections",
      }),
      MarketingCollectionConnection: () => ({
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of marketing collections", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "Marketing Collections",
        behaviors: {
          viewAll: {
            href: "/marketing-collections-view-all-href",
          },
        },
      }),
      MarketingCollectionConnection: () => ({
        edges: [
          {
            node: {
              title: "Marketing collection 1",
            },
          },
          {
            node: {
              title: "Marketing collection 2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Marketing Collections")).toBeOnTheScreen()
    expect(screen.getByText(/Marketing collection 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Marketing collection 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Marketing Collections"))

    expect(navigate).toHaveBeenCalledWith("/marketing-collections-view-all-href")
  })

  it("navigates and tracks clicks on an individual collection", () => {
    renderWithRelay({
      MarketingCollectionsRailHomeViewSection: () => ({
        internalID: "home-view-section-latest-auction-results",
        component: {
          title: "Marketing Collections",
          behaviors: {
            viewAll: {
              href: "/marketing-collections-view-all-href",
            },
          },
        },
        marketingCollectionsConnection: {
          edges: [
            {
              node: {
                internalID: "marketing-collection-id-1",
                title: "Marketing collection 1",
                slug: "marketing-collection-slug-1",
              },
            },
            {
              node: {
                internalID: "marketing-collection-id-2",
                title: "Marketing collection 2",
                slug: "marketing-collection-slug-2",
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText(/Marketing collection 2/))

    expect(navigate).toHaveBeenCalledWith("/collection/marketing-collection-slug-2")
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedCollectionGroup",
          "context_module": "home-view-section-latest-auction-results",
          "context_screen_owner_id": undefined,
          "context_screen_owner_slug": undefined,
          "context_screen_owner_type": "home",
          "destination_screen_owner_id": undefined,
          "destination_screen_owner_slug": "marketing-collection-slug-2",
          "destination_screen_owner_type": "collection",
          "horizontal_slide_position": 1,
          "module_height": "double",
          "type": "thumbnail",
        },
      ]
    `)
  })
})
