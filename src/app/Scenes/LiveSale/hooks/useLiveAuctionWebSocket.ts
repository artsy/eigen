import { createInitialLotState, calculateDerivedState } from "app/Scenes/LiveSale/types/liveAuction"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { useEffect, useReducer, useRef, useCallback } from "react"
import type {
  ArtworkMetadata,
  BidderCredentials,
  InboundMessage,
  LiveAuctionAction,
  LiveAuctionState,
  LotState,
  PendingBid,
  AuthorizeMessage,
  PostEventMessage,
  FirstPriceBidEvent,
  SecondPriceBidEvent,
} from "app/Scenes/LiveSale/types/liveAuction"

// ==================== State Reducer ====================

export const initialState: Omit<
  LiveAuctionState,
  "saleName" | "causalitySaleID" | "jwt" | "credentials" | "artworkMetadata"
> = {
  isConnected: false,
  showDisconnectWarning: false,
  currentLotId: null,
  lots: new Map(),
  isOnHold: false,
  onHoldMessage: null,
  operatorConnected: true,
  pendingBids: new Map(),
}

export const liveAuctionReducer = (
  state: LiveAuctionState,
  action: LiveAuctionAction
): LiveAuctionState => {
  switch (action.type) {
    case "CONNECTION_OPENED":
      return {
        ...state,
        isConnected: true,
      }

    case "CONNECTION_CLOSED":
      return {
        ...state,
        isConnected: false,
      }

    case "SHOW_DISCONNECT_WARNING":
      return {
        ...state,
        showDisconnectWarning: true,
      }

    case "HIDE_DISCONNECT_WARNING":
      return {
        ...state,
        showDisconnectWarning: false,
      }

    case "INITIAL_STATE_RECEIVED": {
      const { currentLotId, fullLotStateById, operatorConnected, saleOnHold, saleOnHoldMessage } =
        action.payload

      const newLots = new Map<string, LotState>()

      // Process each lot from the fullLotStateById object
      for (const [lotId, fullLotState] of Object.entries(fullLotStateById)) {
        const lotState = createInitialLotState(lotId)

        // Add events from eventHistory and track processed IDs
        for (const event of fullLotState.eventHistory) {
          if (!lotState.processedEventIds.has(event.eventId)) {
            lotState.events.set(event.eventId, event)
            lotState.eventHistory.push(event)
            lotState.processedEventIds.add(event.eventId)
          }
        }

        // Sort event history by timestamp
        lotState.eventHistory.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

        // Calculate derived state from events
        lotState.derivedState = calculateDerivedState(lotState.events)

        newLots.set(lotId, lotState)
      }

      return {
        ...state,
        currentLotId,
        lots: newLots,
        operatorConnected: operatorConnected ?? true,
        isOnHold: saleOnHold ?? false,
        onHoldMessage: saleOnHoldMessage ?? null,
      }
    }

    case "LOT_UPDATE_RECEIVED": {
      const { lotId, lotEvents } = action.payload
      const newLots = new Map(state.lots)
      let lotState = newLots.get(lotId)

      if (!lotState) {
        // Create new lot if it doesn't exist
        lotState = createInitialLotState(lotId)
        newLots.set(lotId, lotState)
      } else {
        // Clone existing lot state
        lotState = {
          ...lotState,
          events: new Map(lotState.events),
          eventHistory: [...lotState.eventHistory],
          processedEventIds: new Set(lotState.processedEventIds),
        }
      }

      // Add new events
      let hasNewEvents = false
      for (const event of lotEvents) {
        if (!lotState.processedEventIds.has(event.eventId)) {
          lotState.events.set(event.eventId, event)
          lotState.eventHistory.push(event)
          lotState.processedEventIds.add(event.eventId)
          hasNewEvents = true
        }
      }

      if (hasNewEvents) {
        // Sort event history
        lotState.eventHistory.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

        // Recalculate derived state
        lotState.derivedState = calculateDerivedState(lotState.events)

        // Update the lot in the map
        newLots.set(lotId, lotState)
      }

      return {
        ...state,
        lots: newLots,
      }
    }

    case "CURRENT_LOT_CHANGED":
      return {
        ...state,
        currentLotId: action.payload.currentLotId,
      }

    case "BID_PLACED": {
      const { key, bid } = action.payload
      const newPendingBids = new Map(state.pendingBids)
      newPendingBids.set(key, bid)
      return {
        ...state,
        pendingBids: newPendingBids,
      }
    }

    case "BID_RESPONSE_RECEIVED": {
      const { key, success, message } = action.payload
      const newPendingBids = new Map(state.pendingBids)
      const pendingBid = newPendingBids.get(key)

      if (pendingBid) {
        // Update the bid status
        newPendingBids.set(key, {
          ...pendingBid,
          status: success ? "success" : "error",
          error: success ? undefined : message,
        })

        // Remove after a short delay to show success/error state
        setTimeout(() => {
          newPendingBids.delete(key)
        }, 2000)
      }

      return {
        ...state,
        pendingBids: newPendingBids,
      }
    }

    case "SALE_ON_HOLD_CHANGED":
      return {
        ...state,
        isOnHold: action.payload.onHold,
        onHoldMessage: action.payload.message ?? null,
      }

    case "OPERATOR_STATUS_CHANGED":
      return {
        ...state,
        operatorConnected: action.payload.connected,
      }

    default:
      return state
  }
}

