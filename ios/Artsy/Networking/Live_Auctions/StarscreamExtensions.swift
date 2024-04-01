import Starscream

extension WebSocket: SocketType {
    var onText: ((String) -> Void)? {
        get {
            return nil
        }
        set {}
    }

    var onConnect: (() -> Void)? {
        get {
            return nil
        }
        set {}
    }

    var onDisconnect: ((Error?) -> Void)? {
        get {
            return nil
        }
        set {}
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
