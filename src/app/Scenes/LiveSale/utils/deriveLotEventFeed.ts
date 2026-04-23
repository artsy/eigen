import type { LiveAuctionFeedEvent, LotEvent } from "app/Scenes/LiveSale/types/liveAuction"

const formatCents = (amountCents: number, currencySymbol: string): string => {
  const amount = amountCents / 100
  return `${currencySymbol}${amount.toLocaleString("en-US")}`
}

const bidderTitle = (event: LotEvent, myBidderId: string): string => {
  const { bidder } = event
  if (!bidder) return "UNKNOWN"
  if (bidder.bidderId === myBidderId) return "YOU"
  if (bidder.type === "OfflineBidder") return "FLOOR"
  if (bidder.paddleNumber) return `BIDDER ${bidder.paddleNumber}`
  return bidder.bidderId
}

export function deriveLotEventFeed(
  eventHistory: LotEvent[],
  myBidderId: string,
  sellingToBidderId: string | undefined,
  currencySymbol: string
): LiveAuctionFeedEvent[] {
  // Pass 1 — build mutable working set keyed by eventId
  const workingSet = new Map<string, LotEvent>()
  for (const event of eventHistory) {
    workingSet.set(event.eventId, event)
  }

  // Pass 2 — apply Undo events: mark referenced event as cancelled
  const cancelledIds = new Set<string>()
  for (const event of workingSet.values()) {
    if (event.type === "LiveOperatorEventUndone" && event.event?.eventId) {
      cancelledIds.add(event.event.eventId)
    }
  }

  // Pass 3 — apply BidComposite events: mark matching bid as confirmed
  const confirmedAmounts = new Set<number>()
  for (const event of workingSet.values()) {
    if (event.type === "CompositeOnlineBidConfirmed") {
      confirmedAmounts.add(event.amountCents)
    }
  }

  // Pass 4 — build display events from user-facing types only
  const feedEvents: LiveAuctionFeedEvent[] = []

  for (const event of workingSet.values()) {
    const isCancelled = cancelledIds.has(event.eventId)

    switch (event.type) {
      case "FirstPriceBidPlaced":
      case "SecondPriceBidPlaced": {
        const isMine = event.bidder?.bidderId === myBidderId
        const isConfirmedByComposite = confirmedAmounts.has(event.amountCents)
        const isPending = !isCancelled && !event.confirmed && !isConfirmedByComposite

        feedEvents.push({
          id: event.eventId,
          kind: "bid",
          title: bidderTitle(event, myBidderId),
          subtitle: formatCents(event.amountCents, currencySymbol),
          isMine,
          isTopBid: !isCancelled && event.bidder?.bidderId === sellingToBidderId,
          isCancelled,
          isPending,
          createdAt: event.createdAt,
        })
        break
      }
      case "BiddingOpened":
      case "LotOpened":
      case "BiddingStarted":
        feedEvents.push({
          id: event.eventId,
          kind: "lotOpen",
          title: "LOT OPEN FOR BIDDING",
          subtitle: null,
          isMine: false,
          isTopBid: false,
          isCancelled,
          isPending: false,
          createdAt: event.createdAt,
        })
        break
      case "FinalCall":
        feedEvents.push({
          id: event.eventId,
          kind: "finalCall",
          title: "FINAL CALL",
          subtitle: null,
          isMine: false,
          isTopBid: false,
          isCancelled,
          isPending: false,
          createdAt: event.createdAt,
        })
        break
      case "FairWarning":
        feedEvents.push({
          id: event.eventId,
          kind: "warning",
          title: "WARNING",
          subtitle: null,
          isMine: false,
          isTopBid: false,
          isCancelled,
          isPending: false,
          createdAt: event.createdAt,
        })
        break
      case "BiddingClosed":
        feedEvents.push({
          id: event.eventId,
          kind: "closed",
          title: "CLOSED",
          subtitle: null,
          isMine: false,
          isTopBid: false,
          isCancelled,
          isPending: false,
          createdAt: event.createdAt,
        })
        break
      case "LotSold":
        feedEvents.push({
          id: event.eventId,
          kind: "closed",
          title: "SOLD",
          subtitle: null,
          isMine: false,
          isTopBid: false,
          isCancelled,
          isPending: false,
          createdAt: event.createdAt,
        })
        break
      case "LotPassed":
        feedEvents.push({
          id: event.eventId,
          kind: "closed",
          title: "CLOSED",
          subtitle: null,
          isMine: false,
          isTopBid: false,
          isCancelled,
          isPending: false,
          createdAt: event.createdAt,
        })
        break
      // Non-user-facing types — excluded from output
      case "LiveOperatorEventUndone":
      case "CompositeOnlineBidConfirmed":
      case "ReserveMet":
      case "ReserveNotMet":
      case "AskingPriceChanged":
      case "BidAccepted":
      case "BidRejected":
        break
    }
  }

  // Sort reverse-chronologically
  feedEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Pin the winning bid to the top (mirrors native iOS behaviour in LiveAuctionLotViewModel)
  const topBidIndex = feedEvents.findIndex((e) => e.isTopBid)
  if (topBidIndex > 0) {
    const [topBid] = feedEvents.splice(topBidIndex, 1)
    feedEvents.unshift(topBid)
  }

  return feedEvents
}
