import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionMarketingCollectionsTestsQuery } from "__generated__/HomeViewSectionMarketingCollectionsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionMarketingCollections } from "app/Scenes/HomeView/Sections/HomeViewSectionMarketingCollections"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionMarketingCollections", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionMarketingCollectionsTestsQuery>({
    Component: (props) => {
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionMarketingCollections section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionMarketingCollectionsTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-latest-auction-results") @required(action: NONE) {
            ... on HomeViewSectionMarketingCollections {
              ...HomeViewSectionMarketingCollections_section
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
            href: "/collections",
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

    expect(navigate).toHaveBeenCalledWith("/collections")
  })

  it("navigates and tracks clicks on an individual collection", () => {
    renderWithRelay({
      HomeViewSectionMarketingCollections: () => ({
        internalID: "home-view-section-marketing-collections",
        component: {
          title: "Marketing Collections",
          behaviors: {
            viewAll: {
              href: "/collections",
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
          "context_module": "<mock-value-for-field-"contextModule">",
          "context_screen_owner_type": "home",
          "destination_screen_owner_id": "marketing-collection-id-2",
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
