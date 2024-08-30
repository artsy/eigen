import { screen } from "@testing-library/react-native"
import { SalesHomeViewSectionTestsQuery } from "__generated__/SalesHomeViewSectionTestsQuery.graphql"
import { SalesHomeViewSection } from "app/Scenes/HomeView/Sections/SalesHomeViewSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SalesHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<SalesHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <SalesHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query SalesHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-auctions") {
            ... on SalesHomeViewSection {
              ...SalesHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      SalesHomeViewSection: () => ({
        component: {
          title: "Auctions",
          behaviors: {
            viewAll: {
              href: "/auctions",
            },
          },
        },
        salesConnection: {
          edges: [
            {
              node: {
                name: "sale 1",
              },
            },
            {
              node: {
                name: "sale 2",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Auctions")).toBeOnTheScreen()
    expect(screen.getByText("Browse All Auctions")).toBeOnTheScreen()
    expect(screen.getByText("sale 1")).toBeOnTheScreen()
    expect(screen.getByText("sale 2")).toBeOnTheScreen()
  })

  it("tracks item presses properly", async () => {
    renderWithRelay({
      SalesRailHomeViewSection: () => ({
        internalID: "home-view-section-sales",
        component: {
          title: "Auctions",
          behaviors: {
            viewAll: {
              href: "/auctions",
              buttonText: "Browse All Auctions",
            },
          },
        },
        salesConnection: {
          edges: [
            {
              node: {
                name: "sale 1",
                href: "/sale-1-href",
                internalID: "sale-1-id",
                slug: "sale-1-slug",
                liveURLIfOpen: null,
              },
            },
            {
              node: {
                name: "sale 2",
                href: "/sale-2-href",
                internalID: "sale-2-id",
                slug: "sale-2-slug",
                liveURLIfOpen: null,
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText("sale 2"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedAuctionGroup",
            "context_module": "home-view-section-sales",
            "context_screen_owner_id": undefined,
            "context_screen_owner_slug": undefined,
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "sale-2-id",
            "destination_screen_owner_slug": "sale-2-slug",
            "destination_screen_owner_type": "sale",
            "horizontal_slide_position": 1,
            "module_height": "double",
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/sale-2-href")
  })
})
