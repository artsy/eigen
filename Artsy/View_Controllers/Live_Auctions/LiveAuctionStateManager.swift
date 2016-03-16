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

    let saleID: String
    let updatedState = Signal<AnyObject>()

    // Updates the signal for us.
    private var state: AnyObject? {
        didSet {
            guard let state = state else { return }
            updatedState.update(state)
        }
    }
    private let socketCommunicator: LiveAuctionSocketCommunicatorType
    private let stateFetcher: LiveAuctionStateFetcherType

    init(host: String,
        saleID: String,
        accessToken: String,
        socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
        stateFetcherCreator: StateFetcherCreator = LiveAuctionStateManager.defaultStateFetcherCreator()) {

        self.saleID = saleID
        self.socketCommunicator = socketCommunicatorCreator(host: host, saleID: saleID, accessToken: accessToken)
        self.stateFetcher = stateFetcherCreator(host: host, saleID: saleID)

        super.init()

        stateFetcher.fetchSale().next { [weak self] state in
            self?.state = state
        }

        socketCommunicator.delegate = self
    }

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
}

private typealias SocketDelegate = LiveAuctionStateManager
extension SocketDelegate: LiveAuctionSocketCommunicatorDelegate {
    func didUpdateAuctionState(state: AnyObject) {
        self.state = state
    }
}
