import { AuctionResultTestsQuery } from "__generated__/AuctionResultTestsQuery.graphql"
import { AuctionResultsMidEstimate } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Image, ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { AuctionResultFragmentContainer } from "./AuctionResult"

jest.unmock("react-relay")

describe("AuctionResult", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<AuctionResultTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query AuctionResultTestsQuery($auctionResultInternalID: String!, $artistID: String!)
        @relay_test_operation {
          auctionResult(id: $auctionResultInternalID) {
            ...AuctionResult_auctionResult
          }
          artist(id: $artistID) {
            ...AuctionResult_artist
          }
        }
      `}
      variables={{ artistID: "artist-id", auctionResultInternalID: "auction-result-id" }}
      render={({ props }) => {
        if (props?.artist && props?.auctionResult) {
          return (
            <AuctionResultFragmentContainer
              artist={props.artist}
              auctionResult={props.auctionResult}
            />
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    const getSizeMock = jest.spyOn(Image, "getSize")
    getSizeMock.mockImplementation(() => {
      /* do nothing */
    })
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  describe("Auction Result screen renders", () => {
    let tree: ReactTestRenderer
    beforeEach(() => {
      tree = getWrapper()
    })

    it("renders without throwing an error", () => {
      expect(tree.root.findByType(ScrollView)).toBeDefined()
    })

    it("renders with a StickyScrollHeader", () => {
      expect(tree.root.findAllByType(FancyModalHeader)).toHaveLength(2)
    })
  })

  describe("Auction Result is not empty", () => {
    it("show the mid-estimate", () => {
      const tree = renderWithWrappers(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          AuctionResult: () => mockAuctionResult,
        })
      )
      expect(tree.root.findAllByType(AuctionResultsMidEstimate)[0].props.value).toEqual("262%")
      expect(tree.root.findAllByType(AuctionResultsMidEstimate)[0].props.shortDescription).toEqual(
        "mid-estimate"
      )
    })

    it("shows the correct sale date", () => {
      const tree = renderWithWrappers(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          AuctionResult: () => mockAuctionResult,
        })
      )
      expect(extractText(tree.root.findByProps({ testID: "saleDate" }))).toContain("Nov 18, 2021")
    })

    it("have comparable works", () => {
      const tree = renderWithWrappers(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          AuctionResult: () => mockAuctionResult,
        })
      )
      expect(tree.root.findAllByType(AuctionResultListItemFragmentContainer)).toHaveLength(3)
    })
  })

  const getZeroStateWrapper = () =>
    getWrapper({
      AuctionResult: () => ({
        boughtIn: true,
        priceRealized: {
          display: null,
          cents: 0,
        },
      }),
    })

  describe("Auction Result Bought in is empty", () => {
    let tree: ReactTestRenderer

    beforeEach(() => {
      tree = getZeroStateWrapper()
    })

    it("shows if a lot was bought in", () => {
      expect(extractText(tree.root)).toContain("Bought in")
      expect(tree.root.findAllByProps({ testID: "ratio" })).toHaveLength(0)
    })
  })
})

const mockAuctionResult = {
  artistID: "4d8b92854eb68a1b2c0001b8",
  boughtIn: false,
  categoryText: "Print",
  currency: "USD",
  dateText: "1991",
  dimensionText: "120.3 x 97.5 cm",
  dimensions: { height: 97.5, width: 120.3 },
  estimate: { display: "US$6,000–US$8,000", high: 800000, low: 600000 },
  id: "QXVjdGlvblJlc3VsdDozNjczMTA=",
  images: {
    url: "https://d2v80f5yrouhh2.cloudfront.net/jOY5pInrbAcIM1AktoVdvg/thumbnail.jpg",
    height: null,
    width: null,
    aspectRatio: 1,
  },
  internalID: "367310",
  location: null,
  mediumText: "Aquatint in colors, on Fabriano paper",
  organization: "Bonhams",
  performance: { mid: "262%" },
  priceRealized: {
    cents: 2531200,
    centsUSD: 2531200,
    display: "US$25,312",
    displayUSD: "US$25,312",
  },
  saleDate: "2021-11-18T01:00:00+01:00",
  saleTitle: "Sam Francis Prints: California Cool",
  title: "Trietto 5 (SFE-078RC)",
  comparableAuctionResults: {
    totalCount: 7,
    edges: [
      {
        node: {
          id: "QXVjdGlvblJlc3VsdDo1NjY4MjYw",
          artist: {
            name: "comparable-work-1",
          },
        },
      },
      {
        node: {
          id: "QXVjdGlvblJlc3VsdDo2NDEyODAw",
          artist: {
            name: "comparable-work-2",
          },
        },
      },
      {
        node: {
          id: "QXVjdGlvblJlc3VsdDozNjAxNTQ=",
          artist: {
            name: "comparable-work-3",
          },
        },
      },
    ],
  },
  artist: {
    href: "/artist/sam-francis",
    name: "Sam Francis",
  },
}
