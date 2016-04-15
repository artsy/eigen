import Quick
import Nimble
import Interstellar
@testable
import Artsy

class LiveAuctionStateManagerSpec: QuickSpec {
    override func spec() {
        var subject: LiveAuctionStateManager!

        beforeEach {
            OHHTTPStubs.stubJSONResponseForHost("metaphysics-*.artsy.net", withResponse: [:])
            // Not sure why ^ is needed, might be worth looking 
            subject = LiveAuctionStateManager(host: "http://localhost", saleID: "sale-id", accessToken: "abcdefg", socketCommunicatorCreator: test_socketCommunicatorCreator(), stateFetcherCreator: test_stateFetcherCreator(), stateReconcilerCreator: test_stateReconcilerCreator())
        }

        it("sets its saleID upon initialization") {
            expect(subject.saleID) == "sale-id"
        }

        it("creates an appropriate socket communicator") {
            expect(mostRecentSocketCommunicator?.host) == "http://localhost"
            expect(mostRecentSocketCommunicator?.accessToken) == "abcdefg"
            expect(mostRecentSocketCommunicator?.saleID) == "sale-id"
        }

        it("sets itself as the socket communicator delegate") {
            expect(mostRecentSocketCommunicator?.delegate) === subject
        }

        it("invokes the state reconciler when new snapshot data avaialble") {
            let state = ["hi there!"]
            subject.didUpdateAuctionState(state)

            expect(mostRecentStateReconciler?.mostRecentState as? [String]) == state
        }
    }
}

func test_socketCommunicatorCreator() -> LiveAuctionStateManager.SocketCommunicatorCreator {
    return { host, saleID, accessToken in
        return Test_SocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
    }
}

func test_stateFetcherCreator() -> LiveAuctionStateManager.StateFetcherCreator {
    return { host, saleID in
        return Test_StateFetcher(host: host, saleID: saleID)
    }
}

func test_stateReconcilerCreator() -> LiveAuctionStateManager.StateReconcilerCreator {
    return {
        return Test_StateRecociler()
    }
}

class Test_StateFetcher: LiveAuctionStateFetcherType {

    let host: String
    let saleID: String

    init(host: String, saleID: String) {
        self.host = host
        self.saleID = saleID
    }

    func fetchSale() -> Signal<AnyObject> {
        return Signal<AnyObject>()
    }
}

var mostRecentSocketCommunicator: Test_SocketCommunicator?

class Test_SocketCommunicator: LiveAuctionSocketCommunicatorType {
    weak var delegate: LiveAuctionSocketCommunicatorDelegate?

    let host: String
    let saleID: String
    let accessToken: String

    init(host: String, saleID: String, accessToken: String) {
        self.host = host
        self.saleID = saleID
        self.accessToken = accessToken

        mostRecentSocketCommunicator = self
    }
    
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
    
    var newLotsSignal: Signal<[LiveAuctionLotViewModelType]> { return Signal() }
    var currentLotSignal: Signal<LiveAuctionLotViewModelType> { return Signal() }
    var saleSignal: Signal<LiveAuctionViewModelType> { return Signal() }
}
