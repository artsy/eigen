import { screen } from "@testing-library/react-native"
import { MyBidsTestsQuery } from "__generated__/MyBidsTestsQuery.graphql"
import { MyBidsContainer } from "app/Scenes/MyBids/MyBids"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("My Bids", () => {
  const { renderWithRelay } = setupTestWrapper<MyBidsTestsQuery>({
    Component: (props) => <MyBidsContainer isActiveTab me={props.me!} />,
    query: graphql`
      query MyBidsTestsQuery @relay_test_operation {
        me {
          ...MyBids_me
        }
      }
    `,
  })

  it("renders a lot standing from a closed sale in the closed section", () => {
    renderWithRelay({
      Me: () => ({
        myBids: {
          closed: [
            {
              sale: mockClosedSale,
              saleArtworks: [
                {
                  isHighestBidder: true,
                  internalID: "saleartworks1",
                  lotState: { soldStatus: "Passed" },
                  sale: mockClosedSale,
                  artwork: { artistNames: "Artists" },
                },
              ],
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Artists")).toBeOnTheScreen()
    expect(screen.getByText("Passed")).toBeOnTheScreen()
    expect(screen.getByText("Closed Aug 13")).toBeOnTheScreen()
  })

  it("renders a completed lot in an ongoing live sale in the 'active' section", () => {
    renderWithRelay({
      Me: () => ({
        myBids: {
          active: [
            {
              sale: mockActiveSale,
              saleArtworks: [
                {
                  internalID: "saleartworks1",
                  lotState: { soldStatus: "Passed", reserveStatus: "ReserveNotMet" },
                  sale: mockActiveSale,
                  artwork: { artistNames: "Artists" },
                },
              ],
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Artists")).toBeOnTheScreen()
    expect(screen.getByText("Passed")).toBeOnTheScreen()
  })

  it("renders the empty state when there are no lots to show", () => {
    renderWithRelay({ Me: () => ({ myBids: { active: [], closed: [] } }) })

    expect(screen.getByText("Discover works for you at auction.")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Browse and bid in auctions around the world, from online-only sales to benefit auctions—all in the Artsy app."
      )
    ).toBeOnTheScreen()
  })

  it("renders no bids message on a registered sale", () => {
    renderWithRelay({ Me: () => ({ myBids: { active: [{ saleArtworks: [] }] } }) })

    expect(screen.getByText("You haven't placed any bids on this sale")).toBeOnTheScreen()
  })
})

const mockClosedSale = {
  internalID: "sale1",
  endAt: "2020-08-13T16:00:00+00:00",
  timeZone: "America/New_York",
  status: "closed",
  liveStartAt: "2020-08-10T16:00:00+00:00",
}

const mockActiveSale = {
  internalID: "sale-id",
  status: "open",
  liveStartAt: "2020-08-13T16:00:00+00:00",
}
