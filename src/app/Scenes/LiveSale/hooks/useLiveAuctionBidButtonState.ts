import type {
  LiveAuctionBidButtonState,
  LiveAuctionState,
} from "app/Scenes/LiveSale/types/liveAuction"

export function deriveBidButtonState(
  lotId: string,
  state: LiveAuctionState
): LiveAuctionBidButtonState {
  const { currentLotId, registrationStatus, credentials, pendingBids, currencySymbol } = state
  const lot = state.lots.get(lotId)

  // Closed lot → always inactive regardless of registration status
  if (lot?.derivedState.biddingStatus === "Complete") {
    const lotPhase = lot.derivedState.soldStatus === "Sold" ? "closedSold" : "closedPassed"
    return { kind: "inactive", lotPhase }
  }

  // Registration states — priority order matches native implementation
  if (registrationStatus === "closed") {
    return { kind: "active", biddingState: { kind: "userRegistrationClosed" } }
  }
  if (registrationStatus === "pending") {
    return { kind: "active", biddingState: { kind: "userRegistrationPending" } }
  }
  if (registrationStatus === "unregistered") {
    return { kind: "active", biddingState: { kind: "userRegistrationRequired" } }
  }

  // User is registered. Not the current live lot → upcoming (pre-sale or between lots).
  if (lotId !== currentLotId) {
    const isHighestBidder = lot?.derivedState.sellingToBidderId === credentials.bidderId
    return { kind: "inactive", lotPhase: "upcoming", isHighestBidder }
  }

  // Current live lot — check if auctioneer has opened bidding yet
  if (!lot?.derivedState.hasOpenedBidding) {
    return { kind: "active", biddingState: { kind: "lotWaitingToOpen" } }
  }

  // Current live lot, sold while we're watching it
  if (lot.derivedState.soldStatus === "Sold") {
    return { kind: "active", biddingState: { kind: "lotSold" } }
  }

  // Check pending bids for this lot
  const lotPendingBid = Array.from(pendingBids.values()).find((bid) => bid.lotId === lotId)

  if (lotPendingBid?.status === "pending") {
    return { kind: "active", biddingState: { kind: "biddingInProgress" } }
  }

  if (lotPendingBid?.status === "error") {
    return {
      kind: "active",
      biddingState: { kind: "bidFailed", reason: lotPendingBid.error ?? "An error occurred" },
    }
  }

  // Active bidding state — check if we're the current highest bidder
  const { sellingToBidderId, askingPriceCents } = lot.derivedState

  if (sellingToBidderId === credentials.bidderId) {
    return { kind: "active", biddingState: { kind: "bidBecameMaxBidder" } }
  }

  return {
    kind: "active",
    biddingState: { kind: "biddable", askingPriceCents, currencySymbol },
  }
}

export function useLiveAuctionBidButtonState(
  lotId: string,
  state: LiveAuctionState
): LiveAuctionBidButtonState {
  return deriveBidButtonState(lotId, state)
}
