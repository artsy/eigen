import Foundation
import Starscream

// Protocol should mirror WebSocket, allows for injection in tests
protocol WebSocketType : AnyObject {
    var delegate: WebSocketDelegate? { get set }
    var onEvent: ((WebSocketEvent) -> Void)? { get set }
    var request: URLRequest { get set }
    var callbackQueue: DispatchQueue { get set }
    func connect()
    func disconnect(closeCode: UInt16)
    func write(string: String, completion: (() -> ())?)
}

extension Starscream.WebSocket: WebSocketType {}
