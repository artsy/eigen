import { DecreaseIcon, IncreaseIcon } from "@artsy/palette-mobile"
import { MarketStats_priceInsightsConnection$data } from "__generated__/MarketStats_priceInsightsConnection.graphql"
import {
  MarketStatsFragmentContainer,
  MarketStatsQueryRenderer,
} from "app/Components/Artist/ArtistInsights/MarketStats"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { extractText } from "app/utils/tests/extractText"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Environment } from "react-relay"
import { ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe("MarketStats", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (environment = createMockEnvironment()))

  const TestWrapper = () => {
    return (
      <MarketStatsQueryRenderer
        artistInternalID="some-id"
        environment={environment as unknown as Environment}
      />
    )
  }

  it("renders market stats", () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />).root
    resolveMostRecentRelayOperation(environment)
    // eslint-disable-next-line testing-library/await-async-queries
    expect(tree.findAllByType(MarketStatsFragmentContainer).length).toEqual(1)
  })

  describe("available mediums", () => {
    let tree: ReactTestInstance
    beforeEach(() => {
      // eslint-disable-next-line testing-library/no-render-in-lifecycle
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
      // eslint-disable-next-line testing-library/await-async-queries
      expect(extractText(tree.findByProps({ testID: "annualLotsSold" }))).toEqual("123")
    })

    it("shows data for other mediums when selected", () => {
      // eslint-disable-next-line testing-library/await-async-queries
      tree.findByProps({ testID: "select-medium" }).props.onSelectValue("fingerpaint")

      // eslint-disable-next-line testing-library/await-async-queries
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
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const tree = renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: -10,
      })

      // eslint-disable-next-line testing-library/await-async-queries
      expect(tree.findByType(DecreaseIcon)).toBeDefined()
    })

    it("displays no arrow when percentage is 0", () => {
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const tree = renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: 0,
      })

      // eslint-disable-next-line testing-library/await-async-queries
      expect(tree.findAllByType(DecreaseIcon).length).toEqual(0)
      // eslint-disable-next-line testing-library/await-async-queries
      expect(tree.findAllByType(IncreaseIcon).length).toEqual(0)
    })

    it("displays up arrow when percentage is positive", () => {
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const tree = renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: 10,
      })

      // eslint-disable-next-line testing-library/await-async-queries
      expect(tree.findByType(IncreaseIcon)).toBeDefined()
    })
  })

  describe("tracking", () => {
    it("tracks the correct event when info bubble is tapped", () => {
      const tree = renderWithWrappersLEGACY(<TestWrapper />).root
      resolveMostRecentRelayOperation(environment)

      // eslint-disable-next-line testing-library/await-async-queries
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
