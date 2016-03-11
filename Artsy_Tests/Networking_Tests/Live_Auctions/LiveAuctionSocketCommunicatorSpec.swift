import Quick
import Nimble
import SocketIOClientSwift

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
            socket.host = host
        }

        it("configures the socket with the correct host") {
            _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, saleID: saleID, socketCreator: test_SocketCreator())

            expect(socket.host) == host
        }

        it("connects the socket on initialization") {
            let subject = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, saleID: saleID, socketCreator: test_SocketCreator())

            expect(socket.connected) == true

            _ = subject // Keep a reference around until after expect()
        }

        it("disconnects the socket when deallocated") {
            do {
                _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, saleID: saleID, socketCreator: test_SocketCreator())
            }

            expect(socket.connected) == false
        }

        it("authenticates the socket connection") {
            _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, saleID: saleID, socketCreator: test_SocketCreator())

            expect(socket.emittedEvents).to( contain(SocketEvent.Authentication) )
        }

        describe("authenticated") {

            it("joins the auction") {
                _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, saleID: saleID, socketCreator: test_SocketCreator())

                expect(socket.emittedEvents).to( contain(SocketEvent.JoinSale) )

            }

            it("listens for updated auction state") {
                _ = LiveAuctionSocketCommunicator(host: host, accessToken: accessToken, saleID: saleID, socketCreator: test_SocketCreator())

                expect(socket.onEvents).to( contain(SocketEvent.UpdateAuctionState) )
            }
        }
    }
}

func test_SocketCreator() -> String -> SocketType {
    return { host in
        return socket
    }
}

class Test_Socket: SocketType {
    var host: String = ""
    var callbackParams: [AnyObject] = []
    var onEvents: [SocketEvent] = []
    var emittedEvents: [SocketEvent] = []
    var connected = false

    init() { }

    func on(event: SocketEvent, callback: [AnyObject] -> Void) -> NSUUID  {
        onEvents += [event]
        callback(callbackParams)
        return NSUUID()
    }

    func emit(event: SocketEvent, _ items: AnyObject...)  { emittedEvents += [event] }

    func connect() { connected = true }
    func disconnect() { connected = false }
}
