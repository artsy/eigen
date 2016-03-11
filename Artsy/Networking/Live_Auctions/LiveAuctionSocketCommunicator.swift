import Foundation
import Starscream

@objc class LiveAuctionSocketCommunicator: NSObject {
    private let socket: WebSocket

    override init() {
//        socket = WebSocket(url: NSURL(string: "wss://echo.websocket.org")!)
        socket = WebSocket(url: NSURL(string: "http://localhost:5000/socket.io/?EIO=3&transport=polling&t=1457567561454-2&sid=22aofAdt6BRk4biqAAAF")!)

        super.init()

        print("Initializing")
        socket.delegate = self
        socket.connect()
    }

    deinit {
        print("disconnecting")
        socket.disconnect()
    }
}

private typealias SocketDelegate = LiveAuctionSocketCommunicator
extension SocketDelegate: WebSocketDelegate {
    func websocketDidConnect(socket: WebSocket) {
        print("did connect")
    }

    func websocketDidDisconnect(socket: WebSocket, error: NSError?) {
        print("did disconnect")
    }

    func websocketDidReceiveMessage(socket: WebSocket, text: String) {
        print("did receive message")
    }

    func websocketDidReceiveData(socket: WebSocket, data: NSData) {
        print("did receive data")
    }
}
