import { liveAuctionReducer } from "app/Scenes/LiveSale/hooks/useLiveAuctionWebSocket"
import type {
  InitialFullSaleStateMessage,
  LiveAuctionState,
  LiveAuctionAction,
  BidderCredentials,
} from "app/Scenes/LiveSale/types/liveAuction"

describe("liveAuctionReducer - Initial State Parsing", () => {
  const createInitialState = (): LiveAuctionState => ({
    isConnected: false,
    showDisconnectWarning: false,
    currentLotId: null,
    lots: new Map(),
    isOnHold: false,
    onHoldMessage: null,
    operatorConnected: true,
    pendingBids: new Map(),
    saleName: "Test Auction",
    causalitySaleID: "test-sale-id",
    jwt: "test-jwt",
    credentials: {
      bidderId: "bidder-123",
      paddleNumber: "42",
    } as BidderCredentials,
  })

  it("should parse initial state with single lot and events", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: "lot-1",
      fullLotStateById: {
        "lot-1": {
          derivedLotState: {},
          eventHistory: [
            {
              eventId: "event-1",
              type: "LotOpened",
              amountCents: 0,
              createdAt: "2026-01-01T10:00:00Z",
            },
            {
              eventId: "event-2",
              type: "BiddingStarted",
              amountCents: 100000,
              createdAt: "2026-01-01T10:01:00Z",
            },
            {
              eventId: "event-3",
              type: "FirstPriceBidPlaced",
              amountCents: 150000,
              bidder: {
                bidderId: "bidder-456",
                type: "ArtsyBidder",
              },
              createdAt: "2026-01-01T10:02:00Z",
            },
          ],
        },
      },
      operatorConnected: true,
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    // Verify current lot ID
    expect(newState.currentLotId).toBe("lot-1")

    // Verify lot was created
    expect(newState.lots.size).toBe(1)

    // Get the lot
    const lot = newState.lots.get("lot-1")
    expect(lot).toBeDefined()
    expect(lot?.lotId).toBe("lot-1")

    // Verify events were added
    expect(lot?.eventHistory).toHaveLength(3)
    expect(lot?.events.size).toBe(3)

    // Verify events are in correct order
    expect(lot?.eventHistory[0].type).toBe("LotOpened")
    expect(lot?.eventHistory[1].type).toBe("BiddingStarted")
    expect(lot?.eventHistory[2].type).toBe("FirstPriceBidPlaced")

    // Verify processed event IDs
    expect(lot?.processedEventIds.has("event-1")).toBe(true)
    expect(lot?.processedEventIds.has("event-2")).toBe(true)
    expect(lot?.processedEventIds.has("event-3")).toBe(true)

    // Verify derived state
    expect(lot?.derivedState.onlineBidCount).toBe(1)
    expect(lot?.derivedState.biddingStatus).toBe("Open")
    expect(lot?.derivedState.soldStatus).toBe("ForSale")
  })

  it("should parse initial state with multiple lots", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: "lot-2",
      fullLotStateById: {
        "lot-1": {
          derivedLotState: {},
          eventHistory: [
            {
              eventId: "event-1",
              type: "LotSold",
              amountCents: 200000,
              bidder: {
                bidderId: "bidder-123",
                type: "ArtsyBidder",
              },
              createdAt: "2026-01-01T10:00:00Z",
            },
          ],
        },
        "lot-2": {
          derivedLotState: {},
          eventHistory: [
            {
              eventId: "event-2",
              type: "LotOpened",
              amountCents: 0,
              createdAt: "2026-01-01T10:05:00Z",
            },
          ],
        },
      },
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.currentLotId).toBe("lot-2")
    expect(newState.lots.size).toBe(2)

    // Verify first lot is completed
    const lot1 = newState.lots.get("lot-1")
    expect(lot1?.derivedState.biddingStatus).toBe("Complete")
    expect(lot1?.derivedState.soldStatus).toBe("Sold")

    // Verify second lot is open
    const lot2 = newState.lots.get("lot-2")
    expect(lot2?.derivedState.biddingStatus).toBe("Open")
    expect(lot2?.derivedState.soldStatus).toBe("ForSale")
  })

  it("should handle initial state with no current lot", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: null,
      fullLotStateById: {
        "lot-1": {
          derivedLotState: {},
          eventHistory: [],
        },
      },
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.currentLotId).toBeNull()
    expect(newState.lots.size).toBe(1)
  })

  it("should default operator connected to true if not provided", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: null,
      fullLotStateById: {},
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.operatorConnected).toBe(true)
  })

  it("should set operator connected to false when provided", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: null,
      fullLotStateById: {},
      operatorConnected: false,
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.operatorConnected).toBe(false)
  })

  it("should handle sale on hold state", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: null,
      fullLotStateById: {},
      saleOnHold: true,
      saleOnHoldMessage: "Technical difficulties, please wait",
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.isOnHold).toBe(true)
    expect(newState.onHoldMessage).toBe("Technical difficulties, please wait")
  })

  it("should prevent duplicate events when processing initial state", () => {
    const initialState = createInitialState()

    // Initial state with duplicate event IDs (shouldn't happen but we should handle it)
    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: "lot-1",
      fullLotStateById: {
        "lot-1": {
          derivedLotState: {},
          eventHistory: [
            {
              eventId: "event-1",
              type: "LotOpened",
              amountCents: 0,
              createdAt: "2026-01-01T10:00:00Z",
            },
            {
              eventId: "event-1", // Duplicate ID
              type: "BiddingStarted",
              amountCents: 100000,
              createdAt: "2026-01-01T10:01:00Z",
            },
          ],
        },
      },
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    const lot = newState.lots.get("lot-1")

    // Should only have one event since we dedupe by eventId
    expect(lot?.events.size).toBe(1)
    expect(lot?.eventHistory).toHaveLength(1)
    expect(lot?.processedEventIds.size).toBe(1)
  })

  it("should calculate derived state correctly for reserve met", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: "lot-1",
      fullLotStateById: {
        "lot-1": {
          derivedLotState: {},
          eventHistory: [
            {
              eventId: "event-1",
              type: "ReserveMet",
              amountCents: 100000,
              createdAt: "2026-01-01T10:00:00Z",
            },
            {
              eventId: "event-2",
              type: "AskingPriceChanged",
              amountCents: 150000,
              createdAt: "2026-01-01T10:01:00Z",
            },
          ],
        },
      },
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    const lot = newState.lots.get("lot-1")
    expect(lot?.derivedState.reserveStatus).toBe("ReserveMet")
    expect(lot?.derivedState.askingPriceCents).toBe(150000)
  })

  it("should sort events by timestamp", () => {
    const initialState = createInitialState()

    const message: InitialFullSaleStateMessage = {
      type: "InitialFullSaleState",
      currentLotId: "lot-1",
      fullLotStateById: {
        "lot-1": {
          derivedLotState: {},
          eventHistory: [
            {
              eventId: "event-3",
              type: "FirstPriceBidPlaced",
              amountCents: 150000,
              createdAt: "2026-01-01T10:02:00Z",
            },
            {
              eventId: "event-1",
              type: "LotOpened",
              amountCents: 0,
              createdAt: "2026-01-01T10:00:00Z",
            },
            {
              eventId: "event-2",
              type: "BiddingStarted",
              amountCents: 100000,
              createdAt: "2026-01-01T10:01:00Z",
            },
          ],
        },
      },
    }

    const action: LiveAuctionAction = {
      type: "INITIAL_STATE_RECEIVED",
      payload: message,
    }

    const newState = liveAuctionReducer(initialState, action)

    const lot = newState.lots.get("lot-1")

    // Events should be sorted by timestamp
    expect(lot?.eventHistory[0].eventId).toBe("event-1")
    expect(lot?.eventHistory[1].eventId).toBe("event-2")
    expect(lot?.eventHistory[2].eventId).toBe("event-3")
  })
})
