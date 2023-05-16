import { DecreaseIcon, IncreaseIcon } from "@artsy/palette-mobile"
import { MarketStatsTestsQuery } from "__generated__/MarketStatsTestsQuery.graphql"
import { MarketStats_priceInsightsConnection$data } from "__generated__/MarketStats_priceInsightsConnection.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { extractText } from "app/utils/tests/extractText"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { QueryRenderer, graphql } from "react-relay"
import { ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { MarketStatsFragmentContainer } from "./MarketStats"

describe("MarketStats", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (environment = createMockEnvironment()))

  const TestWrapper = () => {
    return (
      <QueryRenderer<MarketStatsTestsQuery>
        environment={environment}
        query={graphql`
          query MarketStatsTestsQuery @relay_test_operation {
            priceInsightsConnection: priceInsights(
              artistId: "some-id"
              sort: ANNUAL_VALUE_SOLD_CENTS_DESC
            ) {
              ...MarketStats_priceInsightsConnection
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.priceInsightsConnection) {
            return (
              <MarketStatsFragmentContainer
                priceInsightsConnection={props.priceInsightsConnection}
              />
            )
          }
          return null
        }}
      />
    )
  }

  it("renders market stats", () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />).root
    resolveMostRecentRelayOperation(environment)
    expect(tree.findAllByType(MarketStatsFragmentContainer).length).toEqual(1)
  })

  describe("available mediums", () => {
    let tree: ReactTestInstance
    beforeEach(() => {
      tree = renderWithWrappersLEGACY(<TestWrapper />).root
      const priceInsights = {
        edges: [
          { node: { medium: "crayon", annualLotsSold: 123 } },
          { node: { medium: "fingerpaint", annualLotsSold: 456 } },
        ],
      }

      resolveMostRecentRelayOperation(environment, {
        PriceInsightConnection: () => priceInsights,
      })
    })

    it("shows data for first medium", () => {
      expect(extractText(tree.findByProps({ testID: "annualLotsSold" }))).toEqual("123")
    })

    it("shows data for other mediums when selected", () => {
      tree.findByProps({ title: "Select medium" }).props.onSelectValue("fingerpaint")

      expect(extractText(tree.findByProps({ testID: "annualLotsSold" }))).toEqual("456")
    })
  })

  describe("median sale over estimate icons", () => {
    function renderWithOnePriceInsightNode(
      nodeSpecs: Partial<
        NonNullable<NonNullable<MarketStats_priceInsightsConnection$data["edges"]>[0]>["node"]
      >
    ) {
      const tree = renderWithWrappersLEGACY(<TestWrapper />).root
      const priceInsights = {
        edges: [
          {
            node: {
              ...nodeSpecs,
            },
          },
        ],
      }

      resolveMostRecentRelayOperation(environment, {
        PriceInsightConnection: () => priceInsights,
      })

      return tree
    }

    it("displays down arrow when percentage is negative", () => {
      const tree = renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: -10,
      })

      expect(tree.findByType(DecreaseIcon)).toBeDefined()
    })

    it("displays no arrow when percentage is 0", () => {
      const tree = renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: 0,
      })

      expect(tree.findAllByType(DecreaseIcon).length).toEqual(0)
      expect(tree.findAllByType(IncreaseIcon).length).toEqual(0)
    })

    it("displays up arrow when percentage is positive", () => {
      const tree = renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: 10,
      })

      expect(tree.findByType(IncreaseIcon)).toBeDefined()
    })
  })

  describe("tracking", () => {
    it("tracks the correct event when info bubble is tapped", () => {
      const tree = renderWithWrappersLEGACY(<TestWrapper />).root
      resolveMostRecentRelayOperation(environment)

      const infoBubble = tree.findByType(InfoButton)
      infoBubble.props.trackEvent()

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedInfoBubble",
        context_module: "auctionResults",
        context_screen_owner_type: "artistAuctionResults",
        context_screen_owner_id: undefined,
        context_screen_owner_slug: undefined,
        subject: "artistMarketStatistics",
      })
    })
  })
})
