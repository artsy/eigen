import Quick
import Nimble
import ReSwift
@testable
import Artsy

var socket: Test_Socket!
var store: Store<LiveAuctionState>!

class LiveAuctionSocketCommunicatorSpec: QuickSpec {
    override func spec() {
        let host = "squiggly host"
        let jwt = StubbedCredentials.Registered.jwt

        let saleID = "honest ed's bargain basement"

        beforeEach {
            socket = Test_Socket()
            store = testStore(LiveAuctionState(
                operatorIsConnected: true,
                socketIsConnected: true,
                isInitialStateLoaded: true
            ))
        }

        it("configures the socket with the correct host") {
            _ = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator(), store: store)

            expect(socket.host) == host
        }

        it("connects the socket on initialization") {
            let subject = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator(), store: store)

            expect(socket.connected) == true

            _ = subject // Keep a reference around until after expect()
        }

        it("disconnects the socket when deallocated") {
            do {
                _ = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator(), store: store)
            }

            expect(socket.connected) == false
        }

        it("sends authentication once connected") {
            let subject = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator(), store: store)

            socket.onConnect?()

            let authCalls = socket.writes.filter { $0 == "{\"type\":\"Authorize\",\"jwt\":\"\(jwt.string)\"}" }
            expect(authCalls).to( haveCount(1) )

            _ = subject // Keep a reference around until after expect()
        }

        it("listens for updated auction state") {
            _ = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator(), store: store)

            expect(socket.onText).toNot( beNil() )
        }

        it("sends its updatedAuctionState observable its updated auction state") {
            let subject = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator(), store: store)

            // "emit" the socket event from the server
            let state = "{\"type\":\"InitialFullSaleState\",\"currentLotId\":\"54c7ecc27261692b5e420600\",\"fullLotStateById\":{}}"
            socket.onText?(state)

            expect(subject.updatedAuctionState.peek() ).toNot( beNil() )
        }
    }
}

func test_SocketCreator() -> LiveAuctionSocketCommunicator.SocketCreator {
    return { host, causalitySaleID in
        socket.host = host
        return socket
    }
}

class Test_Socket: SocketType {
    var onText: ((String) -> Void)?
    var onConnect: ((Void) -> Void)?
    var onDisconnect: ((NSError?) -> Void)?

    var writes = [String]()
    var datas = [NSData]()
    var connected = false
    var host = ""

    init() { }


    func writeString(str: String) { writes += [str] }
    func writeData(data: NSData) { datas += [data] }

    func writePing() { }
    func connect() { connected = true }
    func disconnect() { connected = false }
}
