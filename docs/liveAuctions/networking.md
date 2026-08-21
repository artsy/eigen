# Live Auction Networking

Live auctions use two network layers that serve distinct purposes and must both be understood together.

## Overview

```
App start
  └─ LiveSaleProvider
       ├─ GraphQL (Relay, one-shot)  →  static sale data, credentials, lot metadata
       └─ WebSocket (Causality)      →  real-time auction state, bid submission, responses
```

**GraphQL** provides the data that doesn't change during a sale: lot images, estimates, bidder credentials, bid increment rules. It is fetched once on mount with `fetchPolicy: "network-only"` (bypassing the relay-network-modern 15-min cache — important, since stale credentials would silently break bidding).

**WebSocket** provides everything live: lot state, current lot transitions, bid events, operator status. It is the authoritative source for all auction state after the initial load.

---

## Layer 1: GraphQL (Static Data)

**File:** `src/app/Scenes/LiveSale/LiveSaleProvider.tsx`  
**Query:** `LiveSaleProviderQuery`

### What it fetches

| Field                                 | Purpose                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `sale.internalID`                     | Causality sale ID — used as the WebSocket `?saleId=` param                                                   |
| `sale.currency`                       | Converted to `currencySymbol` for price display                                                              |
| `sale.registrationEndsAt`             | Used to derive `RegistrationStatus` when no bidder record exists                                             |
| `sale.bidIncrements { from, amount }` | Increment rules for the max bid picker (values are in cents)                                                 |
| `sale.saleArtworksConnection`         | Ordered lot list — establishes the canonical lot order and artwork metadata (title, artist, image, estimate) |
| `system.causalityJWT`                 | JWT used to authenticate the WebSocket connection                                                            |
| `me.internalID`                       | `userId` sent in bid event payloads                                                                          |
| `me.paddleNumber`                     | `paddleNumber` sent in bid event payloads                                                                    |
| `me.bidders(saleID)`                  | Used to derive `RegistrationStatus` and extract `bidderId`                                                   |

### Registration status derivation

```ts
// registered  — bidder record exists and qualifiedForBidding = true
// pending     — bidder record exists and qualifiedForBidding = false
// closed      — no bidder record, registration window has passed
// unregistered — no bidder record, registration still open
```

This is computed once from GraphQL and stored in `LiveAuctionState.registrationStatus`. It is never updated by WebSocket events.

### Lot ordering

The WebSocket sends lots by UUID. The canonical display order comes from `saleArtworksConnection` (GraphQL), which returns lots in sale order. `LiveSaleProvider` builds an `artworkMetadata` Map keyed by `saleArtwork.internalID` (a UUID that matches the WebSocket lot IDs). The lot carousel preserves the insertion order of this map.

---

## Layer 2: WebSocket (Real-Time)

**File:** `src/app/Scenes/LiveSale/hooks/useLiveAuctionWebSocket.ts`  
**Protocol:** WebSocket  
**URL:** `{causalityURL}/socket?saleId={causalitySaleID}`

Causality is Artsy's dedicated live auction service. The WebSocket is bidirectional: the client receives auction state broadcasts and sends bid events.

### Connection lifecycle

1. **Connect** — open WebSocket to `{causalityURL}/socket?saleId={internalID}`
2. **Authorize** — immediately send `{ "type": "Authorize", "jwt": "..." }` on open
3. **Receive `InitialFullSaleState`** — server responds with full sale snapshot
4. **Heartbeat** — client sends `"2"` every 1 second to keep the connection alive
5. **Reconnect** — on close, reconnect after 500ms; a disconnect warning banner appears after 1100ms

---

## Inbound Messages (Server → Client)

All messages are JSON. Heartbeat responses (`"3"`) are non-JSON and are ignored.

### `InitialFullSaleState`

Received once after authorization. Contains the full sale snapshot.

```ts
{
  type: "InitialFullSaleState"
  currentLotId: string | null
  fullLotStateById: Record<lotId, {
    derivedLotState: {
      biddingStatus: string       // "Open" | "Complete"
      soldStatus: string          // "ForSale" | "Sold" | "Passed"
      askingPriceCents: number
      sellingToBidder?: { bidderId: string }
      floorWinningBidder?: { bidderId: string }
    }
    eventHistory: LotEvent[]
  }>
  operatorConnected?: boolean
  saleOnHold?: boolean
  saleOnHoldMessage?: string | null
}
```

