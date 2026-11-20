import { screen } from "@testing-library/react-native"
import { AuctionBuyersPremiumQueryRenderer } from "app/Scenes/AuctionBuyersPremium/AuctionBuyersPremium"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

describe("AuctionBuyersPremium", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  const TestRenderer = () => {
    return <AuctionBuyersPremiumQueryRenderer saleID="saleID" />
  }

  describe("one point", () => {
    it("renders the schedule correctly", async () => {
      await renderWithWrappers(<TestRenderer />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => ({
          buyersPremium: [{ amount: "$0", cents: 0, percent: 0.2 }],
        }),
      })

      expect(screen.getByText("20% on the hammer price")).toBeTruthy()
    })
  })

  describe("two points", () => {
    it("renders the schedule correctly", async () => {
      await renderWithWrappers(<TestRenderer />)
      const textOne = "On the hammer price up to and including $500,000: 25%"
      const textTwo = "On the portion of the hammer price in excess of $500,000: 20%"

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => ({
          buyersPremium: [
            { amount: "$0", cents: 0, percent: 0.25 },
            { amount: "$500,000", cents: 50000000, percent: 0.2 },
          ],
        }),
      })

      expect(screen.getByText(textOne)).toBeTruthy()
      expect(screen.getByText(textTwo)).toBeTruthy()
    })
  })

  describe("three or more points", () => {
    it("renders the schedule correctly", async () => {
      await renderWithWrappers(<TestRenderer />)
      const textOne = "On the hammer price up to and including $250,000: 25%"
      const textTwo =
        "On the hammer price in excess of $250,000 up to and including $2,500,000: 20%"
      const textThree = "On the portion of the hammer price in excess of $2,500,000: 12%"

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => ({
          buyersPremium: [
            { amount: "$0", cents: 0, percent: 0.25 },
            { amount: "$250,000", cents: 25000000, percent: 0.2 },
            { amount: "$2,500,000", cents: 250000000, percent: 0.12 },
          ],
        }),
      })

      expect(screen.getByText(textOne)).toBeTruthy()
      expect(screen.getByText(textTwo)).toBeTruthy()
      expect(screen.getByText(textThree)).toBeTruthy()
    })

    describe("with a percentage that isn't a whole number", () => {
      it("rounds to a single decimal place", async () => {
        await renderWithWrappers(<TestRenderer />)

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Sale: () => ({
            buyersPremium: [{ amount: "$0", cents: 0, percent: 0.225 }],
          }),
        })

        expect(screen.getByText("22.5% on the hammer price")).toBeTruthy()
      })
    })
  })
})
