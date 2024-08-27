import { fireEvent, screen } from "@testing-library/react-native"
import { AuctionResultsRailHomeViewSectionTestsQuery } from "__generated__/AuctionResultsRailHomeViewSectionTestsQuery.graphql"
import { AuctionResultsRailHomeViewSection } from "app/Scenes/HomeView/Sections/AuctionResultsRailHomeViewSection"
import { navigate } from "app/system/navigation/navigate"
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
      HomeViewComponent: () => ({
        title: "Latest Auction Results",
        href: "/auction-results-for-artists-you-follow",
      }),
      AuctionResultConnection: () => ({
        edges: [
          {
            node: {
              title: "Auction result 1",
            },
          },
          {
            node: {
              title: "Auction result 2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Latest Auction Results")).toBeOnTheScreen()
    expect(screen.getByText(/Auction result 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Auction result 2/)).toBeOnTheScreen()

    expect(screen.getByText("Browse All Results")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("Browse All Results"))

    expect(navigate).toHaveBeenCalledWith("/auction-results-for-artists-you-follow")
  })
})
