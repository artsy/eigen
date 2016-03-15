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

class LiveAuctionSocketCommunicator: NSObject {
    typealias SocketCreator = String -> SocketType
    private let socket: SocketType
    private let saleID: String

    weak var delegate: LiveAuctionSocketCommunicatorDelegate?

    convenience init(host: String, accessToken: String, saleID: String) {
        self.init(host: host, accessToken: accessToken, saleID: saleID, socketCreator: LiveAuctionSocketCommunicator.defaultSocketCreator())
    }

    init(host: String, accessToken: String, saleID: String, socketCreator: SocketCreator) {
        socket = socketCreator(host)
        self.saleID = saleID

        super.init()

        setupSocketWithAccessToken(accessToken, saleID: saleID)
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
    func setupSocketWithAccessToken(accessToken: String, saleID: String) {
        self.authenticateWithAccessToken(accessToken, saleID: saleID)
        socket.connect()
    }

    func authenticateWithAccessToken(accessToken: String, saleID: String) {
        socket.on(.Connect) { [weak socket, weak self] data in
            print("Connected: \(data)")

            socket?.emit(.Authentication, ["accessToken": accessToken, "saleId": saleID])
            socket?.on(.Authenticated) { data in
                // TODO: Handle auth failure.
                print("Authenticated: \(data)")
                self?.listenForSaleEvents()
            }
        }
    }

    func listenForSaleEvents() {
        print("Joining sale")
        socket.emit(.JoinSale, saleID)

        print("Listening for socket events.")
        socket.on(.UpdateAuctionState) { [weak self] data in
            print("Updated auction state: \(data)")
            // TODO: We need initial state when we join, this doesn't work until something on the server hapens :(
            if let state = data.first {
                self?.delegate?.didUpdateAuctionState(state)
            }
        }
    }
}
