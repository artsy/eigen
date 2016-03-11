import Foundation
import SocketIOClientSwift

@objc class LiveAuctionSocketCommunicator: NSObject {
    private let socket: SocketIOClient
    private let saleID: String

    @objc init(host: String, accessToken: String, saleID: String) {
        socket = SocketIOClient(socketURL: NSURL(string: host)!, options: [.Reconnects(true), .Log(false)])
        self.saleID = saleID

        super.init()

        setupSocketWithAccessToken(accessToken, saleID: saleID)
    }

    deinit {
        socket.disconnect()
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
        socket.on("connect") { [weak socket, weak self] data, ack in
            print("Connected: \(data)")

            socket?.emit("authentication", ["accessToken": accessToken, "saleId": saleID])
            socket?.on("authenticated") { data, ack in
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
        socket.on(.UpdateAuctionState) { data, ack in
            print("Updated auction state: \(data)")
        }
    }
}
