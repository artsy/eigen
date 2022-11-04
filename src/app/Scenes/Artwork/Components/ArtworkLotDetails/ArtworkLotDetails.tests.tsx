import { fireEvent } from "@testing-library/react-native"
import { ArtworkLotDetails_TestQuery } from "__generated__/ArtworkLotDetails_TestQuery.graphql"
import {
  AuctionPreview,
  AuctionPreviewNoStartingBid,
  OpenAuctionNoReserveNoBids,
  OpenAuctionNoReserveWithBids,
  OpenAuctionReserveMetWithBids,
  OpenAuctionReserveMetWithMyLosingBid,
  OpenAuctionReserveMetWithMyWinningBid,
  OpenAuctionReserveNoBids,
  OpenAuctionReserveNotMetIncreasingOwnBid,
  OpenAuctionReserveNotMetWithBids,
} from "app/__fixtures__/ArtworkBidInfo"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
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
    expect(queryByText("Starting bid")).toBeTruthy()
    expect(queryByText("$500")).toBeTruthy()
    expect(queryByText("Lot closes")).toBeTruthy()
    expect(queryByText(formateLotDateTime(sale.endAt))).toBeTruthy()
    expect(queryByTestId("buyers-premium-and-shipping")).toBeTruthy()
    expect(queryByTestId("conditions-of-sale")).toBeTruthy()
    expect(queryByTestId("have-a-question")).toBeTruthy()
  })

  it("should render only `Estimated value` row when auction is closed", async () => {
    const { queryByText, queryByTestId, queryByLabelText } = renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.CLOSED} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(queryByText("Estimated value")).toBeTruthy()
    expect(queryByText("$1,200")).toBeTruthy()

    // Hide bid info
    expect(queryByLabelText("Bid info")).toBeNull()
    expect(queryByText("Starting bid")).toBeNull()
    expect(queryByText("$500")).toBeNull()

    expect(queryByText("Lot closes")).toBeNull()
    expect(queryByText(formateLotDateTime(sale.endAt))).toBeNull()
    expect(queryByTestId("buyers-premium-and-shipping")).toBeNull()
    expect(queryByTestId("conditions-of-sale")).toBeNull()
    expect(queryByTestId("have-a-question")).toBeNull()
  })

  it("should hide only the bid related info for live sale in progress", async () => {
    const { queryByText, queryByTestId, queryByLabelText } = renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    // Hide bid info
    expect(queryByLabelText("Bid info")).toBeNull()
    expect(queryByText("Starting bid")).toBeNull()
    expect(queryByText("$500")).toBeNull()

    expect(queryByText(formateLotDateTime(sale.endAt))).toBeNull()
    expect(queryByTestId("buyers-premium-and-shipping")).toBeNull()

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

    expect(queryByTestId("buyers-premium-and-shipping")).toBeNull()
  })

  it("should render correct partner info", async () => {
    const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        sale: {
          ...artwork.sale,
          partner: {
            name: "Christie's",
          },
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
  })

  describe("Bid info for different auction states", () => {
    describe("auction preview", () => {
      it("displays proper starting bid info", async () => {
        const { getByText } = renderWithHookWrappersTL(
          <TestRenderer auctionState={AuctionTimerState.PREVIEW} />,
          mockEnvironment
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => AuctionPreview,
        })
        await flushPromiseQueue()

        expect(getByText("Starting bid")).toBeTruthy()
        expect(getByText("CHF 4,000")).toBeTruthy()
      })

      describe("with no start bid set", () => {
        it("displays nothing if current bid info is unavailable", async () => {
          const { queryByLabelText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.PREVIEW} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => AuctionPreviewNoStartingBid,
          })
          await flushPromiseQueue()

          expect(queryByLabelText("Bid info")).toBeNull()
        })
      })
    })

    describe("open auction", () => {
      describe("with no reserve and no bids", () => {
        it("displays proper starting bid info", async () => {
          const { getByText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionNoReserveNoBids,
          })
          await flushPromiseQueue()

          expect(getByText("Starting bid")).toBeTruthy()
          expect(getByText("$500")).toBeTruthy()
        })
      })

      describe("with no reserve with bids present", () => {
        it("displays proper current bid info including bid count", async () => {
          const { getByText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionNoReserveWithBids,
          })
          await flushPromiseQueue()

          expect(getByText("Current bid (11 bids)")).toBeTruthy()
          expect(getByText("$850")).toBeTruthy()
        })
      })

      describe("with reserve and no bids", () => {
        it("displays proper starting bid info and resserve message", async () => {
          const { getByText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionReserveNoBids,
          })
          await flushPromiseQueue()

          expect(getByText("Starting bid (this work has a reserve)")).toBeTruthy()
          expect(getByText("$3,000")).toBeTruthy()
        })
      })

      describe("with some bids and reserve not met", () => {
        it("displays current bid message inculding reserve warning", async () => {
          const { getByText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionReserveNotMetWithBids,
          })
          await flushPromiseQueue()

          expect(getByText("Current bid (2 bids, reserve not met)")).toBeTruthy()
          expect(getByText("$10,000")).toBeTruthy()
        })
      })

      describe("with some bids and satisfied reserve", () => {
        it("displays current bid message inculding reserve met", async () => {
          const { getByText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionReserveMetWithBids,
          })
          await flushPromiseQueue()

          expect(getByText("Current bid (2 bids, reserve met)")).toBeTruthy()
          expect(getByText("$500")).toBeTruthy()
        })
      })

      describe("with my bid winning", () => {
        it("displays max bid and winning indicator", async () => {
          const { getByText, getByLabelText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionReserveMetWithMyWinningBid,
          })
          await flushPromiseQueue()

          expect(getByText("Your max: $15,000")).toBeTruthy()
          expect(getByLabelText("My Bid Winning Icon")).toBeTruthy()
        })
      })

      describe("with me increasing my max bid while winning", () => {
        it("displays max bid and winning indicator", async () => {
          const { getByText, getByLabelText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionReserveNotMetIncreasingOwnBid,
          })
          await flushPromiseQueue()

          expect(getByText("Your max: $15,000")).toBeTruthy()
          expect(getByLabelText("My Bid Winning Icon")).toBeTruthy()
        })
      })

      describe("with my bid losing", () => {
        it("displays max bid and losing indicator", async () => {
          const { getByText, getByLabelText } = renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => OpenAuctionReserveMetWithMyLosingBid,
          })
          await flushPromiseQueue()

          expect(getByText("Your max: $400")).toBeTruthy()
          expect(getByLabelText("My Bid Losing Icon")).toBeTruthy()
        })
      })
    })
  })

  describe("Analytics", () => {
    it("posts proper event in when clicking `Ask A Specialist`", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()

      fireEvent.press(getByText("ask a specialist"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "action_name": "askASpecialist",
            "action_type": "tap",
            "context_module": "ArtworkExtraLinks",
          },
        ]
      `)
    })

    it("posts proper event in when clicking `Read our auction FAQs`", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()

      fireEvent.press(getByText("Read our auction FAQs"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "action_name": "auctionsFAQ",
            "action_type": "tap",
            "context_module": "ArtworkExtraLinks",
          },
        ]
      `)
    })

    it("posts proper event in when clicking `Conditions of Sale`", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()

      fireEvent.press(getByText("Conditions of Sale"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "action_name": "conditionsOfSale",
            "action_type": "tap",
            "context_module": "ArtworkExtraLinks",
          },
        ]
      `)
    })
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
  reserveMessage: null,
  currentBid: {
    display: "$500",
  },
}

const artwork = {
  isForSale: true,
  sale,
  saleArtwork,
}
