import Starscream

extension WebSocket: SocketType {
    func write(string: String) {
        write(string: string, completion: nil)
    }

    func disconnect() {
        disconnect(forceTimeout: nil)
    }

    func writePing() {
        write(string: "2")
    }
}
