import Quick
import Nimble
import Interstellar
@testable
import Artsy

class LiveAuctionStateManagerSpec: QuickSpec {
    override func spec() {
        var subject: LiveAuctionStateManager!
        var sale: LiveSale!

        beforeEach {
            OHHTTPStubs.stubJSONResponseForHost("metaphysics-*.artsy.net", withResponse: [:])
            // Not sure why ^ is needed, might be worth looking

            sale = testLiveSale()

            subject = LiveAuctionStateManager(host: "http://localhost", sale: sale, saleArtworks: [], accessToken: "abcdefg", socketCommunicatorCreator: test_socketCommunicatorCreator(), stateReconcilerCreator: test_stateReconcilerCreator())
        }

        it("sets its saleID upon initialization") {
            expect(subject.sale) === sale
        }

        it("creates an appropriate socket communicator") {
            expect(mostRecentSocketCommunicator?.host) == "http://localhost"
            expect(mostRecentSocketCommunicator?.accessToken) == "abcdefg"
            expect(mostRecentSocketCommunicator?.causalitySaleID) == "sale-id"
        }

        it("invokes the state reconciler when new snapshot data avaialble") {
            let state = ["hi there!"]
            mostRecentSocketCommunicator?.updatedAuctionState.update(state)

            expect(mostRecentStateReconciler?.mostRecentState as? [String]) == state
        }
    }
}


func test_socketCommunicatorCreator() -> LiveAuctionStateManager.SocketCommunicatorCreator {
    return { host, saleID, accessToken in
        return Test_SocketCommunicator(host: host, causalitySaleID: saleID, accessToken: accessToken)
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
    let accessToken: String

    init(host: String, causalitySaleID: String, accessToken: String) {
        self.host = host
        self.causalitySaleID = causalitySaleID
        self.accessToken = accessToken

        mostRecentSocketCommunicator = self
    }

    var updatedAuctionState = Observable<AnyObject>()

    func bidOnLot(lotID: String) { }
    func leaveMaxBidOnLot(lotID: String) { }
}

var mostRecentStateReconciler: Test_StateRecociler?

class Test_StateRecociler: LiveAuctionStateReconcilerType {
    var mostRecentState: AnyObject?

    init() {
        mostRecentStateReconciler = self
    }

    func updateState(state: AnyObject) {
        mostRecentState = state
    }
    
    var newLotsSignal: Observable<[LiveAuctionLotViewModelType]> { return Observable() }
    var currentLotSignal: Observable<LiveAuctionLotViewModelType> { return Observable() }
    var saleSignal: Observable<LiveAuctionViewModelType> { return Observable() }
}
