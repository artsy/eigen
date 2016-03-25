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
    typealias StateFetcherCreator = (host: String, saleID: String) -> LiveAuctionStateFetcherType
    typealias StateReconcilerCreator = () -> LiveAuctionStateReconciler

    let saleID: String
    var updatedState: Signal<AnyObject> {
        return stateReconciler.updatedState
    }

    private let socketCommunicator: LiveAuctionSocketCommunicatorType
    private let stateFetcher: LiveAuctionStateFetcherType
    private let stateReconciler: LiveAuctionStateReconciler

    init(host: String,
        saleID: String,
        accessToken: String,
        socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
        stateFetcherCreator: StateFetcherCreator = LiveAuctionStateManager.defaultStateFetcherCreator(),
        stateReconcilerCreator: StateReconcilerCreator = LiveAuctionStateManager.defaultStateReconcilerCreator()) {

        self.saleID = saleID
        self.socketCommunicator = socketCommunicatorCreator(host: host, saleID: saleID, accessToken: accessToken)
        self.stateFetcher = stateFetcherCreator(host: host, saleID: saleID)
        self.stateReconciler = stateReconcilerCreator()

        super.init()

        stateFetcher.fetchSale().next { [weak self] state in
            self?.stateReconciler.updateState(state)
        }

        socketCommunicator.delegate = self
    }
}


private typealias SocketDelegate = LiveAuctionStateManager
extension SocketDelegate: LiveAuctionSocketCommunicatorDelegate {
    func didUpdateAuctionState(state: AnyObject) {
        self.stateReconciler.updateState(state)
    }
}


private typealias DefaultCreators = LiveAuctionStateManager
extension DefaultCreators {
    class func defaultSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, accessToken, saleID in
            return LiveAuctionSocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
        }
    }

    class func defaultStateFetcherCreator() -> StateFetcherCreator {
        return { host, saleID in
            return LiveAuctionStateFetcher(host: host, saleID: saleID)
        }
    }

    class func defaultStateReconcilerCreator() -> StateReconcilerCreator {
        return {
            return LiveAuctionStateReconciler()
        }
    }
}
