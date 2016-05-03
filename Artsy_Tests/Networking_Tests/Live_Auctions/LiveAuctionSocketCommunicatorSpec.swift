import Quick
import Nimble

@testable
import Artsy

var socket: Test_Socket!

class LiveAuctionSocketCommunicatorSpec: QuickSpec {
    override func spec() {
        let host = "squiggly host"
        let accessToken = "123456"
        let saleID = "honest ed's bargain basement"

        beforeEach {
            socket = Test_Socket()
        }

        it("configures the socket with the correct host") {
            _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, causalitySaleID: saleID, socketCreator: test_SocketCreator())

            expect(socket.host) == host
        }

        it("connects the socket on initialization") {
            let subject = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, causalitySaleID: saleID, socketCreator: test_SocketCreator())

            expect(socket.connected) == true

            _ = subject // Keep a reference around until after expect()
        }

        it("disconnects the socket when deallocated") {
            do {
                _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, causalitySaleID: saleID, socketCreator: test_SocketCreator())
            }

            expect(socket.connected) == false
        }

        it("listens for updated auction state") {
            _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, causalitySaleID: saleID, socketCreator: test_SocketCreator())

            expect(socket.onText).toNot( beNil() )
        }

        it("sends its updatedAuctionState observable its updated auction state") {
            let subject = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, causalitySaleID: saleID, socketCreator: test_SocketCreator())

            // "emit" the socket event from the server
            let state = "{\"type\":\"InitialFullSaleState\",\"currentLotId\":\"54c7ecc27261692b5e420600\",\"fullLotStateById\":{}}"
            socket.onText?(state)

            expect(subject.updatedAuctionState.peek() ).toNot( beNil() )
        }
    }
}

func test_SocketCreator() -> LiveAuctionSocketCommunicator.SocketCreator {
    return { host, causalitySaleID, token in
        socket.host = host
        return socket
    }
}

class Test_Socket: SocketType {
    var onText: ((String) -> Void)?
    var onConnect: ((Void) -> Void)?
    var onDisconnect: ((NSError?) -> Void)?

    var writes = [String]()
    var connected = false
    var host = ""

    init() { }


    func writeString(str: String) { writes += [str] }
    func writePing() { }
    func connect() { connected = true }
    func disconnect() { connected = false }
}
