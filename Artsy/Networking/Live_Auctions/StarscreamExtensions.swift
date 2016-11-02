import Starscream

extension WebSocket: SocketType {
    func writeString(_ str: String) {
        writeString(str)
    }

    func disconnect() {
        disconnect(forceTimeout: nil)
    }

    func writePing() {
        write(data: "2".data(using: String.Encoding.utf8)!) // swiftlint:disable:this force_unwrapping
    }

    func writeData(_ data: NSData) {
        write(data: data as Data)
    }
}