// ==================== Helper Functions ====================

const generateUUID = (): string => {
  // Simple UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const getWebSocketURL = (causalitySaleID: string): string => {
  const env = unsafe__getEnvironment()
  const host = env.causalityURL

  return `${host}/socket?saleId=${causalitySaleID}`
}

// ==================== Hook ====================

interface UseLiveAuctionWebSocketParams {
  jwt: string
  saleID: string
  saleName: string
  credentials: BidderCredentials
  artworkMetadata: Map<string, ArtworkMetadata>
}

export const useLiveAuctionWebSocket = ({
  jwt,
  saleID,
  saleName,
  credentials,
  artworkMetadata,
}: UseLiveAuctionWebSocketParams) => {
  const [state, dispatch] = useReducer(liveAuctionReducer, {
    ...initialState,
    saleName,
    causalitySaleID: saleID,
    jwt,
    credentials,
    artworkMetadata,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const disconnectWarningRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isConnectingRef = useRef(false)

  // Clear disconnect warning timer
  const clearDisconnectWarning = useCallback(() => {
    if (disconnectWarningRef.current) {
      clearTimeout(disconnectWarningRef.current)
      disconnectWarningRef.current = null
    }
    dispatch({ type: "HIDE_DISCONNECT_WARNING" })
  }, [])

  // Start disconnect warning timer
  const startDisconnectWarning = useCallback(() => {
    clearDisconnectWarning()
    disconnectWarningRef.current = setTimeout(() => {
      dispatch({ type: "SHOW_DISCONNECT_WARNING" })
    }, 1100)
  }, [clearDisconnectWarning])

  // Handle incoming messages
  const handleMessage = useCallback((event: WebSocketMessageEvent) => {
    try {
      // Check if it's a heartbeat response or other non-JSON message
      if (typeof event.data === "string" && !event.data.startsWith("{")) {
        // Ignore heartbeat responses
        return
      }

      const message: InboundMessage = JSON.parse(event.data as string)

      switch (message.type) {
        case "InitialFullSaleState":
          dispatch({ type: "INITIAL_STATE_RECEIVED", payload: message })
          break

        case "LotUpdateBroadcast":
          dispatch({ type: "LOT_UPDATE_RECEIVED", payload: message })
          break

        case "SaleLotChangeBroadcast":
          dispatch({
            type: "CURRENT_LOT_CHANGED",
            payload: { currentLotId: message.currentLotId },
          })
          break

        case "CommandSuccessful":
          dispatch({
            type: "BID_RESPONSE_RECEIVED",
            payload: { key: message.key, success: true },
          })
          break

        case "CommandFailed":
          dispatch({
            type: "BID_RESPONSE_RECEIVED",
            payload: { key: message.key, success: false, message: message.message },
          })
          break

        case "PostEventResponse":
          dispatch({
            type: "BID_RESPONSE_RECEIVED",
            payload: {
              key: message.key,
              success: message.status === "success",
              message: message.message,
            },
          })
          break

        case "OperatorConnectedBroadcast":
          dispatch({
            type: "OPERATOR_STATUS_CHANGED",
            payload: { connected: message.operatorConnected },
          })
          break

        case "SaleOnHold":
          dispatch({
            type: "SALE_ON_HOLD_CHANGED",
            payload: { onHold: message.onHold, message: message.message },
          })
          break

        case "SaleNotFound":
        case "ConnectionUnauthorized":
        case "PostEventFailedUnauthorized":
          // Handle errors - could show error message to user
          console.error(`Live auction error: ${message.type}`, message)
          break

        default:
          // Unknown message type
          console.warn("Unknown message type:", message)
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  }, [])

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
    }

    heartbeatRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send("2")
      }
    }, 1000)
  }, [])

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
  }, [])

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    isConnectingRef.current = true

    try {
      const url = getWebSocketURL(saleID)
      const ws = new WebSocket(url)

      ws.onopen = () => {
        isConnectingRef.current = false
        dispatch({ type: "CONNECTION_OPENED" })
        clearDisconnectWarning()

        // Send authorization message
        const authMessage: AuthorizeMessage = {
          type: "Authorize",
          jwt,
        }
        ws.send(JSON.stringify(authMessage))

        // Start heartbeat
        startHeartbeat()
      }

      ws.onmessage = handleMessage

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        isConnectingRef.current = false
      }

      ws.onclose = () => {
        isConnectingRef.current = false
        dispatch({ type: "CONNECTION_CLOSED" })
        stopHeartbeat()
        startDisconnectWarning()

        // Reconnect after 500ms
        if (reconnectRef.current) {
          clearTimeout(reconnectRef.current)
        }
        reconnectRef.current = setTimeout(() => {
          connect()
        }, 500)
      }

      wsRef.current = ws
    } catch (error) {
      console.error("Error creating WebSocket:", error)
      isConnectingRef.current = false

      // Retry connection
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }
      reconnectRef.current = setTimeout(() => {
        connect()
      }, 500)
    }
  }, [
    saleID,
    jwt,
    handleMessage,
    startHeartbeat,
    stopHeartbeat,
    clearDisconnectWarning,
    startDisconnectWarning,
  ])

  // Disconnect
  const disconnect = useCallback(() => {
    stopHeartbeat()
    clearDisconnectWarning()

    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current)
      reconnectRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [stopHeartbeat, clearDisconnectWarning])

  // Place bid
  const placeBid = useCallback(
    (lotId: string, amountCents: number, isMaxBid = false) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.error("Cannot place bid: WebSocket not connected")
        return
      }

      const bidUUID = generateUUID()
      const pendingBid: PendingBid = {
        lotId,
        amountCents,
        isMaxBid,
        status: "pending",
        timestamp: Date.now(),
      }

      // Add to pending bids
      dispatch({ type: "BID_PLACED", payload: { key: bidUUID, bid: pendingBid } })

      // Create bid event
      const bidEvent: FirstPriceBidEvent | SecondPriceBidEvent = isMaxBid
        ? {
            type: "SecondPriceBidPlaced",
            maxAmountCents: amountCents,
            bidder: {
              bidderId: credentials.bidderId,
              type: "ArtsyBidder",
            },
          }
        : {
            type: "FirstPriceBidPlaced",
            amountCents,
            bidder: {
              bidderId: credentials.bidderId,
              type: "ArtsyBidder",
            },
          }

      const message: PostEventMessage = {
        key: bidUUID,
        type: "PostEvent",
        event: bidEvent,
      }

      wsRef.current.send(JSON.stringify(message))
    },
    [credentials]
  )

  // Connect on mount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    ...state,
    placeBid,
  }
}

// Type for the return value
export type LiveAuctionWebSocketReturn = ReturnType<typeof useLiveAuctionWebSocket>
