import { SaleInfoTestsQuery } from "__generated__/SaleInfoTestsQuery.graphql"
import { RegisterToBidButtonContainer } from "lib/Scenes/Sale/Components/RegisterToBidButton"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SaleInfoContainer, tests } from "../SaleInfo"

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

  it("shows Auction is live View shows up when an auction is live", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => liveMockSale,
      })
    )

    expect(tree.root.findAllByType(tests.AuctionIsLive)).toHaveLength(1)
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
}

const liveMockSale = {
  ...mockSale,
  liveStartAt: "2020-10-01T15:00:00",
}
