import Foundation
import SocketIOClientSwift

protocol SocketType: class {
func on(event: SocketEvent, callback: [AnyObject] -> Void) -> NSUUID
    func emit(event: SocketEvent, _ items: AnyObject...)

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
    typealias SocketCreator = String -> SocketType
    private let socket: SocketType
    private let causalitySaleID: String

    weak var delegate: LiveAuctionSocketCommunicatorDelegate?

    convenience init(host: String, causalitySaleID: String, accessToken: String) {
        self.init(host: host, accessToken: accessToken, causalitySaleID: causalitySaleID, socketCreator: LiveAuctionSocketCommunicator.defaultSocketCreator())
    }

    init(host: String, accessToken: String, causalitySaleID: String, socketCreator: SocketCreator) {
        socket = socketCreator(host)
        self.causalitySaleID = causalitySaleID

        super.init()

        setupSocketWithAccessToken(accessToken, causalitySaleID: causalitySaleID)
    }

    deinit {
        socket.disconnect()
    }

    class func defaultSocketCreator() -> String -> SocketType {
        return { host in
            return SocketIOClient(socketURL: NSURL(string: host)!, options: [.Reconnects(true), .Log(false)])
        }
    }
}

private typealias SocketSetup = LiveAuctionSocketCommunicator
private extension SocketSetup {

    /// Connects to, then authenticates against, the socket. Listens for sale events once authenticated.
    func setupSocketWithAccessToken(accessToken: String, causalitySaleID: String) {
        self.authenticateWithAccessToken(accessToken, causalitySaleID: causalitySaleID)
        socket.connect()
    }

    func authenticateWithAccessToken(accessToken: String, causalitySaleID: String) {
        socket.on(.Connect) { [weak socket, weak self] data in
            print("Connected: \(data)")

            socket?.emit(.Authentication, ["accessToken": accessToken, "saleId": causalitySaleID])
            socket?.on(.Authenticated) { data in
                // TODO: Handle auth failure.
                print("Authenticated: \(data)")
                self?.listenForSaleEvents()
            }
        }
    }

    func listenForSaleEvents() {
        print("Joining sale")
        socket.emit(.JoinSale, causalitySaleID)

        print("Listening for socket events.")
        socket.on(.UpdateAuctionState) { [weak self] data in
            print("Updated auction state: \(data)")
            if let state = data.first {
                self?.delegate?.didUpdateAuctionState(state)
            }
        }
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
