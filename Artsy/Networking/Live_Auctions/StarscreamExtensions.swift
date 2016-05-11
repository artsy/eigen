import Starscream

extension WebSocket: SocketType {
    func writeString(str: String) {
        writeString(str, completion: nil)
    }

    func writeData(data: NSData) {
        self.writeData(data, completion: nil)
    }

    func disconnect() {
        disconnect(forceTimeout: nil)
    }

    func writePing() {
        writePing("2".dataUsingEncoding(NSUTF8StringEncoding)!)
    }
}