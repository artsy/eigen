import Starscream

extension WebSocket: SocketType {
    func write(string: String) {
        write(string: string, completion: nil)
    }

    func disconnect() {
        disconnect(forceTimeout: nil)
    }

    func writePing() {
        write(data: "2".data(using: String.Encoding.utf8)!) // swiftlint:disable:this force_unwrapping
    }
}
