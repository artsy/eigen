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

    let saleID: String
    let updatedState = Signal<AnyObject>()

    private var state: AnyObject?
    private let socketCommunicator: LiveAuctionSocketCommunicatorType

    init(host: String, saleID: String, accessToken: String, socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator()) {
        self.saleID = saleID
        self.socketCommunicator = socketCommunicatorCreator(host: host, saleID: saleID, accessToken: accessToken)

        super.init()

        socketCommunicator.delegate = self
    }

    class func defaultSocketCommunicatorCreator() -> (String, String, String) -> LiveAuctionSocketCommunicatorType {
        return { host, accessToken, saleID in
            return LiveAuctionSocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
        }
    }
}

private typealias SocketDelegate = LiveAuctionStateManager
extension SocketDelegate: LiveAuctionSocketCommunicatorDelegate {
    func didUpdateAuctionState(state: AnyObject) {
        self.state = state
        updatedState.update(state)
    }
}
