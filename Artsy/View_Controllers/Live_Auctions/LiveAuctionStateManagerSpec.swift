import Quick
import Nimble
import Interstellar
@testable
import Artsy

class LiveAuctionStateManagerSpec: QuickSpec {
    override func spec() {
        var subject: LiveAuctionStateManager!
        var sale: LiveSale!
        let stubbedJWT = StubbedCredentials.registered.jwt

        beforeEach {
            OHHTTPStubs.stubJSONResponse(forHost: "metaphysics*.artsy.net", withResponse: [:])
            // Not sure why ^ is needed, might be worth looking

            sale = testLiveSale()

            let creds = BiddingCredentials(bidders: [], paddleNumber: "")
            subject = LiveAuctionStateManager(host: "http://localhost", sale: sale, saleArtworks: [], jwt: stubbedJWT, bidderCredentials: creds, socketCommunicatorCreator: test_socketCommunicatorCreator(), stateReconcilerCreator: test_stateReconcilerCreator())
        }

        it("sets its saleID and bidders upon initialization") {
            expect(subject.bidderCredentials.bidders).to( beEmpty() )
            expect(subject.sale) === sale
        }

        it("creates an appropriate socket communicator") {
            expect(mostRecentSocketCommunicator?.host) == "http://localhost"
            expect(mostRecentSocketCommunicator?.jwt.string) == stubbedJWT.string
            expect(mostRecentSocketCommunicator?.causalitySaleID) == "some-random-string-of-nc72bjzj7"
        }

        it("invokes the state reconciler when new snapshot data avaialble") {
            let state = ["hi there!"]
            mostRecentSocketCommunicator?.updatedAuctionState.update(state as AnyObject)

            expect(mostRecentStateReconciler?.mostRecentState as? [String]) == state
        }

        it("invokes current lot updates") {
            let currentLot = ["hi there!"]
            mostRecentSocketCommunicator?.currentLotUpdate.update(currentLot as AnyObject)

            expect(mostRecentStateReconciler?.mostRecentCurrentLotUpdate as? [String]) == currentLot
        }

        it("invokes lot event updates") {
            let lotEvent = ["hi there!"]
            mostRecentSocketCommunicator?.lotUpdateBroadcasts.update(lotEvent as AnyObject)

            expect(mostRecentStateReconciler?.mostRecentEventBroadcast as? [String]) == lotEvent
        }
    }
}


func test_socketCommunicatorCreator() -> LiveAuctionStateManager.SocketCommunicatorCreator {
    return { host, saleID, jwt in
        return Test_SocketCommunicator(host: host, causalitySaleID: saleID, jwt: jwt)
    }
}

func test_stateReconcilerCreator() -> LiveAuctionStateManager.StateReconcilerCreator {
    return { saleArtworks in
        return Test_StateRecociler()
    }
}

var mostRecentSocketCommunicator: Test_SocketCommunicator?

class Test_SocketCommunicator: LiveAuctionSocketCommunicatorType {

    let host: String
    let causalitySaleID: String
    let jwt: JWT

    init(host: String, causalitySaleID: String, jwt: JWT) {
        self.host = host
        self.causalitySaleID = causalitySaleID
        self.jwt = jwt

        mostRecentSocketCommunicator = self
    }

    let updatedAuctionState = Observable<AnyObject>()
    let lotUpdateBroadcasts = Observable<AnyObject>()
    let currentLotUpdate = Observable<AnyObject>()
    let postEventResponses = Observable<AnyObject>()
    let socketConnectionSignal = Observable<Bool>()
    let operatorConnectedSignal = Observable<AnyObject>()
    let saleOnHoldSignal = Observable<AnyObject>()
    func bidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {}
    func leaveMaxBidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {}
}

var mostRecentStateReconciler: Test_StateRecociler?

class Test_StateRecociler: LiveAuctionStateReconcilerType {
    var mostRecentState: AnyObject?
    var mostRecentEventBroadcast: AnyObject?
    var mostRecentCurrentLotUpdate: AnyObject?
    var mostRecentEvent: AnyObject?
    var debugAllEventsSignal = Observable<LotEventJSON>()

    init() {
        mostRecentStateReconciler = self
    }

    func updateState(_ state: AnyObject) {
        mostRecentState = state
    }

    func processNewEvents(_ event: AnyObject) {
        mostRecentEvent = event
    }

    func processLotEventBroadcast(_ broadcast: AnyObject) {
        mostRecentEventBroadcast = broadcast
    }

    func processCurrentLotUpdate(_ update: AnyObject) {
        mostRecentCurrentLotUpdate = update
    }

    var newLotsSignal: Observable<[LiveAuctionLotViewModelType]> { return Observable() }
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> { return Observable() }
    var saleSignal: Observable<LiveAuctionViewModelType> { return Observable() }
}
