import Foundation
import Starscream

protocol SocketType: class {
    var onText: ((String) -> Void)? { get set }
    var onConnect: ((Void) -> Void)? { get set }
    var onDisconnect: ((NSError?) -> Void)? { get set }

    func writeString(str: String)

    func connect()
    func disconnect()
}

@objc protocol LiveAuctionSocketCommunicatorDelegate: class {
    func didUpdateAuctionState(state: AnyObject)
}

protocol LiveAuctionSocketCommunicatorType {
    weak var delegate: LiveAuctionSocketCommunicatorDelegate? { get set }

    func bidOnLot(lotID: String)
    func leaveMaxBidOnLot(lotID: String)
}

class LiveAuctionSocketCommunicator: NSObject, LiveAuctionSocketCommunicatorType {
    typealias SocketCreator = (host: String, saleID: String, token: String) -> SocketType
    private let socket: SocketType
    private let causalitySaleID: String

    weak var delegate: LiveAuctionSocketCommunicatorDelegate?

    convenience init(host: String, causalitySaleID: String, accessToken: String) {
        self.init(host: host, accessToken: accessToken, causalitySaleID: causalitySaleID, socketCreator: LiveAuctionSocketCommunicator.defaultSocketCreator())
    }

    init(host: String, accessToken: String, causalitySaleID: String, socketCreator: SocketCreator) {
        socket = socketCreator(host: host, saleID: causalitySaleID, token: accessToken)
        self.causalitySaleID = causalitySaleID

        super.init()

        setupSocket()
    }

    deinit {
        socket.disconnect()
    }

    class func defaultSocketCreator() -> SocketCreator {
        return { host, saleID, token in
            // TODO: incorporate token once JWT is complete.
            // TODO: Talkt o Alan about claim_userId and claim_bidderId.
            let url = NSURL(string: "\(host)/socket?claim_role=bidder&claim_saleId=\(saleID)&claim_userId=4C-U2DgqWh&claim_bidderId=4C-U2DgqWh")
            return WebSocket(url: url!)
        }
    }
}

private typealias SocketSetup = LiveAuctionSocketCommunicator
private extension SocketSetup {

    /// Connects to, then authenticates against, the socket. Listens for sale events once authenticated.
    func setupSocket() {
        socket.onText = self.receivedText
        socket.onConnect = { print("socket connected") }
        socket.onDisconnect = { error in print ("socket disconnected: \(error)") }
        socket.connect()
    }

    func receivedText(text: String) {
        print("Received socket text: \(text)")
    }
}


private typealias PublicFunctions = LiveAuctionSocketCommunicator
extension PublicFunctions {
    func bidOnLot(lotID: String) {
        // TODO: implement
    }

    func leaveMaxBidOnLot(lotID: String) {
        // TODO: implement
    }
}
