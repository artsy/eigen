import Foundation
import SocketIOClientSwift

@objc class LiveAuctionSocketCommunicator: NSObject {
    private let socket: SocketIOClient

    @objc init(host: String, accessToken: String, saleID: String) {
        socket = SocketIOClient(socketURL: NSURL(string: host)!, options: [.Log(true)])

        super.init()

        setupSocketWithAccessToken(accessToken, saleID: saleID)
    }

    deinit {
        socket.disconnect()
    }
}

private typealias SocketSetup = LiveAuctionSocketCommunicator
private extension SocketSetup {

    /// Connects to, then authenticates against, the socket. Listens for sale events.
    func setupSocketWithAccessToken(accessToken: String, saleID: String) {
        socket.authenticateWithAccessToken(accessToken, saleID: saleID)
        self.listenForSaleEvents()
        socket.connect()
    }

    func listenForSaleEvents() {

    }
}

private typealias Socket = SocketIOClient
extension SocketIOClient {
    func authenticateWithAccessToken(accessToken: String, saleID: String) {

        on("connect") { data, ack in
            self.emit("authentication", ["accessToken": accessToken, "saleId": saleID])
            self.on("authenticated") { data, ack in
                // TODO: Handle auth failure.
            }
        }
    }
}
