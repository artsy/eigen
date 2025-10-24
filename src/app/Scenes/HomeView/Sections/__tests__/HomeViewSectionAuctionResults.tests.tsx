import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionAuctionResultsTestsQuery } from "__generated__/HomeViewSectionAuctionResultsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionAuctionResults } from "app/Scenes/HomeView/Sections/HomeViewSectionAuctionResults"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionAuctionResults", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionAuctionResultsTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionAuctionResults section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionAuctionResultsTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-auction-results") {
            ... on HomeViewSectionAuctionResults {
              ...HomeViewSectionAuctionResults_section
            }
          }
        }
      }
    `,
  })

  it("renders nothing when there are no auction results", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Auction Results for Artists You Follow",
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
      HomeViewSectionAuctionResults: () => ({
        internalID: "home-view-section-latest-auction-results",
        component: {
          title: "Auction Results for Artists You Follow",
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

    expect(screen.getByText("Auction Results for Artists You Follow")).toBeOnTheScreen()
    expect(screen.getByText(/Auction result 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Auction result 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Auction result 2/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedAuctionResultGroup",
            "context_module": "<mock-value-for-field-"contextModule">",
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

  it("navigates to requested `href` destination when the user taps the 'View All' button", () => {
    renderWithRelay({
      HomeViewSectionAuctionResults: () => ({
        internalID: "home-view-section-latest-auction-results",
        component: {
          title: "Auction Results for Artists You Follow",
          href: "/auction-results-for-artists-you-follow-href",
          behaviors: {
            viewAll: {
              buttonText: "View All",
              href: "/example-href",
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

    expect(navigate).toHaveBeenCalledWith("/example-href")
  })
})