The reducer reprocesses all events in `eventHistory` to rebuild derived state, then falls back to `derivedLotState` from the server for fields that event history alone can't derive (e.g., lots that were sold before the client connected and have incomplete event history).

### `LotUpdateBroadcast`

Received whenever a lot event occurs (bid placed, lot opened, lot closed, etc.).

```ts
{
  type: "LotUpdateBroadcast"
  events: Record<eventId, LotEvent & { lotId: string }>  // dict keyed by eventId
  derivedLotState?: DerivedLotStateData
}
```

Note: `events` is a dict, not an array. `lotId` lives inside each event value, not at the top level.

### `SaleLotChangeBroadcast`

Sent when the auctioneer moves to a new lot.

```ts
{ type: "SaleLotChangeBroadcast", currentLotId: string | null }
```

### Bid response messages

Three message types can respond to a `PostEvent` bid submission, matched by `key` (the bid UUID):

| Type                  | Meaning                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| `CommandSuccessful`   | Bid accepted                                                             |
| `CommandFailed`       | Bid rejected with `message` reason                                       |
| `PostEventResponse`   | Alternate format — check `status: "success" \| "error"`                  |
| `InvalidMessageReply` | Payload validation failure — `cause` describes the missing/invalid field |

All four are dispatched as `BID_RESPONSE_RECEIVED` and clear the pending bid state.

> **Note:** `InvalidMessageReply` does not always include a `key`. When it doesn't, the pending bid cannot be matched and must be cleared manually. This is a known rough edge.

### Other messages

| Type                          | Meaning                       |
| ----------------------------- | ----------------------------- |
| `OperatorConnectedBroadcast`  | Auctioneer connection status  |
| `SaleOnHold`                  | Sale paused by operator       |
| `SaleNotFound`                | Bad sale ID                   |
| `ConnectionUnauthorized`      | JWT rejected                  |
| `PostEventFailedUnauthorized` | Bid rejected — not authorized |

---

## Lot Events (`LotEvent`)

These arrive inside `LotUpdateBroadcast.events` and `InitialFullSaleState.fullLotStateById[*].eventHistory`. They are the source of truth for derived lot state.

| Event type                                       | Effect on derived state                                    |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `BiddingOpened` / `LotOpened` / `BiddingStarted` | Sets `hasOpenedBidding = true`                             |
| `FirstPriceBidPlaced`                            | Updates `sellingToBidderId`, increments `onlineBidCount`   |
| `SecondPriceBidPlaced`                           | Same as `FirstPriceBidPlaced`                              |
| `AskingPriceChanged`                             | Updates `askingPriceCents`                                 |
| `ReserveMet`                                     | Sets `reserveStatus = "ReserveMet"`                        |
| `ReserveNotMet`                                  | Sets `reserveStatus = "ReserveNotMet"`                     |
| `BiddingClosed` / `LotSold`                      | Sets `biddingStatus = "Complete"`, `soldStatus = "Sold"`   |
| `LotPassed`                                      | Sets `biddingStatus = "Complete"`, `soldStatus = "Passed"` |
| `FairWarning` / `FinalCall`                      | No state change — displayed in event feed only             |
| `LiveOperatorEventUndone`                        | References another event to mark as cancelled              |
| `CompositeOnlineBidConfirmed`                    | Confirms a pending bid by amount                           |

---

## Outbound Messages (Client → Server)

### Authorize

Sent immediately on connect.

```json
{ "type": "Authorize", "jwt": "<causalityJWT>" }
```

### Heartbeat

Sent every 1 second as a raw string (not JSON).

```
"2"
```

### PostEvent (bid submission)

Both live bids and max bids use the same `PostEvent` wrapper. The `key` is a client-generated UUID used to match the server's response.

**Live bid (`FirstPriceBidPlaced`):**

```json
{
  "key": "<uuid>",
  "type": "PostEvent",
  "event": {
    "type": "FirstPriceBidPlaced",
    "lotId": "<lot internalID>",
    "amountCents": 40000,
    "bidder": {
      "type": "ArtsyBidder",
      "bidderId": "<bidder internalID>",
      "paddleNumber": "<paddle>",
      "userId": "<me.internalID>"
    },
    "clientMetadata": { "User-Agent": "Artsy-Mobile iOS" }
  }
}
```

**Max bid (`SecondPriceBidPlaced`):**

