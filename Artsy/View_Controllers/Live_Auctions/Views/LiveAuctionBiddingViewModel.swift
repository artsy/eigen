import Foundation
import Interstellar

protocol LiveAuctionBiddingViewModelType {
    var progressSignal: Observable<LiveAuctionBidButtonState> { get }
    var bidPendingSignal: Observable<Bool> { get }
}

class LiveAuctionBiddingViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal: Observable<LiveAuctionBidButtonState>
    let bidPendingSignal = Observable<Bool>()

    private let _lotStateSubscription: ObserverToken<LotState>
    private let _askingPriceSubscription: ObserverToken<UInt64>
    private let _currentLotSubscription: ObserverToken<LiveAuctionLotViewModelType?>
    private let _newLotEventSubscription: ObserverToken<LiveAuctionEventViewModel>

    // Copies of observables that will be deallocated when we are.
    private let _lotState = Observable<LotState>()
    private let _askingPrice = Observable<UInt64>()
    private let _currentLot = Observable<LiveAuctionLotViewModelType?>()
    private let _newLotEventSignal = Observable<LiveAuctionEventViewModel>()


    init(currencySymbol: String, lotViewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType) {
        // Okay, so what's all this then?? Well, we need to merge several signals together, but due to Interstellar's garbage collection model of unsubscribing, we can't unsubscribe from a merged signal.
        // So instead, we create private "copies" of the signals, bound to the originals but with subscriptions we can get rid of when we're deallocated (so merging these is fine).
        self._lotStateSubscription = lotViewModel.lotStateSignal.subscribe(_lotState.update)
        self._askingPriceSubscription = lotViewModel.askingPriceSignal.subscribe(_askingPrice.update)
        self._currentLotSubscription = auctionViewModel.currentLotSignal.subscribe(_currentLot.update)
        self._newLotEventSubscription = lotViewModel.newEventSignal.subscribe(_newLotEventSignal.update)

        progressSignal = _lotState
            .merge(_askingPrice)
            .merge(_currentLot)
            .merge(_newLotEventSignal)
            .map { tuple -> (lotState: LotState, askingPrice: UInt64, currentLot: LiveAuctionLotViewModelType?) in
                // Merging more than two Observables in Interstellar gets really messy, we're mapping from that mess into a nice tuple with named elements.
                return (lotState: tuple.0.0.0, askingPrice: tuple.0.0.1, currentLot: tuple.0.1)
            }
            .map(LiveAuctionBiddingViewModel.stateToBidButtonState(currencySymbol, lotID: lotViewModel.lotID, bidderStatus: auctionViewModel.bidderStatus))
    }

    deinit {
        _lotStateSubscription.unsubscribe()
        _askingPriceSubscription.unsubscribe()
        _currentLotSubscription.unsubscribe()
    }

    // This is extracted into its own method because it's messy. It's curried to have access to the lotID.
    class func stateToBidButtonState(currencySymbol: String, lotID: String, bidderStatus: ArtsyAPISaleRegistrationStatus)
                -> (state: (lotState: LotState, askingPrice: UInt64, currentLot: LiveAuctionLotViewModelType?))
                -> LiveAuctionBidButtonState {
        return { state in
            switch state.lotState {
            case .ClosedLot: return .InActive(lotState: state.lotState)
            case .UpcomingLot:
                if lotID == state.currentLot?.lotID {
                    return .Active(biddingState: .LotWaitingToOpen)
                } else {
                    return .InActive(lotState: state.lotState)
                }

            case .LiveLot:
                // TODO: This is sufficient for now, but will need to handle state _while_ bidding once that's in. That can go in another observable.

                let biddingState: LiveAuctionBiddingProgressState

                switch  bidderStatus {
                case .NotLoggedIn, .NotRegistered:
                    biddingState = .TrialUser

                case .Registered:
                    let isHighestBiddder = state.currentLot?.userIsHighestBidder ?? false

                    if isHighestBiddder {
                        biddingState = .BidSuccess(isMaxBidder: true)
                    } else {
                        biddingState = .Biddable(askingPrice: state.askingPrice, currencySymbol: currencySymbol)
                    }
                }

                return .Active(biddingState: biddingState)
            }
        }
    }
}


class LiveAuctionLeaveMaxBidButtonViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal = Observable<LiveAuctionBidButtonState>()
    let bidPendingSignal = Observable<Bool>()
}

