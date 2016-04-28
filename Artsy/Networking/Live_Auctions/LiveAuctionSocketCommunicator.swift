import Foundation
import Starscream

protocol SocketType: class {
    var onText: ((String) -> Void)? { get set }
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
            return WebSocket(url: NSURL(string: host)!)
        }
    }
}

private typealias SocketSetup = LiveAuctionSocketCommunicator
private extension SocketSetup {

    /// Connects to, then authenticates against, the socket. Listens for sale events once authenticated.
    func setupSocket() {
        socket.onText = self.receivedText
        socket.connect()
    }

    func receivedText(text: String) {

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
