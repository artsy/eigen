import { MyCollectionInsightsTestsQuery } from "__generated__/MyCollectionInsightsTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionInsightsContainer } from "./MyCollectionInsights"

jest.unmock("react-relay")

describe("MyCollectionInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARShowMyCollectionInsights: true })
  })
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionInsightsTestsQuery @relay_test_operation {
          me {
            ...MyCollectionInsights_me
          }
        }
      `}
      variables={{}}
      cacheConfig={{ force: true }}
      render={({ props }) => {
        if (props?.me) {
          return (
            <StickyTabPage
              tabs={[
                {
                  title: "test",
                  content: <MyCollectionInsightsContainer me={props.me} />,
                },
              ]}
            />
          )
        } else {
          return null
        }
      }}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("container renders without throwing an error", () => {
    renderWithWrappersTL(<TestRenderer />)
  })

  it("displayes the Auction Results section", async () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => mockData,
    })
    expect(await getByText("Auction Results")).toBeTruthy()
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
