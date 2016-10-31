import Foundation
import Interstellar
import SwiftyJSON
import ReSwift

/*
Independent of sockets:
- time elapsed

Based on socket events:
- lot state (bidding not yet, bidding open, bidding closed)
- reserve status
- # of bids
- # of watchers
- next bid amount $
- bid history
- bid request (command) success/failure
*/

class LiveAuctionStateManager: NSObject {
    typealias SocketCommunicatorCreator = (host: String, causalitySaleID: String, jwt: JWT, store: Store<LiveAuctionState>) -> LiveAuctionSocketCommunicatorType
    typealias StateReconcilerCreator = (saleArtworks: [LiveAuctionLotViewModel]) -> LiveAuctionStateReconcilerType

    let sale: LiveSale
    let bidderCredentials: BiddingCredentials
    let initialStateLoadedSignal = Observable<Void>(options: .Once)

    private let socketCommunicator: LiveAuctionSocketCommunicatorType
    private let stateReconciler: LiveAuctionStateReconcilerType
    private var biddingStates = [String: LiveAuctionBiddingViewModelType]()

    init(host: String,
         sale: LiveSale,
         saleArtworks: [LiveAuctionLotViewModel],
         jwt: JWT,
         bidderCredentials: BiddingCredentials,
         store: Store<LiveAuctionState>,
         socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
         stateReconcilerCreator: StateReconcilerCreator = LiveAuctionStateManager.defaultStateReconcilerCreator()) {

        self.sale = sale
        self.bidderCredentials = bidderCredentials
        self.socketCommunicator = socketCommunicatorCreator(host: host, causalitySaleID: sale.causalitySaleID, jwt: jwt, store: store)
        self.stateReconciler = stateReconcilerCreator(saleArtworks: saleArtworks)

        super.init()

        socketCommunicator.updatedAuctionState.subscribe { [weak self] state in
            self?.stateReconciler.updateState(state)
            self?.initialStateLoadedSignal.update()
        }

        socketCommunicator.lotUpdateBroadcasts.subscribe { [weak self] broadcast in
            self?.stateReconciler.processLotEventBroadcast(broadcast)
        }

        socketCommunicator.currentLotUpdate.subscribe { [weak self] update in
            self?.stateReconciler.processCurrentLotUpdate(update)
        }

        socketCommunicator.postEventResponses.subscribe { [weak self] response in

            let json = JSON(response)
            let bidUUID = json["key"].stringValue
            let biddingViewModel = self?.biddingStates.removeValueForKey(bidUUID)
//            So far this event isn't needed anywhere, but keeping for prosperities sake
//            let eventJSON = json["event"].dictionaryObject
//            let liveEvent = LiveEvent(JSON: eventJSON)
            let confirmed = LiveAuctionBiddingProgressState.BidAcknowledged
            biddingViewModel?.bidPendingSignal.update(confirmed)
        }
    }
}

private typealias PublicFunctions = LiveAuctionStateManager
extension PublicFunctions {

    func bidOnLot(lotID: String, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        if !bidderCredentials.canBid {
            return print("Tried to bid without a bidder ID on account")
        }

        biddingViewModel.bidPendingSignal.update(.BiddingInProgress)

        let bidID = NSUUID().UUIDString
        biddingStates[bidID] = biddingViewModel
        socketCommunicator.bidOnLot(lotID, amountCents: amountCents, bidderCredentials: bidderCredentials, bidUUID: bidID)
    }

    func leaveMaxBidOnLot(lotID: String, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        if !bidderCredentials.canBid {
            return print("Tried to leave a max bid without a bidder ID on account")
        }

        biddingViewModel.bidPendingSignal.update(.BiddingInProgress)
        let bidID = NSUUID().UUIDString
        biddingStates[bidID] = biddingViewModel
        socketCommunicator.leaveMaxBidOnLot(lotID, amountCents: amountCents, bidderCredentials: bidderCredentials, bidUUID: bidID)
    }

    var debugAllEventsSignal: Observable<LotEventJSON> {
        return stateReconciler.debugAllEventsSignal
    }
}

private typealias ComputedProperties = LiveAuctionStateManager
extension ComputedProperties {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> {
        return stateReconciler.currentLotSignal
    }
}

private typealias DefaultCreators = LiveAuctionStateManager
extension DefaultCreators {
    class func defaultSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, causalitySaleID, jwt, store in
            return LiveAuctionSocketCommunicator(host: host, causalitySaleID: causalitySaleID, jwt: jwt, store: store)
        }
    }

    class func stubbedSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, causalitySaleID, jwt, store in
            return Stubbed_SocketCommunicator(state: loadJSON("live_auctions_socket"))
        }
    }

    class func defaultStateReconcilerCreator() -> StateReconcilerCreator {
        return { saleArtworks in
            return LiveAuctionStateReconciler(saleArtworks: saleArtworks)
        }
    }
}

private class Stubbed_SocketCommunicator: LiveAuctionSocketCommunicatorType {
    let updatedAuctionState: Observable<AnyObject>
    let lotUpdateBroadcasts = Observable<AnyObject>()
    let currentLotUpdate = Observable<AnyObject>()
    let postEventResponses = Observable<AnyObject>()

    init (state: AnyObject) {
        updatedAuctionState = Observable(state)
    }

    func bidOnLot(lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {

    }

    func leaveMaxBidOnLot(lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {

    }

}
