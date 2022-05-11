import { MyCollectionInsightsTestsQuery } from "__generated__/MyCollectionInsightsTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { useLazyLoadQuery } from "react-relay"
import { act } from "react-test-renderer"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { AuctionResultsForArtistsYouCollect } from "./AuctionResultsForArtistsYouCollect"

jest.unmock("react-relay")

describe("MyCollectionInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    __globalStoreTestUtils__?.injectFeatureFlags({ ARShowMyCollectionInsights: true })
  })
  const TestRenderer: React.FC = () => {
    const queryData = useLazyLoadQuery<MyCollectionInsightsTestsQuery>(
      graphql`
        query MyCollectionInsightsTestsQuery @raw_response_type {
          me {
            ...AuctionResultsForArtistsYouCollect_me
          }
        }
      `,
      {}
    )
    return (
      <StickyTabPage
        tabs={[
          {
            title: "test",
            content: <AuctionResultsForArtistsYouCollect auctionResults={queryData.me!} />,
          },
        ]}
      />
    )
  }
  const getWrapper = async () => {
    const tree = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        errors: [],
        data: { me: mockData },
      })
    })

    await flushPromiseQueue()

    return tree
  }

  it("displayes the Auction Results section", async () => {
    const { queryByText } = await getWrapper()

    expect(queryByText("Auction Results")).toBeTruthy()
  })
})

const mockData = {
  myCollectionAuctionResults: {
    totalCount: 1,
    edges: [
      {
        node: {
          id: "QXVjdGlvblJlc3VsdDozMzM5NTI=",
          internalID: "333952",
          artistID: "4d8b92bb4eb68a1b2c000452",
          currency: "HKD",
          dateText: "2015",
          artist: {
            name: "Takashi Murakami",
          },
          images: {
            thumbnail: {
              url: "https://d2v80f5yrouhh2.cloudfront.net/OTJxNHuhGDnPi8wQcvXvxA/thumbnail.jpg",
              height: 120,
              width: 120,
              aspectRatio: 1,
            },
          },
          estimate: {
            low: 123,
          },
          mediumText: "acrylic on canvas mounted on aluminum frame",
          organization: "Phillips",
          boughtIn: false,
          performance: {
            mid: "70%",
          },
          priceRealized: {
            cents: 315000000,
            display: "HK$3,150,000",
            displayUSD: "$30,000",
          },
          saleDate: "2021-06-01T03:00:00+03:00",
          title: "A Comparable Auction Result",
        },
      },
    ],
  },
}
