import Foundation
import Interstellar

enum BidProgressStatus {
    case Started
    case Completed(success: Bool, event: LiveEvent, error: ErrorType?)
}

protocol LiveAuctionBiddingViewModelType {
    var progressSignal: Observable<LiveAuctionBidButtonState> { get }
    var bidPendingSignal: Observable<LiveAuctionBiddingProgressState> { get }
}

class LiveAuctionBiddingViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal: Observable<LiveAuctionBidButtonState>
    let bidPendingSignal = Observable<LiveAuctionBiddingProgressState>()

    private let _lotStateSubscription: ObserverToken<LotState>
    private let _askingPriceSubscription: ObserverToken<UInt64>
    private let _currentLotSubscription: ObserverToken<LiveAuctionLotViewModelType?>
    private let _newLotEventsSubscription: ObserverToken<[LiveAuctionEventViewModel]>

    // Copies of observables that will be deallocated when we are.
    private let _lotState = Observable<LotState>()
    private let _askingPrice = Observable<UInt64>()
    private let _currentLot = Observable<LiveAuctionLotViewModelType?>()
    private let _newLotEventsSignal = Observable<[LiveAuctionEventViewModel]>([LiveAuctionEventViewModel(event: LiveEvent(), currencySymbol: "")])
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
    class func stateToBidButtonState(currencySymbol: String, lotID: String, auctionViewModel: LiveAuctionViewModelType)
                -> (state: (lotState: LotState, askingPrice: UInt64, currentLot: LiveAuctionLotViewModelType?))
                -> LiveAuctionBidButtonState {

        return { state in
            let userIsRegistered = auctionViewModel.auctionState.contains(.UserIsRegistered)
            let userRegistrationPending = auctionViewModel.auctionState.contains(.UserPendingRegistration)
            let registrationIsClosed = auctionViewModel.auctionState.contains(.UserRegistrationClosed)

            // This switch represents a priority of what states matter more than others.
            // For example: a closed lot is always shown as closed, regardless of bidder registration.
            // And if a registration is pending, we show that, etc.
            switch state.lotState {
            case .ClosedLot:
                return .InActive(lotState: .ClosedLot)

            case _ where !userIsRegistered && registrationIsClosed:
                return .Active(biddingState: LiveAuctionBiddingProgressState.UserRegistrationClosed)

            case _ where userRegistrationPending:
                return .Active(biddingState: LiveAuctionBiddingProgressState.UserRegistrationPending)

            case _ where !userIsRegistered:
                return .Active(biddingState: LiveAuctionBiddingProgressState.UserRegistrationRequired)

            case .UpcomingLot:
                if lotID == state.currentLot?.lotID {
                    return .Active(biddingState: .LotWaitingToOpen)
                } else {
                    return .InActive(lotState: state.lotState)
                }

            case .LiveLot:
                let biddingState: LiveAuctionBiddingProgressState

                let isSellingToMe = state.currentLot?.userIsWinning ?? false
                
                if isSellingToMe {
                    biddingState = .BidBecameMaxBidder
                } else {
                    biddingState = .Biddable(askingPrice: state.askingPrice, currencySymbol: currencySymbol)
                }

                return .Active(biddingState: biddingState)
            default:
                // The Swift compiler is not yet smart enough to know that this _is_ an exhaustive swift statement.
                // So we need a default to satisfy the compiler, even though it's impossible to reach.
                return .InActive(lotState: .ClosedLot)
            }
        }
    }
}


class LiveAuctionLeaveMaxBidButtonViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal = Observable<LiveAuctionBidButtonState>()
    let bidPendingSignal = Observable<LiveAuctionBiddingProgressState>()
    var auctionState: ARAuctionState = []
}
