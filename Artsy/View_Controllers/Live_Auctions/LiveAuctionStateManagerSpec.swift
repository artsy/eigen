import Quick
import Nimble
import Interstellar
@testable
import Artsy

class LiveAuctionStateManagerSpec: QuickSpec {
    override func spec() {
        var subject: LiveAuctionStateManager!

        beforeEach {
            subject = LiveAuctionStateManager(host: "http://localhost", saleID: "sale-id", accessToken: "abcdefg", socketCommunicatorCreator: test_socketCommunicatorCreator(), staticDataFetcherCreator: test_staticDataFetcherCreator(), stateReconcilerCreator: test_stateReconcilerCreator())
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

        it("invokes the state reconciler when new sale artworks are available") {
            let saleArtworks = [test_saleArtworkWithLotNumber(1, artistName: "Artist Names are Passé", bidCount: 10, highestBidCents: 1000_00)]

            mostRecentStaticDataFetcher?.signal.update(saleArtworks)

            expect(mostRecentStateReconciler?.mostRecentStaticData) == saleArtworks
        }
    }
}

func test_socketCommunicatorCreator() -> LiveAuctionStateManager.SocketCommunicatorCreator {
    return { host, saleID, accessToken in
        return Test_SocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
    }
}

func test_stateReconcilerCreator() -> LiveAuctionStateManager.StateReconcilerCreator {
    return {
        return Test_StateRecociler()
    }
}

func test_staticDataFetcherCreator() -> LiveAuctionStateManager.StaticDataFetcherCreator {
    return { _ in
        return Test_StaticDataFetcher()
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
    func connect() { }
}

var mostRecentStateReconciler: Test_StateRecociler?
var mostRecentStaticDataFetcher: Test_StaticDataFetcher?

class Test_StateRecociler: LiveAuctionStateReconcilerType {
    var mostRecentState: AnyObject?
    var mostRecentStaticData: [SaleArtwork]?

    init() {
        mostRecentStateReconciler = self
    }

    func updateSocketState(state: AnyObject) {
        mostRecentState = state
    }

    func updateStaticData(saleArtworks: [SaleArtwork]) {
        mostRecentStaticData = saleArtworks
    }
    
    var newLotsSignal: Signal<[LiveAuctionLotViewModelType]> { return Signal() }
    var currentLotSignal: Signal<LiveAuctionLotViewModelType> { return Signal() }
    var saleSignal: Signal<LiveAuctionViewModelType> { return Signal() }
}

class Test_StaticDataFetcher: LiveAuctionStaticDataFetcherType {
    let signal = Signal<[SaleArtwork]>()

    init() {
        mostRecentStaticDataFetcher = self
    }

    func fetchStaticData() -> Signal<[SaleArtwork]> {
        return signal
    }
}
