# Live Auction Bid Button — Implementation Plan

Porting `LiveAuctionBidButton.swift` to React Native. See `bid_button_states.md` for the full state reference.

## What already exists

- Full WebSocket state management in `src/app/Scenes/LiveSale/hooks/useLiveAuctionWebSocket.ts`
- Comprehensive TypeScript types in `src/app/Scenes/LiveSale/types/liveAuction.ts`
- `LiveAuctionContext` providing all lot and sale state to the tree
- The current bid button in `LiveLotCarouselCard` is a placeholder — only handles "Place Bid", "Sold", "Passed"

## Steps

### 1. Add button state types to `types/liveAuction.ts`

Two new discriminated unions mirroring the Swift enums:

```ts
type LiveAuctionBiddingProgressState =
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

type LiveAuctionBidButtonState =
  | { kind: "active"; biddingState: LiveAuctionBiddingProgressState }
  | {
      kind: "inactive"
      lotPhase: "upcoming" | "closedSold" | "closedPassed"
      isHighestBidder?: boolean
    }
```

Also add a `RegistrationStatus` type and field to `LiveAuctionState`:

```ts
type RegistrationStatus = "registered" | "pending" | "closed" | "unregistered"
```

### 2. Update `LiveSaleProviderQuery` to fetch registration data

Add `qualifiedForBidding` to the existing `me.bidders` fetch, and add `registrationEndsAt` to the sale:

```graphql
sale {
  registrationEndsAt
}
me {
  bidders(saleID: $saleID) {
    internalID
    qualifiedForBidding  # add this
  }
}
```

Derive `RegistrationStatus` from this data before passing to the WebSocket hook:

- `bidders` non-empty && `qualifiedForBidding == true` → `"registered"`
- `bidders` non-empty && `qualifiedForBidding == false` → `"pending"`
- `bidders` empty && `now > registrationEndsAt` → `"closed"`
- `bidders` empty && `now <= registrationEndsAt` → `"unregistered"`

Store as `registrationStatus: RegistrationStatus` on `LiveAuctionState`. Set once from GraphQL; never updated by WebSocket.

> **Note — possible future improvement:** The GraphQL `Sale` type has a `registrationStatus: Bidder` field that is purpose-built for this use case (`sale.registrationStatus.qualifiedForBidding`). We deliberately matched the native iOS implementation here (which uses `me.bidders(saleID).qualifiedForBidding`) rather than switching to this field, because it's unclear whether native had a reason to avoid it or whether the field simply didn't exist at the time. Worth revisiting — using `sale.registrationStatus` would simplify the query and remove the need for `registrationEndsAt` date comparison.

### 3. New hook: `hooks/useLiveAuctionBidButtonState.ts`

Pure function `(lotId: string, state: LiveAuctionState) => LiveAuctionBidButtonState`.

Mirrors `LiveAuctionBiddingViewModel.stateToBidButtonState` in Swift. Priority order (same as native):

1. Closed lot → always `inactive`
2. Registration closed (if not registered) → `active: userRegistrationClosed`
3. Registration pending → `active: userRegistrationPending`
4. Registration required → `active: userRegistrationRequired`
5. Upcoming lot that is the current lot (waiting for auctioneer) → `active: lotWaitingToOpen`
6. Upcoming lot that is not the current lot → `inactive: upcoming`
7. Live lot — derive from `DerivedLotState` and `pendingBids`:
   - Pending bid with status `"pending"` → `biddingInProgress`
   - Pending bid with status `"error"` → `bidFailed` or `bidNetworkFail`
   - `sellingToBidderId === myBidderId && floorWinningBidderId === myBidderId` → `bidBecameMaxBidder`
   - `sellingToBidderId === myBidderId` → `bidNotYetAccepted`
   - Otherwise → `biddable`

### 4. New component: `components/LiveAuctionBidButton/LiveAuctionBidButton.tsx`

```ts
interface LiveAuctionBidButtonProps {
  buttonState: LiveAuctionBidButtonState
  onPress: (action: "bid" | "registerToBid" | "submitMaxBid") => void
  flashOutbidOnBiddableStateChanges?: boolean // default true — set false on max-bid modal
  hideOnError?: boolean // default false — set true on max-bid modal
}
```

