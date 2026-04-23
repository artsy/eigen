import { deriveLotEventFeed } from "app/Scenes/LiveSale/utils/deriveLotEventFeed"
import type { LotEvent } from "app/Scenes/LiveSale/types/liveAuction"

const MY_BIDDER_ID = "bidder-mine"
const OTHER_BIDDER_ID = "bidder-other"
const CURRENCY = "$"

const makeEvent = (
  overrides: Partial<LotEvent> & Pick<LotEvent, "type" | "eventId">
): LotEvent => ({
  amountCents: 0,
  createdAt: "2024-01-01T00:00:00Z",
  ...overrides,
})

const makeBidEvent = (
  eventId: string,
  amountCents: number,
  bidderId: string,
  createdAt = "2024-01-01T00:00:00Z",
  paddleNumber?: string
): LotEvent =>
  makeEvent({
    type: "FirstPriceBidPlaced",
    eventId,
    amountCents,
    createdAt,
    bidder: { bidderId, type: "ArtsyBidder", paddleNumber },
  })

describe("deriveLotEventFeed", () => {
  describe("bid rows", () => {
    it("shows YOU for my bid", () => {
      const events = [makeBidEvent("e1", 100000, MY_BIDDER_ID)]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      expect(result[0].title).toBe("YOU")
      expect(result[0].isMine).toBe(true)
    })

    it("shows BIDDER {paddle} for another ArtsyBidder with paddle number", () => {
      const events = [makeBidEvent("e1", 100000, OTHER_BIDDER_ID, "2024-01-01T00:00:00Z", "42")]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, OTHER_BIDDER_ID, CURRENCY)
      expect(result[0].title).toBe("BIDDER 42")
      expect(result[0].isMine).toBe(false)
    })

    it("falls back to bidderId when no paddleNumber", () => {
      const events = [makeBidEvent("e1", 100000, OTHER_BIDDER_ID)]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, OTHER_BIDDER_ID, CURRENCY)
      expect(result[0].title).toBe(OTHER_BIDDER_ID)
    })

    it("shows FLOOR for OfflineBidder", () => {
      const events = [
        makeEvent({
          type: "FirstPriceBidPlaced",
          eventId: "e1",
          amountCents: 100000,
          bidder: { bidderId: "floor-bidder", type: "OfflineBidder" },
        }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, "floor-bidder", CURRENCY)
      expect(result[0].title).toBe("FLOOR")
    })

    it("formats subtitle as currency amount", () => {
      const events = [makeBidEvent("e1", 100000, MY_BIDDER_ID)]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      expect(result[0].subtitle).toBe("$1,000")
    })

    it("sets isTopBid true when bidder matches sellingToBidderId", () => {
      const events = [makeBidEvent("e1", 100000, MY_BIDDER_ID)]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      expect(result[0].isTopBid).toBe(true)
    })

    it("sets isTopBid false when bidder does not match sellingToBidderId", () => {
      const events = [makeBidEvent("e1", 100000, MY_BIDDER_ID)]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, OTHER_BIDDER_ID, CURRENCY)
      expect(result[0].isTopBid).toBe(false)
    })

    it("marks bid as pending when unconfirmed", () => {
      const events = [makeBidEvent("e1", 100000, MY_BIDDER_ID)]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      expect(result[0].isPending).toBe(true)
    })

    it("marks bid as not pending when confirmed=true", () => {
      const events = [{ ...makeBidEvent("e1", 100000, MY_BIDDER_ID), confirmed: true }]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      expect(result[0].isPending).toBe(false)
    })

    it("floor bids (OfflineBidder) are never pending", () => {
      const events = [
        makeEvent({
          type: "FirstPriceBidPlaced",
          eventId: "e1",
          amountCents: 100000,
          bidder: { bidderId: "floor-bidder", type: "OfflineBidder" },
        }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, "floor-bidder", CURRENCY)
      expect(result[0].isPending).toBe(false)
    })
  })

  describe("Undo events", () => {
    it("marks referenced bid as isCancelled", () => {
      const events = [
        makeBidEvent("e1", 100000, MY_BIDDER_ID),
        makeEvent({ type: "LiveOperatorEventUndone", eventId: "undo-1", event: { eventId: "e1" } }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      const bid = result.find((e) => e.id === "e1")
      expect(bid?.isCancelled).toBe(true)
    })

    it("does not include Undo event itself in output", () => {
      const events = [
        makeBidEvent("e1", 100000, MY_BIDDER_ID),
        makeEvent({ type: "LiveOperatorEventUndone", eventId: "undo-1", event: { eventId: "e1" } }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      expect(result.find((e) => e.id === "undo-1")).toBeUndefined()
    })

    it("cancelled bid has isTopBid false even if sellingToBidderId matches", () => {
      const events = [
        makeBidEvent("e1", 100000, MY_BIDDER_ID),
        makeEvent({ type: "LiveOperatorEventUndone", eventId: "undo-1", event: { eventId: "e1" } }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      const bid = result.find((e) => e.id === "e1")
      expect(bid?.isTopBid).toBe(false)
    })
  })

  describe("BidComposite events", () => {
    it("marks pending bid as confirmed when amountCents matches BidComposite", () => {
      const events = [
        makeBidEvent("e1", 100000, MY_BIDDER_ID),
        makeEvent({
          type: "CompositeOnlineBidConfirmed",
          eventId: "composite-1",
          amountCents: 100000,
        }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      const bid = result.find((e) => e.id === "e1")
      expect(bid?.isPending).toBe(false)
    })

    it("does not include BidComposite event itself in output", () => {
      const events = [
        makeBidEvent("e1", 100000, MY_BIDDER_ID),
        makeEvent({
          type: "CompositeOnlineBidConfirmed",
          eventId: "composite-1",
          amountCents: 100000,
        }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, MY_BIDDER_ID, CURRENCY)
      expect(result.find((e) => e.id === "composite-1")).toBeUndefined()
    })
  })

  describe("non-bid event types", () => {
    it("LotOpened produces lotOpen kind row", () => {
      const events = [makeEvent({ type: "LotOpened", eventId: "e1" })]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      expect(result[0].kind).toBe("lotOpen")
      expect(result[0].title).toBe("LOT OPEN FOR BIDDING")
      expect(result[0].subtitle).toBeNull()
    })

    it("BiddingStarted also produces lotOpen kind row", () => {
      const events = [makeEvent({ type: "BiddingStarted", eventId: "e1" })]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      expect(result[0].kind).toBe("lotOpen")
    })

    it("FairWarning produces warning row", () => {
      const events = [makeEvent({ type: "FairWarning", eventId: "e1" })]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      expect(result[0].kind).toBe("warning")
      expect(result[0].title).toBe("WARNING")
    })

    it("FinalCall produces finalCall row", () => {
      const events = [makeEvent({ type: "FinalCall", eventId: "e1" })]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      expect(result[0].kind).toBe("finalCall")
      expect(result[0].title).toBe("FINAL CALL")
    })

    it("LotSold produces closed row with title SOLD", () => {
      const events = [makeEvent({ type: "LotSold", eventId: "e1" })]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      expect(result[0].kind).toBe("closed")
      expect(result[0].title).toBe("SOLD")
    })

    it("LotPassed produces closed row with title CLOSED", () => {
      const events = [makeEvent({ type: "LotPassed", eventId: "e1" })]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
      expect(result[0].kind).toBe("closed")
      expect(result[0].title).toBe("CLOSED")
    })
  })

  describe("excluded event types", () => {
    it.each(["ReserveMet", "ReserveNotMet", "AskingPriceChanged"] as const)(
      "excludes %s from output",
      (type) => {
        const events = [makeEvent({ type, eventId: "e1" })]
        const result = deriveLotEventFeed(events, MY_BIDDER_ID, undefined, CURRENCY)
        expect(result).toHaveLength(0)
      }
    )
  })

  describe("ordering", () => {
    it("returns events in reverse-chronological order", () => {
      const events = [
        makeBidEvent("e1", 100000, MY_BIDDER_ID, "2024-01-01T10:00:00Z"),
        makeBidEvent("e2", 120000, OTHER_BIDDER_ID, "2024-01-01T11:00:00Z"),
        makeEvent({ type: "LotOpened", eventId: "e0", createdAt: "2024-01-01T09:00:00Z" }),
      ]
      const result = deriveLotEventFeed(events, MY_BIDDER_ID, OTHER_BIDDER_ID, CURRENCY)
      expect(result.map((e) => e.id)).toEqual(["e2", "e1", "e0"])
    })
  })
})
