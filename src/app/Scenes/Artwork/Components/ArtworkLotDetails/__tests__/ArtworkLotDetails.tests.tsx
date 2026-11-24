import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkLotDetails_TestQuery } from "__generated__/ArtworkLotDetails_TestQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import {
  ArtworkLotDetails,
  ArtworkLotDetailsProps,
} from "app/Scenes/Artwork/Components/ArtworkLotDetails/ArtworkLotDetails"
import { formatLotDateTime } from "app/Scenes/Artwork/Components/ArtworkLotDetails/utils/formatLotDateTime"
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
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { DateTime } from "luxon"
import { act } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

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
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Estimated value")).toBeTruthy()
    expect(screen.getByText("$1,200")).toBeTruthy()
    expect(screen.getByText("Starting bid")).toBeTruthy()
    expect(screen.getByText("$500")).toBeTruthy()
    expect(screen.getByText("Lot closes")).toBeTruthy()
    expect(screen.getByText(formatLotDateTime(sale.endAt))).toBeTruthy()
    expect(screen.getByTestId("buyers-premium")).toBeTruthy()
    expect(screen.getByTestId("shipping-info")).toBeTruthy()
    expect(screen.getByTestId("conditions-of-sale")).toBeTruthy()
    expect(screen.getByTestId("have-a-question")).toBeTruthy()
  })

  it("should render only `Estimated value` row when auction is closed", async () => {
    await renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.CLOSED} />,
      mockEnvironment
    )

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Estimated value")).toBeTruthy()
    expect(screen.getByText("$1,200")).toBeTruthy()

    // Hide bid info
    expect(screen.queryByLabelText("Bid info")).toBeNull()
    expect(screen.queryByText("Starting bid")).toBeNull()
    expect(screen.queryByText("$500")).toBeNull()

    expect(screen.queryByText("Lot closes")).toBeNull()
    expect(screen.queryByText(formatLotDateTime(sale.endAt))).toBeNull()
    expect(screen.queryByTestId("buyers-premium")).toBeNull()
    expect(screen.queryByTestId("shipping-info")).toBeNull()
    expect(screen.queryByTestId("conditions-of-sale")).toBeNull()
    expect(screen.queryByTestId("have-a-question")).toBeNull()
  })

  it("should hide the extra info for live sale in progress", async () => {
    await renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />,
      mockEnvironment
    )

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()
    })

    // Hide bid info
    expect(screen.queryByLabelText("Bid info")).toBeNull()
    expect(screen.queryByText("Starting bid")).toBeNull()
    expect(screen.queryByText("$500")).toBeNull()

    expect(screen.queryByText(formatLotDateTime(sale.endAt))).toBeNull()
    expect(screen.queryByTestId("buyers-premium")).toBeNull()
    expect(screen.queryByTestId("shipping-info")).toBeNull()

    // Check other info
    expect(screen.getByText("Estimated value")).toBeTruthy()
    expect(screen.getByText("$1,200")).toBeTruthy()
    expect(screen.getByTestId("conditions-of-sale")).toBeTruthy()
    expect(screen.getByTestId("have-a-question")).toBeTruthy()
  })

  it("should render `Lot live` instead of `Lot closes` when auction is live upcoming", async () => {
    const liveStartAt = DateTime.now().plus({ hour: 5 }).toISO()
    await renderWithHookWrappersTL(
      <TestRenderer auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />,
      mockEnvironment
    )
    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          sale: {
            ...artwork.sale,
            liveStartAt,
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Lot live")).toBeTruthy()
    expect(screen.queryByText("Lot closes")).toBeNull()
    expect(screen.getByText(formatLotDateTime(liveStartAt))).toBeTruthy()
  })

  it("should hide the buyer's premium info when sale doesn't support it", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          sale: {
            ...artwork.sale,
            isWithBuyersPremium: false,
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.queryByTestId("buyers-premium")).toBeNull()
  })

  it("should render correct partner info", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
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
    })

    expect(screen.getByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
  })

  describe("Bid info for different auction states", () => {
    describe("auction preview", () => {
      it("displays proper starting bid info", async () => {
        await renderWithHookWrappersTL(
          <TestRenderer auctionState={AuctionTimerState.PREVIEW} />,
          mockEnvironment
        )
        await act(async () => {
          await resolveMostRecentRelayOperation(mockEnvironment, {
            Artwork: () => AuctionPreview,
          })
          await flushPromiseQueue()
        })

        expect(screen.getByText("Starting bid")).toBeTruthy()
        expect(screen.getByText("CHF 4,000")).toBeTruthy()
      })

      describe("with no start bid set", () => {
        it("displays nothing if current bid info is unavailable", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.PREVIEW} />,
            mockEnvironment
          )

          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => AuctionPreviewNoStartingBid,
            })
            await flushPromiseQueue()
          })

          expect(screen.queryByLabelText("Bid info")).toBeNull()
        })
      })
    })

    describe("open auction", () => {
      describe("with no reserve and no bids", () => {
        it("displays proper starting bid info", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionNoReserveNoBids,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Starting bid")).toBeTruthy()
          expect(screen.getByText("$500")).toBeTruthy()
        })
      })

      describe("with no reserve with bids present", () => {
        it("displays proper current bid info including bid count", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionNoReserveWithBids,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Current bid (11 bids)")).toBeTruthy()
          expect(screen.getByText("$850")).toBeTruthy()
        })
      })

      describe("with reserve and no bids", () => {
        it("displays proper starting bid info and resserve message", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionReserveNoBids,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Starting bid (this work has a reserve)")).toBeTruthy()
          expect(screen.getByText("$3,000")).toBeTruthy()
        })
      })

      describe("with some bids and reserve not met", () => {
        it("displays current bid message inculding reserve warning", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionReserveNotMetWithBids,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Current bid (2 bids, reserve not met)")).toBeTruthy()
          expect(screen.getByText("$10,000")).toBeTruthy()
        })
      })

      describe("with some bids and satisfied reserve", () => {
        it("displays current bid message inculding reserve met", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )
          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionReserveMetWithBids,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Current bid (2 bids, reserve met)")).toBeTruthy()
          expect(screen.getByText("$500")).toBeTruthy()
        })
      })

      describe("with my bid winning", () => {
        it("displays max bid and winning indicator", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )
          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionReserveMetWithMyWinningBid,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Your max: $15,000")).toBeTruthy()
          expect(screen.getByLabelText("My Bid Winning Icon")).toBeTruthy()
        })
      })

      describe("with me increasing my max bid while winning", () => {
        it("displays max bid and winning indicator", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionReserveNotMetIncreasingOwnBid,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Your max: $15,000")).toBeTruthy()
          expect(screen.getByLabelText("My Bid Winning Icon")).toBeTruthy()
        })
      })

      describe("with my bid losing", () => {
        it("displays max bid and losing indicator", async () => {
          await renderWithHookWrappersTL(
            <TestRenderer auctionState={AuctionTimerState.CLOSING} />,
            mockEnvironment
          )

          await act(async () => {
            await resolveMostRecentRelayOperation(mockEnvironment, {
              Artwork: () => OpenAuctionReserveMetWithMyLosingBid,
            })
            await flushPromiseQueue()
          })

          expect(screen.getByText("Your max: $400")).toBeTruthy()
          expect(screen.getByLabelText("My Bid Losing Icon")).toBeTruthy()
        })
      })
    })
  })

  describe("Analytics", () => {
    it("posts proper event in when clicking `Ask A Specialist`", async () => {
      await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      await act(async () => {
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => artwork,
        })
        await flushPromiseQueue()
      })

      await fireEvent.press(screen.getByText("ask a specialist"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "askASpecialist",
            "action_type": "tap",
            "context_module": "ArtworkExtraLinks",
          },
        ]
      `)
    })

    it("posts proper event in when clicking `Read our auction FAQs`", async () => {
      await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      await act(async () => {
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => artwork,
        })
        await flushPromiseQueue()
      })

      await fireEvent.press(screen.getByText("Read our auction FAQs"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "auctionsFAQ",
            "action_type": "tap",
            "context_module": "ArtworkExtraLinks",
          },
        ]
      `)
    })

    it("posts proper event in when clicking `Conditions of Sale`", async () => {
      await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      await act(async () => {
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => artwork,
        })
        await flushPromiseQueue()
      })

      await fireEvent.press(screen.getByText("Conditions of Sale"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
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
