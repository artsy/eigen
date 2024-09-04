import { fireEvent, screen } from "@testing-library/react-native"
import { AuctionResultsRailHomeViewSectionTestsQuery } from "__generated__/AuctionResultsRailHomeViewSectionTestsQuery.graphql"
import { AuctionResultsRailHomeViewSection } from "app/Scenes/HomeView/Sections/AuctionResultsRailHomeViewSection"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("AuctionResultsRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<AuctionResultsRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <AuctionResultsRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query AuctionResultsRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-auction-results") {
            ... on AuctionResultsRailHomeViewSection {
              ...AuctionResultsRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders nothing when there are no auction results", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Latest Auction Results",
        href: "/auction-results-for-artists-you-follow",
      }),
      AuctionResultConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of auction results", () => {
    renderWithRelay({
      AuctionResultsRailHomeViewSection: () => ({
        internalID: "home-view-section-latest-auction-results",
        component: {
          title: "Latest Auction Results",
          href: "/auction-results-for-artists-you-follow-href",
        },
        auctionResultsConnection: {
          edges: [
            {
              node: {
                internalID: "auction-result-1-id",
                slug: "auction-result-1-slug",
                title: "Auction result 1",
                artistID: "artist-1",
              },
            },
            {
              node: {
                internalID: "auction-result-2-id",
                slug: "auction-result-2-slug",
                title: "Auction result 2",
                artistID: "artist-2",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Latest Auction Results")).toBeOnTheScreen()
    expect(screen.getByText(/Auction result 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Auction result 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Auction result 2/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedAuctionResultGroup",
            "context_module": "home-view-section-latest-auction-results",
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "auction-result-2-id",
            "destination_screen_owner_slug": "auction-result-2-slug",
            "destination_screen_owner_type": "auctionResult",
            "horizontal_slide_position": 1,
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/artist/artist-2/auction-result/auction-result-2-id")
  })

  it("navigates to ViewAll when the user taps the 'View All' button", () => {
    renderWithRelay({
      AuctionResultsRailHomeViewSection: () => ({
        internalID: "home-view-section-latest-auction-results",
        component: {
          title: "Latest Auction Results",
          href: "/auction-results-for-artists-you-follow-href",
          behaviors: {
            viewAll: {
              buttonText: "View All",
              href: "/auction-results-for-artists-you-follow-view-all-href",
            },
          },
          auctionResultsConnection: {
            edges: [
              {
                node: {
                  title: "Auction result 1",
                },
              },
            ],
          },
        },
      }),
    })

    expect(screen.getByText("View All")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("View All"))

    expect(navigate).toHaveBeenCalledWith("/auction-results-for-artists-you-follow-view-all-href")
  })
})
