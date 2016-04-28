import Starscream

extension WebSocket: SocketType {
    func writeString(str: String) {
        writeString(str, completion: nil)
    }

    func disconnect() {
        disconnect(forceTimeout: nil)
    }
}