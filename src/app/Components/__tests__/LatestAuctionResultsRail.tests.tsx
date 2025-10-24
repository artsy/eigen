import { screen } from "@testing-library/react-native"
import { LatestAuctionResultsRailTestsQuery } from "__generated__/LatestAuctionResultsRailTestsQuery.graphql"
import { LatestAuctionResultsRail } from "app/Components/LatestAuctionResultsRail"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("LatestAuctionResultsRail", () => {
  const { renderWithRelay } = setupTestWrapper<LatestAuctionResultsRailTestsQuery>({
    Component: ({ me }) => {
      if (!me) {
        return null
      }
      return <LatestAuctionResultsRail me={me} />
    },
    query: graphql`
      query LatestAuctionResultsRailTestsQuery @relay_test_operation {
        me {
          ...LatestAuctionResultsRail_me
        }
      }
    `,
  })

  it("renders the rail of auction results ", async () => {
    renderWithRelay({ Me: () => mockMe })

    expect(screen.getByText("Auction Results for Artists You Follow")).toBeTruthy()
    expect(screen.getByText("Artist Name")).toBeTruthy()
    expect(screen.getByText("Artist Name 1")).toBeTruthy()
  })

  it("returns null if there are no auction results", async () => {
    const { toJSON } = renderWithRelay({ Me: () => emptyMe })

    expect(toJSON()).toBeNull()
  })
})

const emptyMe = {
  auctionResultsByFollowedArtists: {
    first: 10,
    edges: [],
  },
}

const mockMe = {
  auctionResultsByFollowedArtists: {
    first: 10,
    edges: [
      {
        node: {
          id: "an-id",
          artist: {
            name: "Artist Name",
          },
        },
      },
      {
        node: {
          id: "another-id",
          artist: {
            name: "Artist Name 1",
          },
        },
      },
    ],
  },
}