Identical structure — note that `amountCents` is used (not `maxAmountCents`).

```json
{
  "key": "<uuid>",
  "type": "PostEvent",
  "event": {
    "type": "SecondPriceBidPlaced",
    "lotId": "<lot internalID>",
    "amountCents": 35000,
    "bidder": { ... same fields ... },
    "clientMetadata": { "User-Agent": "Artsy-Mobile iOS" }
  }
}
```

> **Important:** All four bidder fields (`bidderId`, `paddleNumber`, `userId`, `type`) are required. The server returns `InvalidMessageReply` if any are absent. The `lotId` field inside `event` is also required — without it the server cannot route the bid.

---

## Bid Submission Flow

```
User taps "Bid $400"
  └─ placeBid(lotId, 40000, isMaxBid=false)
       ├─ generate bidUUID
       ├─ dispatch BID_PLACED → pendingBids.set(bidUUID, { status: "pending", ... })
       │    └─ deriveBidButtonState sees pending bid → returns biddingInProgress → spinner shown
       ├─ ws.send(PostEvent JSON)
       └─ server responds...
            ├─ CommandSuccessful / CommandFailed / PostEventResponse
            │    └─ dispatch BID_RESPONSE_RECEIVED → pendingBids.set(key, { status: "success"|"error" })
            │         └─ after 2s, pendingBids.delete(key) [⚠ see known issue below]
            └─ InvalidMessageReply (payload rejected)
                 └─ dispatch BID_RESPONSE_RECEIVED with success=false using cause as message
```

### Known issue: pending bid cleanup

The reducer currently uses `setTimeout(() => newPendingBids.delete(key), 2000)` inside the reducer after setting state. This mutates the Map already in state but does not trigger a re-render because the Map reference is unchanged. The `success` status pending bid therefore stays in state past the 2-second window. In practice this is benign — `deriveBidButtonState` only checks for `"pending"` and `"error"` statuses, not `"success"` — but it is a latent bug worth fixing with a proper `CLEAR_PENDING_BID` action dispatched via `setTimeout` from a `useEffect`.

---

## Bid Increment Calculation

Max bid amounts are computed client-side from `sale.bidIncrements` rules fetched via GraphQL. Each rule is `{ from: number, amount: number }` (both in cents). The algorithm:

1. Start at current `askingPriceCents`
2. Find the rule with the highest `from` value ≤ current price
3. Add that rule's `amount` to get the next valid bid
4. Repeat up to 20 times

This mirrors `minimumNextBidCentsIncrement` in `LiveAuctionBidViewModel.swift`.

**File:** `src/app/Scenes/LiveSale/utils/bidIncrements.ts`

---

## State Management

All WebSocket state lives in `LiveAuctionState` (see `types/liveAuction.ts`) and is managed by `liveAuctionReducer`. The full state is exposed to the component tree via `LiveAuctionContext`.

Static fields (set once from GraphQL, never updated by reducer):

- `saleName`, `saleSlug`, `causalitySaleID`, `jwt`
- `credentials` (`bidderId`, `paddleNumber`, `userId`)
- `artworkMetadata` (lot display data — images, estimates, labels)
- `registrationStatus`
- `currencySymbol`
- `bidIncrements`

Dynamic fields (updated by reducer actions):

- `isConnected`, `showDisconnectWarning`
- `currentLotId`
- `lots` — Map of lotId → `LotState` (events + derived state)
- `pendingBids` — Map of bidUUID → `PendingBid`
- `isOnHold`, `onHoldMessage`, `operatorConnected`

---

## Source Files

| File                                                                     | Role                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------ |
| `src/app/Scenes/LiveSale/LiveSaleProvider.tsx`                           | GraphQL fetch, credential derivation, context provider |
| `src/app/Scenes/LiveSale/hooks/useLiveAuctionWebSocket.ts`               | WebSocket lifecycle, reducer, `placeBid`               |
| `src/app/Scenes/LiveSale/types/liveAuction.ts`                           | All types — state, actions, message shapes, bid events |
| `src/app/Scenes/LiveSale/utils/bidIncrements.ts`                         | Bid increment computation                              |
| `src/app/Scenes/LiveSale/hooks/useLiveAuction.ts`                        | Context accessor hook                                  |
| `ios/Artsy/Networking/Live_Auctions/LiveAuctionSocketCommunicator.swift` | Native reference implementation                        |
