# Live Auction Bid Button States

The bid button responds to websocket events and renders differently depending on the state of both the lot and the sale. State is a two-level structure: an outer `LiveAuctionBidButtonState` with an inner state for each branch.

## `.active` — lot is currently live

These states come from `LiveAuctionBiddingProgressState` (`LiveAuctionBidViewModel.swift`):

| State                                            | Label                                               | Tappable | Notes                                                                                        |
| ------------------------------------------------ | --------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `userRegistrationRequired`                       | "Register To Bid"                                   | Yes      | Triggers registration flow                                                                   |
| `userRegistrationPending`                        | "Registration Pending"                              | No       | —                                                                                            |
| `userRegistrationClosed`                         | "Registration Closed"                               | No       | —                                                                                            |
| `lotWaitingToOpen`                               | "Waiting for Auctioneer…"                           | No       | Lot is live but auctioneer hasn't opened bidding yet                                         |
| `biddable(askingPrice, currencySymbol)`          | "Bid $X,XXX"                                        | Yes      | Normal biddable state; triggers outbid animation if transitioning from max bidder            |
| `biddingInProgress`                              | _(spinner)_                                         | No       | After tapping bid, waiting for server confirmation                                           |
| `bidNotYetAccepted(askingPrice, currencySymbol)` | "Bid $X,XXX" (grey)                                 | No       | User is being sold to on the floor but not yet confirmed as max bidder                       |
| `bidAcknowledged`                                | "You're currently the highest bidder" (white/green) | No       | Treated identically to `bidBecameMaxBidder` in the UI                                        |
| `bidBecameMaxBidder`                             | "You're currently the highest bidder" (white/green) | No       | —                                                                                            |
| `bidOutbid`                                      | "Outbid" (red)                                      | No       | Transient animation state — auto-transitions back to `biddable`                              |
| `bidNetworkFail`                                 | "Network Failed"                                    | No       | —                                                                                            |
| `bidFailed(reason)`                              | "An Error Occurred" (red)                           | No       | Auto-transitions back to previous state after 2s; hides button instead if `hideOnError=true` |
| `lotSold`                                        | "Sold" (purple)                                     | No       | —                                                                                            |

## `.inActive` — lot is not currently live

These states come from `LotState` (`LiveAuctionLotViewModel.swift`):

| State                                 | Label               | Tappable | Notes                                           |
| ------------------------------------- | ------------------- | -------- | ----------------------------------------------- |
| `upcomingLot(isHighestBidder: false)` | "Bid"               | Yes      | Triggers max-bid flow                           |
| `upcomingLot(isHighestBidder: true)`  | "Increase Max Bid"  | Yes      | User already has a max bid on this upcoming lot |
| `closedLot(wasPassed: false)`         | "Sold" (purple)     | No       | —                                               |
| `closedLot(wasPassed: true)`          | "Lot Closed" (grey) | No       | Lot passed without selling                      |

## Special behaviors

**Outbid animation** — transitioning from `bidBecameMaxBidder` or `bidNotYetAccepted` → `biddable` triggers a brief "Outbid" animation. Any state updates received during the animation are queued and applied once it completes. Controlled by `flashOutbidOnBiddableStateChanges` (disabled on the max-bid modal).

**`hideOnError`** — the `bidFailed` state either shows the error button or hides the button entirely. The lot view controller shows it; the max-bid overlay hides it.

**`bidAcknowledged` vs `bidBecameMaxBidder`** — these are distinct enum cases but render identically. Both transition back to `biddable` (with an outbid animation) when the user is outbid.

**State priority** (from `LiveAuctionBiddingViewModel.stateToBidButtonState`) — when computing button state from lot + auction state:

1. Closed lot always shows as closed
2. Registration closed (if not registered)
3. Registration pending
4. Registration required (if not registered)
5. Upcoming lot (live lot waiting to open, or pre-sale)
6. Live lot (biddable / selling-to-me states)

## Source files

- `ios/Artsy/View_Controllers/Live_Auctions/LiveAuctionBidButton.swift` — button UI and animation logic
- `ios/Artsy/View_Controllers/Live_Auctions/LiveAuctionBidViewModel.swift` — `LiveAuctionBiddingProgressState` enum
- `ios/Artsy/View_Controllers/Live_Auctions/Views/LiveAuctionBiddingViewModel.swift` — maps lot/auction signals → button state
- `ios/Artsy/View_Controllers/Live_Auctions/ViewModels/LiveAuctionLotViewModel.swift` — `LotState` enum
- `ios/ArtsyTests/View_Controller_Tests/Live_Auction/LiveAuctionBidButtonTests.swift` — snapshot tests covering all states
