import { MarketStats_priceInsightsConnection } from "__generated__/MarketStats_priceInsightsConnection.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { extractText } from "app/tests/extractText"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { DecreaseIcon, IncreaseIcon } from "palette"
import React from "react"
import { ReactTestInstance } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { MarketStatsFragmentContainer, MarketStatsQueryRenderer } from "./MarketStats"

jest.unmock("react-relay")

const trackEvent = useTracking().trackEvent

describe("MarketStats", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (environment = createMockEnvironment()))

  const TestWrapper = () => {
    return <MarketStatsQueryRenderer artistInternalID="some-id" environment={environment} />
  }

  it("renders market stats", () => {
    const tree = renderWithWrappers(<TestWrapper />).root
    mockEnvironmentPayload(environment)
    expect(tree.findAllByType(MarketStatsFragmentContainer).length).toEqual(1)
  })

  describe("available mediums", () => {
    let tree: ReactTestInstance
    beforeEach(() => {
      tree = renderWithWrappers(<TestWrapper />).root
      const priceInsights = {
        edges: [
          { node: { medium: "crayon", annualLotsSold: 123 } },
          { node: { medium: "fingerpaint", annualLotsSold: 456 } },
        ],
      }

      mockEnvironmentPayload(environment, {
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
        NonNullable<NonNullable<MarketStats_priceInsightsConnection["edges"]>[0]>["node"]
      >
    ) {
      const tree = renderWithWrappers(<TestWrapper />).root
      const priceInsights = {
        edges: [
          {
            node: {
              ...nodeSpecs,
            },
          },
        ],
      }

      mockEnvironmentPayload(environment, {
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
      const tree = renderWithWrappers(<TestWrapper />).root
      mockEnvironmentPayload(environment)

      const infoBubble = tree.findByType(InfoButton)
      infoBubble.props.trackEvent()

      expect(trackEvent).toHaveBeenCalledWith({
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
