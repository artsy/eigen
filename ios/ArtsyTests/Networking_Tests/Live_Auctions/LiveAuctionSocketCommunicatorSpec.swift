import Quick
import Nimble
import SwiftyJSON
import Starscream

@testable
import Artsy

var socket: MockWebSocket!

class LiveAuctionSocketCommunicatorSpec: QuickSpec {
    override func spec() {
        let host = "squiggly host"
        let jwt = StubbedCredentials.registered.jwt


        let saleID = "honest ed's bargain basement"

        beforeEach {
            let mockWebSocket = MockWebSocket(request: URLRequest(url: URL(string: "ws://test.host")!))
            socket = mockWebSocket
        }

        it("connects the socket on initialization") {
            let subject = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator())

            expect(socket.isConnected) == true

            _ = subject // Keep a reference around until after expect()
        }

        it("disconnects the socket when deallocated") {
            do {
                _ = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator())
            }

            expect(socket.isConnected) == false
        }

        it("sends authentication once connected") {
            let subject = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator())

            let connectEvent : WebSocketEvent = .connected(["some": "string"])
            socket.onEvent?(connectEvent)

            let authCalls = socket.writes.filter { $0 == "{\"type\":\"Authorize\",\"jwt\":\"\(jwt.string)\"}" }
            expect(authCalls).to( haveCount(1) )

            _ = subject // Keep a reference around until after expect()
        }

        it("listens for updated auction state") {
            _ = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator())

            expect(socket.onEvent).toNot( beNil() )
        }

        it("sends its updatedAuctionState observable its updated auction state") {
            let subject = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator())

            // "emit" the socket event from the server
            let state = "{\"type\":\"InitialFullSaleState\",\"currentLotId\":\"54c7ecc27261692b5e420600\",\"fullLotStateById\":{}}"
            let event : WebSocketEvent = .text(state)
            socket.onEvent?(event)

            expect(subject.updatedAuctionState.peek() ).toNot( beNil() )
        }

        describe("connected") {
            var subject: LiveAuctionSocketCommunicatorType!
            let bidderCredentials = BiddingCredentials(bidders: [qualifiedBidder], paddleNumber: "123456", userID: "abcd")

            beforeEach {
                subject = LiveAuctionSocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt, socketCreator: test_SocketCreator())
            }

            func checkForClientMetadata() {
                expect(socket.writes).to( haveCount(1) )
                let json = JSON(parseJSON: socket.writes[0])
                expect(json["event"]["clientMetadata"].dictionary).toNot( beNil() )
                expect(json["event"]["clientMetadata"]["User-Agent"].string).to( contain("Artsy", "Eigen") )
            }

            it("includes clientMetadata in event JSON when bidding") {
                subject.bidOnLot("lot-od", amountCents: 100, bidderCredentials: bidderCredentials, bidUUID: "")
                checkForClientMetadata()
            }

            it("includes clientMetadata in event JSON when leaving a max bid") {
                subject.leaveMaxBidOnLot("lot-id", amountCents: 100, bidderCredentials: bidderCredentials, bidUUID: "")
                checkForClientMetadata()
            }
        }
    }
}

func test_SocketCreator() -> LiveAuctionSocketCommunicator.SocketCreator {
    return { host, causalitySaleID in
        return socket
    }
}

class MockWebSocket: WebSocketType {
    weak var delegate: WebSocketDelegate?
    var onEvent: ((WebSocketEvent) -> Void)?
    var request: URLRequest
    var callbackQueue: DispatchQueue = .main

    var writes: [String] = []
    var isConnected: Bool = false

    init(request: URLRequest) {
        self.request = request
    }

    func connect() {
        isConnected = true
        callbackQueue.async { [weak self] in
            self?.onEvent?(.connected(["some":"string"]))
        }
    }

    func disconnect(closeCode: UInt16 = CloseCode.normal.rawValue) {
        isConnected = false
        callbackQueue.async { [weak self] in
            self?.onEvent?(.disconnected("Mock disconnect", closeCode))
        }
    }

    func write(string: String, completion: (() -> ())?) {
        writes.append(string)
        completion?()
    }
}

