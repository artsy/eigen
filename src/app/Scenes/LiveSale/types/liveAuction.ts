// Live Auction WebSocket Types
// Based on iOS Swift implementation patterns

// ==================== Bidder Credentials ====================
export interface BidderCredentials {
  bidderId: string
  paddleNumber: string
}

// ==================== WebSocket Message Types ====================

// Inbound Messages
export type InboundMessage =
  | InitialFullSaleStateMessage
  | LotUpdateBroadcastMessage
  | SaleLotChangeBroadcastMessage
  | CommandSuccessfulMessage
  | CommandFailedMessage
  | PostEventResponseMessage
  | OperatorConnectedBroadcastMessage
  | SaleOnHoldMessage
  | SaleNotFoundMessage
  | ConnectionUnauthorizedMessage
  | PostEventFailedUnauthorizedMessage

export interface InitialFullSaleStateMessage {
  type: "InitialFullSaleState"
  currentLotId: string | null
  fullLotStateById: Record<string, FullLotStateData>
  operatorConnected?: boolean
  saleOnHold?: boolean
  saleOnHoldMessage?: string | null
}

export interface FullLotStateData {
  derivedLotState: DerivedLotStateData
  eventHistory: LotEvent[]
}

export interface DerivedLotStateData {
  reserveStatus?: string
  askingPriceCents?: number
  biddingStatus?: string
  soldStatus?: string
  onlineBidCount?: number
  winningBidEventId?: string
  // wire sends nested objects: sellingToBidder.bidderId, floorWinningBidder.bidderId
  sellingToBidder?: { bidderId?: string; type?: string }
  floorWinningBidder?: { bidderId?: string; type?: string }
}

export interface LotUpdateBroadcastMessage {
  type: "LotUpdateBroadcast"
  // Wire format: events is a dict keyed by eventId; lotId lives inside each event value
  events: Record<string, LotEvent & { lotId: string }>
  derivedLotState?: DerivedLotStateData
  fullEventOrder?: string[]
}

export interface SaleLotChangeBroadcastMessage {
  type: "SaleLotChangeBroadcast"
  currentLotId: string | null
}

export interface CommandSuccessfulMessage {
  type: "CommandSuccessful"
  key: string // UUID of the bid
}

export interface CommandFailedMessage {
  type: "CommandFailed"
  key: string // UUID of the bid
  message: string
}

export interface PostEventResponseMessage {
  type: "PostEventResponse"
  key: string // UUID of the bid
  status: "success" | "error"
  message?: string
}

export interface OperatorConnectedBroadcastMessage {
  type: "OperatorConnectedBroadcast"
  operatorConnected: boolean
}

export interface SaleOnHoldMessage {
  type: "SaleOnHold"
  onHold: boolean
  message?: string | null
}

export interface SaleNotFoundMessage {
  type: "SaleNotFound"
  message: string
}

export interface ConnectionUnauthorizedMessage {
  type: "ConnectionUnauthorized"
  message: string
}

export interface PostEventFailedUnauthorizedMessage {
  type: "PostEventFailedUnauthorized"
  message: string
}

// Outbound Messages
export type OutboundMessage = AuthorizeMessage | HeartbeatMessage | PostEventMessage

export interface AuthorizeMessage {
  type: "Authorize"
  jwt: string
}

export type HeartbeatMessage = "2"

export interface PostEventMessage {
  key: string // UUID for tracking
  type: "PostEvent"
  event: BidEvent
}

// ==================== Lot Events ====================

export interface LotEvent {
  eventId: string
  type: LotEventType
  amountCents: number
  bidder?: {
    bidderId: string
    type: "ArtsyBidder" | "OfflineBidder"
    paddleNumber?: string // present for ArtsyBidder events (wire key: "paddleNumber")
  }
  createdAt: string // ISO timestamp
  confirmed?: boolean
  // Wire format: nested object `{ eventId: string }` — used by LiveOperatorEventUndone
  // and CompositeOnlineBidConfirmed to reference the target event. Maps to
  // Obj-C JSONKeyPathsByPropertyKey: hostedEventID -> "event.eventId"
  event?: { eventId: string }
}

