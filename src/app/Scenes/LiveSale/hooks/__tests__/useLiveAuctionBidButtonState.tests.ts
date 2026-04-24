import { deriveBidButtonState } from "app/Scenes/LiveSale/hooks/useLiveAuctionBidButtonState"
import type { LiveAuctionState, LotState } from "app/Scenes/LiveSale/types/liveAuction"

const makeLot = (overrides?: Partial<LotState["derivedState"]>): LotState => ({
  lotId: "lot-1",
  events: new Map(),
  eventHistory: [],
  processedEventIds: new Set(),
  derivedState: {
    reserveStatus: "NoReserve",
    askingPriceCents: 100_000_00,
    biddingStatus: "Open",
    soldStatus: "ForSale",
    onlineBidCount: 0,
    hasOpenedBidding: true,
    ...overrides,
  },
})

const makeState = (overrides?: Partial<LiveAuctionState>): LiveAuctionState => ({
  isConnected: true,
  showDisconnectWarning: false,
  currentLotId: "lot-1",
  lots: new Map([["lot-1", makeLot()]]),
  isOnHold: false,
  onHoldMessage: null,
  operatorConnected: true,
  pendingBids: new Map(),
  saleName: "Test Auction",
  causalitySaleID: "sale-1",
  jwt: "jwt",
  credentials: { bidderId: "bidder-me", paddleNumber: "42" },
  artworkMetadata: new Map(),
  registrationStatus: "registered",
  currencySymbol: "$",
  ...overrides,
})

describe("deriveBidButtonState", () => {
  describe("inactive states", () => {
    it("returns closedSold for a sold lot", () => {
      const state = makeState({
        lots: new Map([["lot-1", makeLot({ biddingStatus: "Complete", soldStatus: "Sold" })]]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "inactive",
        lotPhase: "closedSold",
      })
    })

    it("returns closedPassed for a passed lot", () => {
      const state = makeState({
        lots: new Map([["lot-1", makeLot({ biddingStatus: "Complete", soldStatus: "Passed" })]]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "inactive",
        lotPhase: "closedPassed",
      })
    })

    it("returns upcoming with isHighestBidder false when not the current lot and not winning", () => {
      const state = makeState({ currentLotId: "lot-2" })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "inactive",
        lotPhase: "upcoming",
        isHighestBidder: false,
      })
    })

    it("returns upcoming with isHighestBidder true when not the current lot but winning", () => {
      const state = makeState({
        currentLotId: "lot-2",
        lots: new Map([["lot-1", makeLot({ sellingToBidderId: "bidder-me" })]]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "inactive",
        lotPhase: "upcoming",
        isHighestBidder: true,
      })
    })

    it("returns closedSold even when registration is not complete", () => {
      const state = makeState({
        registrationStatus: "unregistered",
        lots: new Map([["lot-1", makeLot({ biddingStatus: "Complete", soldStatus: "Sold" })]]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "inactive",
        lotPhase: "closedSold",
      })
    })
  })

  describe("registration states (priority order)", () => {
    it("returns userRegistrationClosed when registration is closed", () => {
      const state = makeState({ registrationStatus: "closed" })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "userRegistrationClosed" },
      })
    })

    it("returns userRegistrationPending when registration is pending", () => {
      const state = makeState({ registrationStatus: "pending" })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "userRegistrationPending" },
      })
    })

    it("returns userRegistrationRequired when not registered", () => {
      const state = makeState({ registrationStatus: "unregistered" })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "userRegistrationRequired" },
      })
    })

    it("closed registration takes priority over pending", () => {
      // "closed" should show over "pending" — handled by the if-else chain
      const closedState = makeState({ registrationStatus: "closed" })
      const result = deriveBidButtonState("lot-1", closedState)
      expect(result).toEqual({
        kind: "active",
        biddingState: { kind: "userRegistrationClosed" },
      })
    })
  })

  describe("active lot states", () => {
    it("returns lotWaitingToOpen when bidding has not opened yet", () => {
      const state = makeState({
        lots: new Map([["lot-1", makeLot({ hasOpenedBidding: false })]]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "lotWaitingToOpen" },
      })
    })

    it("returns lotSold when lot is sold while still current", () => {
      const state = makeState({
        lots: new Map([["lot-1", makeLot({ soldStatus: "Sold", biddingStatus: "Open" })]]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "lotSold" },
      })
    })

    it("returns biddingInProgress when there is a pending bid", () => {
      const state = makeState({
        pendingBids: new Map([
          [
            "bid-1",
            {
              lotId: "lot-1",
              amountCents: 50000,
              isMaxBid: false,
              status: "pending",
              timestamp: 0,
            },
          ],
        ]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "biddingInProgress" },
      })
    })

    it("returns bidFailed with reason when bid has errored", () => {
      const state = makeState({
        pendingBids: new Map([
          [
            "bid-1",
            {
              lotId: "lot-1",
              amountCents: 50000,
              isMaxBid: false,
              status: "error",
              timestamp: 0,
              error: "Bid amount too low",
            },
          ],
        ]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "bidFailed", reason: "Bid amount too low" },
      })
    })

    it("returns bidFailed with fallback reason when error has no message", () => {
      const state = makeState({
        pendingBids: new Map([
          [
            "bid-1",
            {
              lotId: "lot-1",
              amountCents: 50000,
              isMaxBid: false,
              status: "error",
              timestamp: 0,
            },
          ],
        ]),
      })
      const result = deriveBidButtonState("lot-1", state)
      expect(result).toEqual({
        kind: "active",
        biddingState: { kind: "bidFailed", reason: "An error occurred" },
      })
    })

    it("returns bidBecameMaxBidder when we are the selling bidder", () => {
      const state = makeState({
        lots: new Map([["lot-1", makeLot({ sellingToBidderId: "bidder-me" })]]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "bidBecameMaxBidder" },
      })
    })

    it("returns biddable with price and currency when not winning", () => {
      const state = makeState({
        lots: new Map([
          ["lot-1", makeLot({ askingPriceCents: 100_000_00, sellingToBidderId: "bidder-other" })],
        ]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "biddable", askingPriceCents: 100_000_00, currencySymbol: "$" },
      })
    })

    it("uses currencySymbol from state", () => {
      const state = makeState({ currencySymbol: "€" })
      const result = deriveBidButtonState("lot-1", state)
      expect(result).toEqual({
        kind: "active",
        biddingState: { kind: "biddable", askingPriceCents: 100_000_00, currencySymbol: "€" },
      })
    })

    it("ignores pending bids for other lots", () => {
      const state = makeState({
        pendingBids: new Map([
          [
            "bid-1",
            {
              lotId: "lot-2",
              amountCents: 50000,
              isMaxBid: false,
              status: "pending",
              timestamp: 0,
            },
          ],
        ]),
      })
      expect(deriveBidButtonState("lot-1", state)).toEqual({
        kind: "active",
        biddingState: { kind: "biddable", askingPriceCents: 100_000_00, currencySymbol: "$" },
      })
    })
  })
})
