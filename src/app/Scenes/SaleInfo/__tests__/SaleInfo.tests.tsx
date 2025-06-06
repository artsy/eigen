import { screen } from "@testing-library/react-native"
import { SaleInfoTestsQuery } from "__generated__/SaleInfoTestsQuery.graphql"
import { RegisterToBidButton } from "app/Scenes/Sale/Components/RegisterToBidButton"
import { SaleInfoContainer, tests } from "app/Scenes/SaleInfo/SaleInfo"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SaleInfo", () => {
  const { renderWithRelay } = setupTestWrapper<SaleInfoTestsQuery>({
    Component: ({ sale, me }) => <SaleInfoContainer sale={sale} me={me} />,
    query: graphql`
      query SaleInfoTestsQuery($saleID: String!) @relay_test_operation {
        sale(id: $saleID) {
          ...SaleInfo_sale
        }
        me {
          ...SaleInfo_me
        }
      }
    `,
    variables: { saleID: "sale-id" },
  })

  it("shows register to bid button", () => {
    renderWithRelay({
      Sale: () => mockSale,
    })

    expect(screen.UNSAFE_getAllByType(RegisterToBidButton)).toBeTruthy()
  })

  it("hides register to bid button if auction is over", () => {
    renderWithRelay({
      Sale: () => ({
        ...mockSale,
        startAt: "2022-09-01T15:00:00",
        endAt: "2024-09-01T15:00:00",
      }),
    })

    expect(screen.queryByTestId("register-to-bid-button")).toBeFalsy()
  })

  it("shows Auction is live View shows up when an auction is live", () => {
    renderWithRelay({
      Sale: () => liveMockSale,
    })

    expect(screen.UNSAFE_queryAllByType(tests.AuctionIsLive)).toHaveLength(1)
  })

  it("doesn't show Auction is live view when an auction is not live", () => {
    renderWithRelay({
      Sale: () => mockSale,
    })

    expect(screen.UNSAFE_queryAllByType(tests.AuctionIsLive)).toHaveLength(0)
  })

  it("shows the buyers premium correctly for a single percentage", () => {
    renderWithRelay({
      Sale: () => mockSale,
    })

    expect(screen.getByText("20% on the hammer price")).toBeTruthy()
  })

  it("shows the buyers premium correctly for range of percentages", () => {
    renderWithRelay({
      Sale: () => ({
        ...mockSale,
        isWithBuyersPremium: true,
        buyersPremium: [
          {
            amount: "$0",
            percent: 0.25,
          },
          {
            amount: "$150,000",
            percent: 0.2,
          },
          {
            amount: "$3,000,000",
            percent: 0.12,
          },
        ],
      }),
    })

    expect(screen.getByText("On the hammer price up to and including $150,000: 25%")).toBeTruthy()
    expect(
      screen.getByText(
        "On the hammer price in excess of $150,000 up to and including $3,000,000: 20%"
      )
    ).toBeTruthy()
    expect(
      screen.getByText("On the portion of the hammer price in excess of $3,000,000: 12%")
    ).toBeTruthy()
  })
})

const mockSale = {
  slug: "the-sale",
  name: "sale name",
  internalID: "the-sale-internal",
  description: "sale description",
  endAt: "2034-08-01T15:00:00",
  liveStartAt: null,
  startAt: "2026-09-01T15:00:00",
  timeZone: "Europe/Berlin",
  requireIdentityVerification: false,
  isWithBuyersPremium: true,
  buyersPremium: [{ amount: "CHF0", percent: 0.2 }],
}

const liveMockSale = {
  ...mockSale,
  liveStartAt: "2026-10-01T15:00:00",
}