export type LotEventType =
  | "BiddingOpened" // wire: lot opened for bidding (native uses this)
  | "LotOpened" // legacy alias
  | "BiddingStarted" // legacy alias
  | "FirstPriceBidPlaced"
  | "SecondPriceBidPlaced"
  | "FairWarning"
  | "FinalCall"
  | "BiddingClosed" // wire: lot closed (native uses this)
  | "LotSold" // legacy alias
  | "LotPassed" // legacy alias
  | "ReserveMet"
  | "ReserveNotMet"
  | "BidAccepted"
  | "BidRejected"
  | "AskingPriceChanged"
  | "LiveOperatorEventUndone" // marks a prior event as cancelled
  | "CompositeOnlineBidConfirmed" // confirms a pending bid by amountCents

// ==================== Bid Events (Outbound) ====================

export type BidEvent = FirstPriceBidEvent | SecondPriceBidEvent

export interface FirstPriceBidEvent {
  type: "FirstPriceBidPlaced"
  amountCents: number
  bidder: {
    bidderId: string
    type: "ArtsyBidder"
  }
}

export interface SecondPriceBidEvent {
  type: "SecondPriceBidPlaced"
  maxAmountCents: number
  bidder: {
    bidderId: string
    type: "ArtsyBidder"
  }
}

// ==================== Artwork Metadata ====================

export interface ArtworkMetadata {
  internalID: string
  lotLabel: string | null
  estimate: string | null
  lowEstimateCents: number | null
  highEstimateCents: number | null
  artwork: {
    title: string | null
    artistNames: string | null
    image: {
      aspectRatio: number
      url: string
    } | null
  } | null
}

// ==================== Lot State ====================

export interface LotStateData {
  lotId: string
  events: LotEvent[]
}

export interface LotState {
  lotId: string
  events: Map<string, LotEvent>
  eventHistory: LotEvent[]
  processedEventIds: Set<string>
  derivedState: DerivedLotState
}

export interface DerivedLotState {
  reserveStatus: "NoReserve" | "ReserveMet" | "ReserveNotMet"
  askingPriceCents: number
  biddingStatus: "Open" | "Complete"
  soldStatus: "ForSale" | "Passed" | "Sold"
  onlineBidCount: number
  hasOpenedBidding: boolean
  winningBidEventId?: string
  sellingToBidderId?: string
  floorWinningBidderId?: string
}

// ==================== Registration ====================

export type RegistrationStatus = "registered" | "pending" | "closed" | "unregistered"

// ==================== Event Feed ====================

export type LiveAuctionFeedEventKind = "bid" | "lotOpen" | "finalCall" | "warning" | "closed"

export interface LiveAuctionFeedEvent {
  id: string
  kind: LiveAuctionFeedEventKind
  title: string
  subtitle: string | null
  isMine: boolean
  isTopBid: boolean
  isCancelled: boolean
  isPending: boolean
  createdAt: string
}

// ==================== Bid Button State ====================

export type LiveAuctionBiddingProgressState =
  | { kind: "userRegistrationRequired" }
  | { kind: "userRegistrationPending" }
  | { kind: "userRegistrationClosed" }
  | { kind: "biddable"; askingPriceCents: number; currencySymbol: string }
  | { kind: "biddingInProgress" }
  | { kind: "bidNotYetAccepted"; askingPriceCents: number; currencySymbol: string }
  | { kind: "bidBecameMaxBidder" }
  | { kind: "bidAcknowledged" }
  | { kind: "bidOutbid" }
  | { kind: "bidNetworkFail" }
  | { kind: "bidFailed"; reason: string }
  | { kind: "lotWaitingToOpen" }
  | { kind: "lotSold" }

export type LiveAuctionBidButtonState =
  | { kind: "active"; biddingState: LiveAuctionBiddingProgressState }
  | {
      kind: "inactive"
      lotPhase: "upcoming" | "closedSold" | "closedPassed"
      isHighestBidder?: boolean
    }

// ==================== Pending Bids ====================

export interface PendingBid {
  lotId: string
  amountCents: number
  isMaxBid: boolean
  status: "pending" | "success" | "error"
  timestamp: number
  error?: string
}

