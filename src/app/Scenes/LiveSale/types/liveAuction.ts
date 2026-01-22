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
  sellingToBidderId?: string
  floorWinningBidderId?: string
}

export interface LotUpdateBroadcastMessage {
  type: "LotUpdateBroadcast"
  lotId: string
  lotEvents: LotEvent[]
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
  }
  createdAt: string // ISO timestamp
  confirmed?: boolean
}

export type LotEventType =
  | "LotOpened"
  | "BiddingStarted"
  | "FirstPriceBidPlaced"
  | "SecondPriceBidPlaced"
  | "FairWarning"
  | "FinalCall"
  | "LotSold"
  | "LotPassed"
  | "ReserveMet"
  | "ReserveNotMet"
  | "BidAccepted"
  | "BidRejected"
  | "AskingPriceChanged"

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
  winningBidEventId?: string
  sellingToBidderId?: string
  floorWinningBidderId?: string
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
}

// ==================== State Actions ====================

export type LiveAuctionAction =
  | { type: "CONNECTION_OPENED" }
  | { type: "CONNECTION_CLOSED" }
  | { type: "INITIAL_STATE_RECEIVED"; payload: InitialFullSaleStateMessage }
  | { type: "LOT_UPDATE_RECEIVED"; payload: LotUpdateBroadcastMessage }
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
  let winningBidEventId: string | undefined
  let sellingToBidderId: string | undefined
  let floorWinningBidderId: string | undefined

  for (const event of eventArray) {
    switch (event.type) {
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
        // Lot is about to close
        break
    }
  }

  return {
    reserveStatus,
    askingPriceCents,
    biddingStatus,
    soldStatus,
    onlineBidCount,
    winningBidEventId,
    sellingToBidderId,
    floorWinningBidderId,
  }
}
