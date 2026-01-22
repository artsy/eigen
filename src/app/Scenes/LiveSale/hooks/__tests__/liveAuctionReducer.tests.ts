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
    artworkMetadata: new Map(),
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

describe("liveAuctionReducer - Connection State", () => {
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
    artworkMetadata: new Map(),
  })

  it("should set isConnected to true on CONNECTION_OPENED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "CONNECTION_OPENED",
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.isConnected).toBe(true)
  })

  it("should set isConnected to false on CONNECTION_CLOSED", () => {
    const initialState = { ...createInitialState(), isConnected: true }

    const action: LiveAuctionAction = {
      type: "CONNECTION_CLOSED",
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.isConnected).toBe(false)
  })

  it("should show disconnect warning on SHOW_DISCONNECT_WARNING", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "SHOW_DISCONNECT_WARNING",
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.showDisconnectWarning).toBe(true)
  })

  it("should hide disconnect warning on HIDE_DISCONNECT_WARNING", () => {
    const initialState = { ...createInitialState(), showDisconnectWarning: true }

    const action: LiveAuctionAction = {
      type: "HIDE_DISCONNECT_WARNING",
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.showDisconnectWarning).toBe(false)
  })
})

describe("liveAuctionReducer - Lot Updates", () => {
  const createInitialState = (): LiveAuctionState => ({
    isConnected: true,
    showDisconnectWarning: false,
    currentLotId: "lot-1",
    lots: new Map([
      [
        "lot-1",
        {
          lotId: "lot-1",
          events: new Map(),
          eventHistory: [],
          processedEventIds: new Set(),
          derivedState: {
            reserveStatus: "NoReserve",
            askingPriceCents: 0,
            biddingStatus: "Open",
            soldStatus: "ForSale",
            onlineBidCount: 0,
          },
        },
      ],
    ]),
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
    artworkMetadata: new Map(),
  })

  it("should add new events to existing lot on LOT_UPDATE_RECEIVED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "LOT_UPDATE_RECEIVED",
      payload: {
        type: "LotUpdateBroadcast",
        lotId: "lot-1",
        lotEvents: [
          {
            eventId: "event-1",
            type: "FirstPriceBidPlaced",
            amountCents: 150000,
            bidder: {
              bidderId: "bidder-456",
              type: "ArtsyBidder",
            },
            createdAt: "2026-01-01T10:00:00Z",
          },
        ],
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    const lot = newState.lots.get("lot-1")
    expect(lot?.events.size).toBe(1)
    expect(lot?.eventHistory).toHaveLength(1)
    expect(lot?.derivedState.onlineBidCount).toBe(1)
  })

  it("should create new lot if it doesn't exist on LOT_UPDATE_RECEIVED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "LOT_UPDATE_RECEIVED",
      payload: {
        type: "LotUpdateBroadcast",
        lotId: "lot-2",
        lotEvents: [
          {
            eventId: "event-1",
            type: "LotOpened",
            amountCents: 0,
            createdAt: "2026-01-01T10:00:00Z",
          },
        ],
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.lots.size).toBe(2)
    const lot2 = newState.lots.get("lot-2")
    expect(lot2).toBeDefined()
    expect(lot2?.lotId).toBe("lot-2")
  })

  it("should not add duplicate events on LOT_UPDATE_RECEIVED", () => {
    const initialState = createInitialState()
    const existingEvent = {
      eventId: "event-1",
      type: "LotOpened" as const,
      amountCents: 0,
      createdAt: "2026-01-01T10:00:00Z",
    }

    // Add an existing event
    const lotWithEvent = initialState.lots.get("lot-1")!
    lotWithEvent.events.set("event-1", existingEvent)
    lotWithEvent.eventHistory.push(existingEvent)
    lotWithEvent.processedEventIds.add("event-1")

    const action: LiveAuctionAction = {
      type: "LOT_UPDATE_RECEIVED",
      payload: {
        type: "LotUpdateBroadcast",
        lotId: "lot-1",
        lotEvents: [
          existingEvent, // Same event
          {
            eventId: "event-2",
            type: "BiddingStarted",
            amountCents: 100000,
            createdAt: "2026-01-01T10:01:00Z",
          },
        ],
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    const lot = newState.lots.get("lot-1")
    expect(lot?.events.size).toBe(2)
    expect(lot?.eventHistory).toHaveLength(2)
  })
})

describe("liveAuctionReducer - Current Lot Changes", () => {
  const createInitialState = (): LiveAuctionState => ({
    isConnected: true,
    showDisconnectWarning: false,
    currentLotId: "lot-1",
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
    artworkMetadata: new Map(),
  })

  it("should update current lot ID on CURRENT_LOT_CHANGED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "CURRENT_LOT_CHANGED",
      payload: { currentLotId: "lot-2" },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.currentLotId).toBe("lot-2")
  })

  it("should set current lot ID to null on CURRENT_LOT_CHANGED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "CURRENT_LOT_CHANGED",
      payload: { currentLotId: null },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.currentLotId).toBeNull()
  })
})

