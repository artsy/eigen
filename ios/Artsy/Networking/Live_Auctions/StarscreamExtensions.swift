import Starscream

extension WebSocket: SocketType {
    var onText: ((String) -> Void)? {
        get {
            fatalError("Must be implemented by subclass")
        }
        set {
            fatalError("Must be implemented by subclass")
        }
    }

    var onConnect: (() -> Void)? {
        get {
            fatalError("Must be implemented by subclass")
        }
        set {
            fatalError("Must be implemented by subclass")
        }
    }

    var onDisconnect: ((Error?) -> Void)? {
        get {
            fatalError("Must be implemented by subclass")
        }
        set {
            fatalError("Must be implemented by subclass")
        }
    }

    func write(string: String) {
        write(string: string, completion: nil)
    }

    func disconnect() {
        disconnect(closeCode: CloseCode.normal.rawValue)
    }

    func writePing() {
        write(string: "2")
    }
}
