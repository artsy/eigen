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
    let saleID: String
    let updatedState = Signal<AnyObject>()

    private var state: AnyObject?
    private let socketCommunicator: LiveAuctionSocketCommunicator

    init(saleID: String, accessToken: String) {
        self.saleID = saleID
        // TODO: Parameterize host through lab options.
        self.socketCommunicator = LiveAuctionSocketCommunicator(host: "http://localhost:5000", accessToken: accessToken, saleID: saleID)

        super.init()

        socketCommunicator.delegate = self
    }
}

private typealias SocketDelegate = LiveAuctionStateManager
extension SocketDelegate: LiveAuctionSocketCommunicatorDelegate {
    func didUpdateAuctionState(state: AnyObject) {
        self.state = state
        updatedState.update(state)
    }
}