describe("liveAuctionReducer - Bidding", () => {
  const createInitialState = (): LiveAuctionState => ({
    isConnected: true,
    showDisconnectWarning: false,
    currentLotId: "lot-1",
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
    artworkMetadata: new Map(),
  })

  it("should add pending bid on BID_PLACED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "BID_PLACED",
      payload: {
        key: "bid-uuid-1",
        bid: {
          lotId: "lot-1",
          amountCents: 150000,
          isMaxBid: false,
          status: "pending",
          timestamp: Date.now(),
        },
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.pendingBids.size).toBe(1)
    const pendingBid = newState.pendingBids.get("bid-uuid-1")
    expect(pendingBid?.status).toBe("pending")
    expect(pendingBid?.amountCents).toBe(150000)
  })

  it("should update pending bid to success on BID_RESPONSE_RECEIVED", () => {
    const initialState = createInitialState()
    initialState.pendingBids.set("bid-uuid-1", {
      lotId: "lot-1",
      amountCents: 150000,
      isMaxBid: false,
      status: "pending",
      timestamp: Date.now(),
    })

    const action: LiveAuctionAction = {
      type: "BID_RESPONSE_RECEIVED",
      payload: {
        key: "bid-uuid-1",
        success: true,
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    const pendingBid = newState.pendingBids.get("bid-uuid-1")
    expect(pendingBid?.status).toBe("success")
    expect(pendingBid?.error).toBeUndefined()
  })

  it("should update pending bid to error on BID_RESPONSE_RECEIVED", () => {
    const initialState = createInitialState()
    initialState.pendingBids.set("bid-uuid-1", {
      lotId: "lot-1",
      amountCents: 150000,
      isMaxBid: false,
      status: "pending",
      timestamp: Date.now(),
    })

    const action: LiveAuctionAction = {
      type: "BID_RESPONSE_RECEIVED",
      payload: {
        key: "bid-uuid-1",
        success: false,
        message: "Bid amount too low",
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    const pendingBid = newState.pendingBids.get("bid-uuid-1")
    expect(pendingBid?.status).toBe("error")
    expect(pendingBid?.error).toBe("Bid amount too low")
  })

  it("should handle BID_RESPONSE_RECEIVED for non-existent bid", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "BID_RESPONSE_RECEIVED",
      payload: {
        key: "non-existent-bid",
        success: true,
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.pendingBids.size).toBe(0)
  })
})

describe("liveAuctionReducer - Sale State", () => {
  const createInitialState = (): LiveAuctionState => ({
    isConnected: true,
    showDisconnectWarning: false,
    currentLotId: "lot-1",
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
    artworkMetadata: new Map(),
  })

  it("should set sale on hold with message on SALE_ON_HOLD_CHANGED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "SALE_ON_HOLD_CHANGED",
      payload: {
        onHold: true,
        message: "Technical difficulties",
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.isOnHold).toBe(true)
    expect(newState.onHoldMessage).toBe("Technical difficulties")
  })

  it("should clear sale on hold state on SALE_ON_HOLD_CHANGED", () => {
    const initialState = {
      ...createInitialState(),
      isOnHold: true,
      onHoldMessage: "Technical difficulties",
    }

    const action: LiveAuctionAction = {
      type: "SALE_ON_HOLD_CHANGED",
      payload: {
        onHold: false,
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.isOnHold).toBe(false)
    expect(newState.onHoldMessage).toBeNull()
  })

  it("should update operator connected status on OPERATOR_STATUS_CHANGED", () => {
    const initialState = createInitialState()

    const action: LiveAuctionAction = {
      type: "OPERATOR_STATUS_CHANGED",
      payload: {
        connected: false,
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.operatorConnected).toBe(false)
  })

  it("should set operator connected to true on OPERATOR_STATUS_CHANGED", () => {
    const initialState = { ...createInitialState(), operatorConnected: false }

    const action: LiveAuctionAction = {
      type: "OPERATOR_STATUS_CHANGED",
      payload: {
        connected: true,
      },
    }

    const newState = liveAuctionReducer(initialState, action)

    expect(newState.operatorConnected).toBe(true)
  })
})
