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
    typealias SocketCommunicatorCreator = (host: String, causalitySaleID: String, accessToken: String) -> LiveAuctionSocketCommunicatorType
    typealias StaticDataFetcherCreator = (saleID: String) -> LiveAuctionStaticDataFetcherType
    typealias StateReconcilerCreator = (saleArtworks: [LiveAuctionLotViewModel]) -> LiveAuctionStateReconcilerType

    let sale: LiveSale

    private let socketCommunicator: LiveAuctionSocketCommunicatorType
    private let stateReconciler: LiveAuctionStateReconcilerType

    init(host: String,
         sale: LiveSale,
         saleArtworks: [LiveAuctionLotViewModel],
         accessToken: String,
         socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
         stateReconcilerCreator: StateReconcilerCreator = LiveAuctionStateManager.defaultStateReconcilerCreator()) {

        self.sale = sale
        self.socketCommunicator = socketCommunicatorCreator(host: host, causalitySaleID: sale.causalitySaleID, accessToken: accessToken)
        self.stateReconciler = stateReconcilerCreator(saleArtworks: saleArtworks)

        super.init()

        socketCommunicator.updatedAuctionState.subscribe { [weak self] state in
            self?.stateReconciler.updateState(state)
        }
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
    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return stateReconciler.currentLotSignal
    }
}



private typealias DefaultCreators = LiveAuctionStateManager
extension DefaultCreators {
    class func defaultSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, causalitySaleID, accessToken in
            return LiveAuctionSocketCommunicator(host: host, causalitySaleID: causalitySaleID, accessToken: accessToken)
        }
    }

    class func stubbedSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, causalitySaleID, accessToken in
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

    init (state: AnyObject) {
        updatedAuctionState = Observable(state)
    }

    func bidOnLot(lotID: String) {

    }

    func leaveMaxBidOnLot(lotID: String) {

    }

}
