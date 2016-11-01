import Starscream

extension WebSocket: SocketType {
    func writeString(_ str: String) {
        writeString(str, completion: nil)
    }

    func disconnect() {
        disconnect(forceTimeout: nil)
    }

    func writePing() {
        writePing("2".dataUsingEncoding(NSUTF8StringEncoding)!) // swiftlint:disable:this force_unwrapping
    }

    func writeData(_ data: NSData) {
        writeData(data, completion: nil)
    }
}
