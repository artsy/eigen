import Foundation
import Interstellar

protocol LiveAuctionBiddingViewModelType {
    var progressSignal: Observable<LiveAuctionBidButtonState> { get }
}

class LiveAuctionBiddingViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal: Observable<LiveAuctionBidButtonState>

    private let _lotStateSubscription: (ObserverToken, Observable<LotState>)
    private let _askingPriceSubscription: (ObserverToken, Observable<UInt64>)
    private let _currentLotSubscription: (ObserverToken, Observable<LiveAuctionLotViewModelType?>)

    // Copies of observables that will be deallocated when we are.
    private let _lotState = Observable<LotState>()
    private let _askingPrice = Observable<UInt64>()
    private let _currentLot = Observable<LiveAuctionLotViewModelType?>()


    init(lotViewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType) {
        // Okay, so what's all this then?? Well, we need to merge several signals together, but due to Interstellar's garbage collection model of unsubscribing, we can't unsubscribe from a merged signal.
        // So instead, we create private "copies" of the signals, bound to the originals but with subscriptions we can get rid of when we're deallocated (so merging these is fine).
        self._lotStateSubscription = (lotViewModel.lotStateSignal.subscribe(_lotState.update), lotViewModel.lotStateSignal)
        self._askingPriceSubscription = (lotViewModel.askingPriceSignal.subscribe(_askingPrice.update), lotViewModel.askingPriceSignal)
        self._currentLotSubscription = (auctionViewModel.currentLotSignal.subscribe(_currentLot.update), auctionViewModel.currentLotSignal)

        progressSignal = _lotState
            .merge(_askingPrice)
            .merge(_currentLot)
            .map { tuple -> (lotState: LotState, askingPrice: UInt64, currentLot: LiveAuctionLotViewModelType?) in
                // Merging more than two Observables in Interstellar gets really messy, we're mapping from that mess into a nice tuple with named elements.
                return (lotState: tuple.0.0, askingPrice: tuple.0.1, currentLot: tuple.1)
            }
            .map(LiveAuctionBiddingViewModel.stateToBidButtonState(lotViewModel.lotID))
    }

    deinit {
        _lotStateSubscription.1.unsubscribe(_lotStateSubscription.0)
        _askingPriceSubscription.1.unsubscribe(_askingPriceSubscription.0)
        _currentLotSubscription.1.unsubscribe(_currentLotSubscription.0)
    }

    // This is extracted into its own method because it's messy. It's curried to have access to the lotID.
    class func stateToBidButtonState(lotID: String) -> (state: (lotState: LotState, askingPrice: UInt64, currentLot: LiveAuctionLotViewModelType?)) -> LiveAuctionBidButtonState {
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
                // TODO: We also need to determine if we are the highest bidder or have been outbid or whathaveyou.
                return .Active(biddingState: .Biddable(askingPrice: state.askingPrice))
            }
        }
    }
}


class LiveAuctionLeaveMaxBidButtonViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal = Observable<LiveAuctionBidButtonState>()
}