State → UI mapping:

| State                                     | Label                       | Variant        | Disabled        |
| ----------------------------------------- | --------------------------- | -------------- | --------------- |
| `userRegistrationRequired`                | "Register to Bid"           | fill/black     | No              |
| `userRegistrationPending`                 | "Registration Pending"      | fill/black     | Yes             |
| `userRegistrationClosed`                  | "Registration Closed"       | fill/black     | Yes             |
| `lotWaitingToOpen`                        | "Waiting for Auctioneer…"   | outline/grey   | Yes             |
| `biddable`                                | "Bid $X,XXX"                | fill/black     | No              |
| `biddingInProgress`                       | _(spinner)_                 | fill/purple    | Yes             |
| `bidNotYetAccepted`                       | "Bid $X,XXX"                | fill/grey      | Yes             |
| `bidBecameMaxBidder` / `bidAcknowledged`  | "You're the Highest Bidder" | outline/green  | Yes             |
| `bidOutbid`                               | "Outbid"                    | fill/red       | Yes             |
| `bidNetworkFail`                          | "Network Failed"            | outline/red    | Yes             |
| `bidFailed`                               | "An Error Occurred"         | fill/red       | Yes (or hidden) |
| `lotSold`                                 | "Sold"                      | outline/purple | Yes             |
| `inactive: upcoming` (not highest bidder) | "Bid"                       | fill/black     | No              |
| `inactive: upcoming` (highest bidder)     | "Increase Max Bid"          | fill/black     | No              |
| `inactive: closedSold`                    | "Sold"                      | outline/purple | Yes             |
| `inactive: closedPassed`                  | "Lot Closed"                | outline/grey   | Yes             |

Special behaviors (matching native):

- **Outbid animation:** `bidBecameMaxBidder` → `biddable` triggers a brief "Outbid" flash before settling. Any state updates received during animation are queued and applied after. Controlled by `flashOutbidOnBiddableStateChanges`.
- **`bidFailed` auto-revert:** reverts to previous state after 2s unless `hideOnError=true`, in which case the button is hidden.
- **`bidAcknowledged` and `bidBecameMaxBidder`** render identically.

### 5. Tests: `hooks/__tests__/useLiveAuctionBidButtonState.tests.ts`

- All `inactive` states from lot data
- All `active` states
- Priority ordering (closed > registration states > live lot states)
- Pending bid drives `biddingInProgress` / error states
- `sellingToBidderId` + `floorWinningBidderId` combination → `bidBecameMaxBidder` vs `bidNotYetAccepted`

### 6. Tests: `components/LiveAuctionBidButton/__tests__/LiveAuctionBidButton.tests.tsx`

- Render test for every state (matches Swift snapshot test coverage)
- Tap handlers: correct `action` fires for `userRegistrationRequired`, `biddable`, `upcomingLot`
- Outbid animation: `bidBecameMaxBidder` → `biddable` queues biddable state until animation completes
- State received mid-animation is applied after, not dropped
- `hideOnError=true` hides button on `bidFailed`
- `bidFailed` auto-reverts after 2s

## File checklist

- [ ] `src/app/Scenes/LiveSale/types/liveAuction.ts` — add `LiveAuctionBidButtonState`, `LiveAuctionBiddingProgressState`, `RegistrationStatus`; extend `LiveAuctionState`
- [ ] `src/app/Scenes/LiveSale/LiveSaleProvider.tsx` — add `qualifiedForBidding` + `registrationEndsAt` to query; derive and pass `registrationStatus`
- [ ] `src/app/Scenes/LiveSale/hooks/useLiveAuctionBidButtonState.ts` — new hook
- [ ] `src/app/Scenes/LiveSale/hooks/__tests__/useLiveAuctionBidButtonState.tests.ts` — new tests
- [ ] `src/app/Scenes/LiveSale/components/LiveAuctionBidButton/LiveAuctionBidButton.tsx` — new component
- [ ] `src/app/Scenes/LiveSale/components/LiveAuctionBidButton/__tests__/LiveAuctionBidButton.tests.tsx` — new tests
- [ ] `src/app/Scenes/LiveSale/components/LiveLotCarouselCard.tsx` — replace placeholder button with `LiveAuctionBidButton`
