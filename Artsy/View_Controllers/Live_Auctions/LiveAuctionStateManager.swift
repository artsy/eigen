import Foundation
import Interstellar

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
*/

class LiveAuctionStateManager: NSObject {
    typealias SocketCommunicatorCreator = (host: String, saleID: String, accessToken: String) -> LiveAuctionSocketCommunicatorType
    typealias StaticDataFetcherCreator = (saleID: String) -> LiveAuctionStaticDataFetcherType
    typealias StateReconcilerCreator = () -> LiveAuctionStateReconcilerType

    let saleID: String

    private let socketCommunicator: LiveAuctionSocketCommunicatorType
    private let stateReconciler: LiveAuctionStateReconcilerType

    init(host: String,
        saleID: String,
        accessToken: String,
        socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
        stateReconcilerCreator: StateReconcilerCreator = LiveAuctionStateManager.defaultStateReconcilerCreator()) {

        self.saleID = saleID
        self.socketCommunicator = socketCommunicatorCreator(host: host, saleID: saleID, accessToken: accessToken)
        self.stateReconciler = stateReconcilerCreator()

        super.init()

        socketCommunicator.delegate = self
    }
}

private typealias PublicFunctions = LiveAuctionStateManager
extension PublicFunctions {

    func bidOnLot(lotID: String) {
        socketCommunicator.bidOnLot(lotID)
    }

    func leaveMaxBidOnLot(lotID: String) {
        socketCommunicator.leaveMaxBidOnLot(lotID)
    }
}

private typealias ComputedProperties = LiveAuctionStateManager
extension ComputedProperties {
    var newLotsSignal: Observable<[LiveAuctionLotViewModelType]> {
        return stateReconciler.newLotsSignal
    }

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return stateReconciler.currentLotSignal
    }

    var saleSignal: Observable<LiveAuctionViewModelType> {
        return stateReconciler.saleSignal
    }
}


private typealias SocketDelegate = LiveAuctionStateManager
extension SocketDelegate: LiveAuctionSocketCommunicatorDelegate {
    func didUpdateAuctionState(state: AnyObject) {
        stateReconciler.updateState(state)
    }
}


private typealias DefaultCreators = LiveAuctionStateManager
extension DefaultCreators {
    class func defaultSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, accessToken, saleID in
            return LiveAuctionSocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
        }
    }

    class func defaultStateReconcilerCreator() -> StateReconcilerCreator {
        return {
            return LiveAuctionStateReconciler()
        }
    }

}