// ==================== Main State ====================

export interface LiveAuctionState {
  // Connection
  isConnected: boolean
  showDisconnectWarning: boolean

  // Sale State
  currentLotId: string | null
  lots: Map<string, LotState>
  isOnHold: boolean
  onHoldMessage: string | null
  operatorConnected: boolean

  // Bidding
  pendingBids: Map<string, PendingBid>

  // Static Data
  saleName: string
  causalitySaleID: string
  jwt: string
  credentials: BidderCredentials
  artworkMetadata: Map<string, ArtworkMetadata>
  registrationStatus: RegistrationStatus
  currencySymbol: string
}

// ==================== State Actions ====================

export type LiveAuctionAction =
  | { type: "CONNECTION_OPENED" }
  | { type: "CONNECTION_CLOSED" }
  | { type: "INITIAL_STATE_RECEIVED"; payload: InitialFullSaleStateMessage }
  | {
      type: "LOT_UPDATE_RECEIVED"
      payload: { lotId: string; lotEvents: LotEvent[]; derivedLotState?: DerivedLotStateData }
    }
  | { type: "CURRENT_LOT_CHANGED"; payload: { currentLotId: string | null } }
  | { type: "BID_RESPONSE_RECEIVED"; payload: { key: string; success: boolean; message?: string } }
  | { type: "SALE_ON_HOLD_CHANGED"; payload: { onHold: boolean; message?: string | null } }
  | { type: "OPERATOR_STATUS_CHANGED"; payload: { connected: boolean } }
  | { type: "SHOW_DISCONNECT_WARNING" }
  | { type: "HIDE_DISCONNECT_WARNING" }
  | { type: "BID_PLACED"; payload: { key: string; bid: PendingBid } }

// ==================== Helper Functions ====================

export const createInitialLotState = (lotId: string): LotState => ({
  lotId,
  events: new Map(),
  eventHistory: [],
  processedEventIds: new Set(),
  derivedState: {
    reserveStatus: "NoReserve",
    askingPriceCents: 0,
    biddingStatus: "Open",
    soldStatus: "ForSale",
    onlineBidCount: 0,
    hasOpenedBidding: false,
  },
})

export const calculateDerivedState = (events: Map<string, LotEvent>): DerivedLotState => {
  const eventArray = Array.from(events.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  let reserveStatus: DerivedLotState["reserveStatus"] = "NoReserve"
  let askingPriceCents = 0
  let biddingStatus: DerivedLotState["biddingStatus"] = "Open"
  let soldStatus: DerivedLotState["soldStatus"] = "ForSale"
  let onlineBidCount = 0
  let hasOpenedBidding = false
  let winningBidEventId: string | undefined
  let sellingToBidderId: string | undefined
  let floorWinningBidderId: string | undefined

  for (const event of eventArray) {
    switch (event.type) {
      case "BiddingOpened":
      case "LotOpened":
      case "BiddingStarted":
        hasOpenedBidding = true
        break
      case "ReserveMet":
        reserveStatus = "ReserveMet"
        break
      case "ReserveNotMet":
        reserveStatus = "ReserveNotMet"
        break
      case "AskingPriceChanged":
        askingPriceCents = event.amountCents
        break
      case "FirstPriceBidPlaced":
      case "SecondPriceBidPlaced":
        if (event.bidder?.type === "ArtsyBidder") {
          onlineBidCount++
        }
        winningBidEventId = event.eventId
        sellingToBidderId = event.bidder?.bidderId
        break
      case "BiddingClosed":
      case "LotSold":
        biddingStatus = "Complete"
        soldStatus = "Sold"
        if (event.bidder?.type === "OfflineBidder") {
          floorWinningBidderId = event.bidder.bidderId
        }
        break
      case "LotPassed":
        biddingStatus = "Complete"
        soldStatus = "Passed"
        break
      case "FinalCall":
        break
    }
  }

  return {
    reserveStatus,
    askingPriceCents,
    biddingStatus,
    soldStatus,
    onlineBidCount,
    hasOpenedBidding,
    winningBidEventId,
    sellingToBidderId,
    floorWinningBidderId,
  }
}
