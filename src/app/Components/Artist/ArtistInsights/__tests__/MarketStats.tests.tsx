import { fireEvent, screen } from "@testing-library/react-native"
import { MarketStats_priceInsightsConnection$data } from "__generated__/MarketStats_priceInsightsConnection.graphql"
import { MarketStatsQueryRenderer } from "app/Components/Artist/ArtistInsights/MarketStats"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Environment } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("@artsy/icons/native", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("@artsy/icons/native"),
    ArrowDownIcon: () => <View testID="arrow-down-icon" />,
    ArrowUpIcon: () => <View testID="arrow-up-icon" />,
  }
})

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

  it("renders market stats", async () => {
    await renderWithWrappers(<TestWrapper />)
    await resolveMostRecentRelayOperation(environment)

    expect(screen.getByText("Market Signals")).toBeOnTheScreen()
    expect(screen.getByTestId("annualLotsSold")).toBeOnTheScreen()
  })

  describe("available mediums", () => {
    beforeEach(async () => {
      // eslint-disable-next-line testing-library/no-render-in-lifecycle
      await renderWithWrappers(<TestWrapper />)

      const priceInsights = {
        edges: [
          { node: { medium: "crayon", annualLotsSold: 123 } },
          { node: { medium: "fingerpaint", annualLotsSold: 456 } },
        ],
      }
      await resolveMostRecentRelayOperation(environment, {
        PriceInsightConnection: () => priceInsights,
      })
    })

    it("shows data for first medium", () => {
      expect(screen.getByTestId("annualLotsSold")).toHaveTextContent("123")
    })

    it("shows data for other mediums when selected", async () => {
      await fireEvent.press(screen.getByTestId("select-medium"))
      await fireEvent.press(await screen.findByText("fingerpaint"))

      expect(screen.getByTestId("annualLotsSold")).toHaveTextContent("456")
    })
  })

  describe("median sale over estimate icons", () => {
    async function renderWithOnePriceInsightNode(
      nodeSpecs: Partial<
        NonNullable<NonNullable<MarketStats_priceInsightsConnection$data["edges"]>[0]>["node"]
      >
    ) {
      await renderWithWrappers(<TestWrapper />)
      const priceInsights = {
        edges: [
          {
            node: {
              ...nodeSpecs,
            },
          },
        ],
      }

      await resolveMostRecentRelayOperation(environment, {
        PriceInsightConnection: () => priceInsights,
      })
    }

    it("displays down arrow when percentage is negative", async () => {
      await renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: -10,
      })

      expect(screen.getByTestId("arrow-down-icon")).toBeOnTheScreen()
    })

    it("displays no arrow when percentage is 0", async () => {
      await renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: 0,
      })

      expect(screen.queryByTestId("arrow-down-icon")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("arrow-up-icon")).not.toBeOnTheScreen()
    })

    it("displays up arrow when percentage is positive", async () => {
      await renderWithOnePriceInsightNode({
        medianSaleOverEstimatePercentage: 10,
      })

      expect(screen.getByTestId("arrow-up-icon")).toBeOnTheScreen()
    })
  })

  describe("tracking", () => {
    it("tracks the correct event when info bubble is tapped", async () => {
      await renderWithWrappers(<TestWrapper />)
      await resolveMostRecentRelayOperation(environment)

      await fireEvent.press(screen.getByText("Market Signals"))

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
