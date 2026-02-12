import { screen } from "@testing-library/react-native"
import { AuctionResultsScreenWrapperTestsQuery } from "__generated__/AuctionResultsScreenWrapperTestsQuery.graphql"
import { AuctionResultsScreenWrapperContainer } from "app/Scenes/AuctionResults/AuctionResultsScreenWrapper"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("AuctionResultsForArtistsYouFollowContainer", () => {
  const { renderWithRelay } = setupTestWrapper<AuctionResultsScreenWrapperTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <AuctionResultsScreenWrapperContainer me={props.me} />
      }
      return null
    },
    variables: { after: "YXJyYXljb25uZWN0aW9uOjA", first: 3 },
    query: graphql`
      query AuctionResultsScreenWrapperTestsQuery($first: Int!, $after: String)
      @relay_test_operation {
        me {
          ...AuctionResultsScreenWrapper_me @arguments(first: $first, after: $after)
        }
      }
    `,
  })

  it("Renders list of auction results for artists you follow", () => {
    renderWithRelay({
      Me: () => ({
        id: "test-id",
        auctionResultsByFollowedArtists: {
          totalCount: 1,
          edges: [auctionResultEdge],
        },
      }),
    })

    expect(screen.getAllByText("See auction results for the artists you follow")).toBeTruthy()
    expect(screen.getByTestId("Results_Section_List")).toBeTruthy()
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
