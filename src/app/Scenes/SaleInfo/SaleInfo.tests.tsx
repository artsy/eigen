import { SaleInfoTestsQuery } from "__generated__/SaleInfoTestsQuery.graphql"
import { RegisterToBidButtonContainer } from "app/Scenes/Sale/Components/RegisterToBidButton"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SaleInfoContainer, tests } from "./SaleInfo"

jest.unmock("react-relay")

describe("SaleInfo", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SaleInfoTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleInfoTestsQuery($saleID: String!) @relay_test_operation {
          sale(id: $saleID) {
            ...SaleInfo_sale
          }
          me {
            ...SaleInfo_me
          }
        }
      `}
      variables={{ saleID: "sale-id" }}
      render={({ props }) => {
        if (props?.sale && props?.me) {
          return <SaleInfoContainer sale={props.sale} me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("shows register to bid button", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => mockSale,
      })
    )

    expect(tree.root.findAllByType(RegisterToBidButtonContainer)).toBeTruthy()
  })

  it("hides register to bid button if auction is over", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          ...mockSale,
          endAt: "2020-08-01T15:00:00",
        }),
      })
    )

    expect(tree.root.findAllByType(RegisterToBidButtonContainer)).toEqual([])
  })

  it("shows Auction is live View shows up when an auction is live", () => {
    const { UNSAFE_queryAllByType } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => liveMockSale,
      })
    )

    expect(UNSAFE_queryAllByType(tests.AuctionIsLive)).toHaveLength(1)
  })

  it("doesn't show Auction is live view when an auction is not live", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => mockSale,
      })
    )

    expect(tree.root.findAllByType(tests.AuctionIsLive)).toHaveLength(0)
  })

  it("shows the buyers premium correctly for a single percentage", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => mockSale,
      })
    )

    expect(extractText(tree.root)).toContain("20% on the hammer price")
  })

  it("shows the buyers premium correctly for range of percentages", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    const sale = {
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
    }

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => sale,
      })
    )

    expect(extractText(tree.root)).toContain(
      "On the hammer price up to and including $150,000: 25%"
    )
    expect(extractText(tree.root)).toContain(
      "On the hammer price in excess of $150,000 up to and including $3,000,000: 20%"
    )
    expect(extractText(tree.root)).toContain(
      "On the portion of the hammer price in excess of $3,000,000: 12%"
    )
  })
})

const mockSale = {
  slug: "the-sale",
  name: "sale name",
  internalID: "the-sale-internal",
  description: "sale description",
  endAt: "2021-08-01T15:00:00",
  liveStartAt: null,
  startAt: "2020-09-01T15:00:00",
  timeZone: "Europe/Berlin",
  requireIdentityVerification: false,
  registrationStatus: null,
  isWithBuyersPremium: true,
  buyersPremium: [{ amount: "CHF0", percent: 0.2 }],
}

const liveMockSale = {
  ...mockSale,
  liveStartAt: "2020-10-01T15:00:00",
}
