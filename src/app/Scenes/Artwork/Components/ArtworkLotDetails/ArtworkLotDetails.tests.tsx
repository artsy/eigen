import { ArtworkLotDetails_TestQuery } from "__generated__/ArtworkLotDetails_TestQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { DateTime } from "luxon"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkLotDetails, ArtworkLotDetailsProps } from "./ArtworkLotDetails"
import { formateLotDateTime } from "./utils/formateLotDateTime"

jest.unmock("react-relay")

describe("ArtworkLotDetails", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = (props: Partial<ArtworkLotDetailsProps>) => {
    const data = useLazyLoadQuery<ArtworkLotDetails_TestQuery>(
      graphql`
        query ArtworkLotDetails_TestQuery @relay_test_operation {
          artwork(id: "artworkID") {
            ...ArtworkLotDetails_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return (
        <ArtworkLotDetails
          {...props}
          auctionState={props.auctionState ?? AuctionTimerState.CLOSING}
          artwork={data.artwork}
        />
      )
    }

    return null
  }

  it("should render all details", async () => {
    const { queryByText, queryByTestId } = renderWithHookWrappersTL(
      <TestRenderer />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(queryByText("Estimated value")).toBeTruthy()
    expect(queryByText("$1,200")).toBeTruthy()
    expect(queryByText(/Starting bid/)).toBeTruthy()
    expect(queryByText("$500")).toBeTruthy()
    expect(queryByText("Lot closes")).toBeTruthy()
    expect(queryByText(formateLotDateTime(sale.endAt))).toBeTruthy()
    expect(queryByTestId("buyers-premium")).toBeTruthy()
    expect(queryByTestId("conditions-of-sale")).toBeTruthy()
    expect(queryByTestId("have-a-question")).toBeTruthy()
  })

  it("should render only `Estimated value` row when auction is closed", async () => {
    const { queryByText, queryByTestId } = renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.CLOSED} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(queryByText("Estimated value")).toBeTruthy()
    expect(queryByText("$1,200")).toBeTruthy()

    expect(queryByText("Starting bid")).toBeNull()
    expect(queryByText("$500")).toBeNull()
    expect(queryByText("Lot closes")).toBeNull()
    expect(queryByText(formateLotDateTime(sale.endAt))).toBeNull()
    expect(queryByTestId("buyers-premium")).toBeNull()
    expect(queryByTestId("conditions-of-sale")).toBeNull()
    expect(queryByTestId("have-a-question")).toBeNull()
  })

  it("should hide only the bid related info when auction is live", async () => {
    const { queryByText, queryByTestId } = renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(queryByText("Starting bid")).toBeNull()
    expect(queryByText("$500")).toBeNull()
    expect(queryByText(formateLotDateTime(sale.endAt))).toBeNull()
    expect(queryByTestId("buyers-premium")).toBeNull()

    // Check other info
    expect(queryByText("Estimated value")).toBeTruthy()
    expect(queryByText("$1,200")).toBeTruthy()
    expect(queryByTestId("conditions-of-sale")).toBeTruthy()
    expect(queryByTestId("have-a-question")).toBeTruthy()
  })

  it("should render `Lot live` instead of `Lot closes` when auction is live upcoming", async () => {
    const liveStartAt = DateTime.now().plus({ hour: 5 }).toISO()
    const { queryByText } = renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        sale: {
          ...artwork.sale,
          liveStartAt,
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("Lot live")).toBeTruthy()
    expect(queryByText("Lot closes")).toBeNull()
    expect(queryByText(formateLotDateTime(liveStartAt))).toBeTruthy()
  })

  it("should hide the buyer's premium info when sale doesn't support it", async () => {
    const { queryByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        sale: {
          ...artwork.sale,
          isWithBuyersPremium: false,
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByTestId("buyers-premium")).toBeNull()
  })
})

const sale = {
  endAt: DateTime.now().plus({ day: 1 }).toISO(),
  partner: null,
  isWithBuyersPremium: true,
}

const saleArtwork = {
  estimate: "$1,200",
  extendedBiddingEndAt: null,
  endAt: null,
  currentBid: {
    display: "$500",
  },
}

const artwork = {
  isForSale: true,
  sale,
  saleArtwork,
}
