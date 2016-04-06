import Foundation
import Interstellar

/*
Independent of sockets:
- time elapsed

Based on socket events:
- lot state (bidding not yet, bidding open, bidding closed)
- reserve status
- # of bids
- # of watchers
- next bid amount $
- bid history
*/

class LiveAuctionStateManager: NSObject {
    typealias SocketCommunicatorCreator = (host: String, saleID: String, accessToken: String) -> LiveAuctionSocketCommunicatorType
    typealias StaticDataFetcherCreator = (saleID: String) -> LiveAuctionStaticDataFetcherType
    typealias StateReconcilerCreator = () -> LiveAuctionStateReconcilerType

    let saleID: String

    private let socketCommunicator: LiveAuctionSocketCommunicatorType
    private let staticDataFetcher: LiveAuctionStaticDataFetcherType
    private let stateReconciler: LiveAuctionStateReconcilerType

    init(host: String,
        saleID: String,
        accessToken: String,
        socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
        staticDataFetcherCreator: StaticDataFetcherCreator = LiveAuctionStateManager.defaultStaticDataFetcherCreator(),
        stateReconcilerCreator: StateReconcilerCreator = LiveAuctionStateManager.defaultStateReconcilerCreator()) {

        self.saleID = saleID
        self.socketCommunicator = socketCommunicatorCreator(host: host, saleID: saleID, accessToken: accessToken)
        self.staticDataFetcher = staticDataFetcherCreator(saleID: saleID)
        self.stateReconciler = stateReconcilerCreator()

        super.init()

        staticDataFetcher.fetchStaticData().next { [weak self] saleArtworks in
            self?.stateReconciler.updateStaticData(saleArtworks)
            self?.socketCommunicator.connect()
        }

        socketCommunicator.delegate = self
    }
}

private typealias PublicFunctions = LiveAuctionStateManager
extension PublicFunctions {

    func bidOnLot(lotID: String) {
        socketCommunicator.bidOnLot(lotID)
    }

    func leaveMaxBidOnLot(lotID: String) {
        socketCommunicator.leaveMaxBidOnLot(lotID)
    }
}

private typealias ComputedProperties = LiveAuctionStateManager
extension ComputedProperties {
    var newLotsSignal: Signal<[LiveAuctionLotViewModelType]> {
        return stateReconciler.newLotsSignal
    }

    var currentLotSignal: Signal<LiveAuctionLotViewModelType> {
        return stateReconciler.currentLotSignal
    }

    var saleSignal: Signal<LiveAuctionViewModelType> {
        return stateReconciler.saleSignal
    }
}


private typealias SocketDelegate = LiveAuctionStateManager
extension SocketDelegate: LiveAuctionSocketCommunicatorDelegate {
    func didUpdateAuctionState(state: AnyObject) {
        stateReconciler.updateSocketState(state)
    }
}


private typealias DefaultCreators = LiveAuctionStateManager
extension DefaultCreators {
    class func defaultSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, accessToken, saleID in
            return LiveAuctionSocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
        }
    }

    class func defaultStaticDataFetcherCreator() -> StaticDataFetcherCreator {
        return { saleID in
            return LiveAuctionStaticDataFetcher(saleID: saleID)
        }
    }

    class func stubbedStaticDataFetcherCreator() -> StaticDataFetcherCreator {
        return { saleID in
            return Stub_StaticDataFetcher()
        }
    }

    class func defaultStateReconcilerCreator() -> StateReconcilerCreator {
        return {
            return LiveAuctionStateReconciler()
        }
    }

}

func loadJSON(filename: String) -> AnyObject {
    let jsonPath = NSBundle.mainBundle().pathForResource(filename, ofType: "json")
    let jsonData = NSData(contentsOfFile: jsonPath!)!
    let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

    return json
}

class Stub_StaticDataFetcher: LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Signal<[SaleArtwork]> {
        let signal = Signal<[SaleArtwork]>()

        let json = loadJSON("live_static_data")
        signal.update(parseSaleArtworks(json)!)

        return signal
    }
}
