import Foundation
import Interstellar

enum BidProgressStatus {
    case started
    case completed(success: Bool, event: LiveEvent, error: Error?)
}

protocol LiveAuctionBiddingViewModelType {
    var progressSignal: Observable<LiveAuctionBidButtonState> { get }
    var bidPendingSignal: Observable<LiveAuctionBiddingProgressState> { get }
}

class LiveAuctionBiddingViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal: Observable<LiveAuctionBidButtonState>
    let bidPendingSignal = Observable<LiveAuctionBiddingProgressState>()

    fileprivate let _lotStateSubscription: ObserverToken<LotState>
    fileprivate let _askingPriceSubscription: ObserverToken<UInt64>
    fileprivate let _currentLotSubscription: ObserverToken<LiveAuctionLotViewModelType?>
    fileprivate let _newLotEventsSubscription: ObserverToken<[LiveAuctionEventViewModel]>

    // Copies of observables that will be deallocated when we are.
    fileprivate let _lotState = Observable<LotState>()
    fileprivate let _askingPrice = Observable<UInt64>()
    fileprivate let _currentLot = Observable<LiveAuctionLotViewModelType?>()
    fileprivate let _newLotEventsSignal = Observable<[LiveAuctionEventViewModel]>([LiveAuctionEventViewModel(event: LiveEvent(), currencySymbol: "")])
    // _newLotEventSignal is different; every lot has a state asking price, and there's a default nil current lot. But not every lot has an event yet,
    // so we need to "prime" the _newLotEventSignal with a dummy lot event (the values from _newLotEventSignal are completely ignored anyway).


    init(currencySymbol: String, lotViewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType) {
        // Okay, so what's all this then?? Well, we need to merge several signals together, but due to Interstellar's garbage collection model of unsubscribing, we can't unsubscribe from a merged signal.
        // So instead, we create private "copies" of the signals, bound to the originals but with subscriptions we can get rid of when we're deallocated (so merging these is fine).
        self._lotStateSubscription = lotViewModel.lotStateSignal.subscribe(_lotState.update)
        self._askingPriceSubscription = lotViewModel.askingPriceSignal.subscribe(_askingPrice.update)
        self._currentLotSubscription = auctionViewModel.currentLotSignal.subscribe(_currentLot.update)
        self._newLotEventsSubscription = lotViewModel.newEventsSignal.subscribe(_newLotEventsSignal.update)

        progressSignal = _lotState
            .merge(_askingPrice)
            .merge(_currentLot)
            .merge(_newLotEventsSignal)
            .map { tuple -> (lotState: LotState, askingPrice: UInt64, currentLot: LiveAuctionLotViewModelType?) in
                // Merging more than two Observables in Interstellar gets really messy, we're mapping from that mess into a nice tuple with named elements.
                return (lotState: tuple.0.0.0, askingPrice: tuple.0.0.1, currentLot: tuple.0.1)
            }
            .map(LiveAuctionBiddingViewModel.stateToBidButtonState(currencySymbol, lotID: lotViewModel.lotID, auctionViewModel: auctionViewModel))
    }

    deinit {
        _lotStateSubscription.unsubscribe()
        _askingPriceSubscription.unsubscribe()
        _currentLotSubscription.unsubscribe()
    }

    // This is extracted into its own method because it's messy. It's curried to have access to the lotID.
    class func stateToBidButtonState(_ currencySymbol: String, lotID: String, auctionViewModel: LiveAuctionViewModelType)
                -> (_ state: (lotState: LotState, askingPrice: UInt64, currentLot: LiveAuctionLotViewModelType?))
                -> LiveAuctionBidButtonState {

        return { state in
            let userIsRegistered = auctionViewModel.auctionState.contains(.userIsRegistered)
            let userRegistrationPending = auctionViewModel.auctionState.contains(.userPendingRegistration)
            let registrationIsClosed = auctionViewModel.auctionState.contains(.userRegistrationClosed)

            // This switch represents a priority of what states matter more than others.
            // For example: a closed lot is always shown as closed, regardless of bidder registration.
            // And if a registration is pending, we show that, etc.
            switch state.lotState {
            case .closedLot:
                return .inActive(lotState: state.lotState)

            case _ where !userIsRegistered && registrationIsClosed:
                return .active(biddingState: LiveAuctionBiddingProgressState.userRegistrationClosed)

            case _ where userRegistrationPending:
                return .active(biddingState: LiveAuctionBiddingProgressState.userRegistrationPending)

            case _ where !userIsRegistered:
                return .active(biddingState: LiveAuctionBiddingProgressState.userRegistrationRequired)

            case .upcomingLot:
                if lotID == state.currentLot?.lotID {
                    return .active(biddingState: .lotWaitingToOpen)
                } else {
                    return .inActive(lotState: state.lotState)
                }

            case .liveLot:
                let biddingState: LiveAuctionBiddingProgressState

                let isSellingToMe = state.currentLot?.userIsBeingSoldTo ?? false
                let isFloorWinningBidder = state.currentLot?.userIsFloorWinningBidder ?? false

                if isSellingToMe && isFloorWinningBidder {
                    biddingState = .bidBecameMaxBidder
                } else if isSellingToMe {
                    // get the amount you offered or the current asking price
                    let price = state.currentLot?.usersTopBidCents ?? state.askingPrice
                    biddingState = .bidNotYetAccepted(askingPrice: price, currencySymbol: currencySymbol)
                } else {
                    biddingState = .biddable(askingPrice: state.askingPrice, currencySymbol: currencySymbol)
                }

                return .active(biddingState: biddingState)
            default:
                // The Swift compiler is not yet smart enough to know that this _is_ an exhaustive swift statement.
                // So we need a default to satisfy the compiler, even though it's impossible to reach.
                return .inActive(lotState: state.lotState)
            }
        }
    }
}


class LiveAuctionLeaveMaxBidButtonViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal = Observable<LiveAuctionBidButtonState>()
    let bidPendingSignal = Observable<LiveAuctionBiddingProgressState>()
    var auctionState: ARAuctionState = []
}
