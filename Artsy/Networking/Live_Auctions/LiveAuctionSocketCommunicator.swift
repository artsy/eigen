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
    func setupSocketWithAccessToken(accessToken: String, saleID: String) {

        defer {
            socket.connect()
        }

        socket.on("connect") {data, ack in
            print("socket connected, authing...")
            self.socket.emit("authentication", ["accessToken": accessToken, "saleId": saleID])

            self.socket.on("authenticated") { data, ack in
                print("socket authenticated.")
            }
        }
    }
}