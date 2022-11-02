import { LotCurrentBidInfo_TestQuery } from "__generated__/LotCurrentBidInfo_TestQuery.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { LotCurrentBidInfo } from "./LotCurrentBidInfo"

jest.unmock("react-relay")

describe("LotCurrentBidInfo", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<LotCurrentBidInfo_TestQuery>(
      graphql`
        query LotCurrentBidInfo_TestQuery @relay_test_operation {
          saleArtwork(id: "artworkID") {
            ...LotCurrentBidInfo_saleArtwork
          }
        }
      `,
      {}
    )

    if (data.saleArtwork) {
      return <LotCurrentBidInfo saleArtwork={data.saleArtwork} />
    }

    return null
  }

  it("should render `Current Bid` when no bids", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SaleArtwork: () => saleArtwork,
    })
    await flushPromiseQueue()

    expect(queryByText("Starting bid")).toBeTruthy()
  })

  it("should render `Current Bid` when bids present", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SaleArtwork: () => ({
        ...saleArtwork,
        counts: {
          bidderPositions: 1,
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByText(/Current bid/)).toBeTruthy()
  })

  it("should render `1 bid` label", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SaleArtwork: () => ({
        ...saleArtwork,
        counts: {
          bidderPositions: 1,
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("Current bid (1 bid)")).toBeTruthy()
  })

  it("should render `x bids` label", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SaleArtwork: () => ({
        ...saleArtwork,
        counts: {
          bidderPositions: 5,
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("Current bid (5 bids)")).toBeTruthy()
  })

  it("should render `x bids` label", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SaleArtwork: () => ({
        ...saleArtwork,
        counts: {
          bidderPositions: 5,
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("Current bid (5 bids)")).toBeTruthy()
  })

  it("should render only reserve label", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SaleArtwork: () => ({
        ...saleArtwork,
        reserveMessage: "This work has a reserve",
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("Starting bid (this work has a reserve)")).toBeTruthy()
  })

  it("should render reserve label with bids", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SaleArtwork: () => ({
        ...saleArtwork,
        reserveMessage: "Reserve not met",
        counts: {
          bidderPositions: 5,
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("Current bid (5 bids, reserve not met)")).toBeTruthy()
  })
})

const saleArtwork = {
  reserveMessage: null,
  currentBid: {
    display: "$500",
  },
  counts: {
    bidderPositions: 0,
  },
}
