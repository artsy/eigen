import { AuctionResultsScreenWrapperTestsQuery } from "__generated__/AuctionResultsScreenWrapperTestsQuery.graphql"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import {
  AuctionResultsScreenWrapperContainer,
  AuctionResultsState,
} from "./AuctionResultsScreenWrapper"

jest.unmock("react-relay")

describe("AuctionResultsForArtistsYouFollowContainer", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<AuctionResultsScreenWrapperTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query AuctionResultsScreenWrapperTestsQuery($first: Int!, $after: String)
        @relay_test_operation {
          me {
            ...AuctionResultsScreenWrapper_me @arguments(first: $first, after: $after)
          }
        }
      `}
      variables={{ after: "YXJyYXljb25uZWN0aW9uOjA", first: 3 }}
      render={({ props }) => {
        if (props?.me) {
          return (
            <AuctionResultsScreenWrapperContainer me={props.me} state={AuctionResultsState.ALL} />
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders list of auction results for artists you follow", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        id: "test-id",
        auctionResultsByFollowedArtists: {
          totalCount: 1,
          edges: [auctionResultEdge],
        },
      }),
    })

    expect(extractText(tree.root.findAllByType(AuctionResultsScreenWrapperContainer)[0])).toContain(
      "Latest Auction Results"
    )
    expect(tree.root.findAllByType(AuctionResultsScreenWrapperContainer)).toHaveLength(1)
  })
})

const auctionResultEdge = {
  node: {
    artistID: "4d8b92bb4eb68a1b2c000452",
    internalID: "333952",
    title: "Enso: The Sound of the Bell of Paired Sal Trees",
    currency: "HKD",
    dateText: "2015",
    mediumText: "acrylic on canvas mounted on aluminum frame",
    saleDate: "2021-06-01",
    organization: "Phillips",
    boughtIn: false,
    priceRealized: {
      cents: 315000000,
      display: "HK$3,150,000",
    },
    performance: {
      mid: "70%",
    },
    images: {
      thumbnail: {
        url: "https://d2v80f5yrouhh2.cloudfront.net/OTJxNHuhGDnPi8wQcvXvxA/thumbnail.jpg",
      },
    },
  },
}
