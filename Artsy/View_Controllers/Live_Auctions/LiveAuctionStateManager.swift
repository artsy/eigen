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
    typealias StateFetcherCreator = (host: String, saleID: String) -> LiveAuctionStateFetcherType
    typealias StaticDataFetcherCreator = (saleID: String) -> LiveAuctionStaticDataFetcherType
    typealias StateReconcilerCreator = () -> LiveAuctionStateReconcilerType

    let saleID: String

    private let socketCommunicator: LiveAuctionSocketCommunicatorType
    private let stateFetcher: LiveAuctionStateFetcherType
    private let staticDataFetcher: LiveAuctionStaticDataFetcherType
    private let stateReconciler: LiveAuctionStateReconcilerType

    init(host: String,
        saleID: String,
        accessToken: String,
        socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
        stateFetcherCreator: StateFetcherCreator = LiveAuctionStateManager.defaultStateFetcherCreator(),
        staticDataFetcherCreator: StaticDataFetcherCreator = LiveAuctionStateManager.defaultStaticDataFetcherCreator(),
        stateReconcilerCreator: StateReconcilerCreator = LiveAuctionStateManager.defaultStateReconcilerCreator()) {

        self.saleID = saleID
        self.socketCommunicator = socketCommunicatorCreator(host: host, saleID: saleID, accessToken: accessToken)
        self.stateFetcher = stateFetcherCreator(host: host, saleID: saleID)
        self.staticDataFetcher = staticDataFetcherCreator(saleID: saleID)
        self.stateReconciler = stateReconcilerCreator()

        super.init()

        staticDataFetcher.fetchStaticData().next {staticData in
            print("Static Data: \(staticData)")
        }

        stateFetcher.fetchSale().next { [weak self] state in
            self?.stateReconciler.updateState(state)
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
    var newLotsSignal: Observable<[LiveAuctionLotViewModelType]> {
        return stateReconciler.newLotsSignal
    }

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return stateReconciler.currentLotSignal
    }

    var saleSignal: Observable<LiveAuctionViewModelType> {
        return stateReconciler.saleSignal
    }
}


private typealias SocketDelegate = LiveAuctionStateManager
extension SocketDelegate: LiveAuctionSocketCommunicatorDelegate {
    func didUpdateAuctionState(state: AnyObject) {
        stateReconciler.updateState(state)
    }
}


private typealias DefaultCreators = LiveAuctionStateManager
extension DefaultCreators {
    class func defaultSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, accessToken, saleID in
            return LiveAuctionSocketCommunicator(host: host, saleID: saleID, accessToken: accessToken)
        }
    }

    class func defaultStateFetcherCreator() -> StateFetcherCreator {
        return { host, saleID in
            return LiveAuctionStateFetcher(host: host, saleID: saleID)
        }
    }

    class func defaultStaticDataFetcherCreator() -> StaticDataFetcherCreator {
        return { saleID in
            return LiveAuctionStaticDataFetcher(saleID: saleID)
        }
    }

    class func defaultStateReconcilerCreator() -> StateReconcilerCreator {
        return {
            return LiveAuctionStateReconciler()
        }
    }

    class func stubbedStateFetcherCreator() -> StateFetcherCreator {
        return { _, _ in
            return Stub_StateFetcher()
        }
    }

    class func stubbedStaticDataFetcherCreator() -> StaticDataFetcherCreator {
        return { _ in
            return Stub_StaticDataFetcher()
        }
    }
}

class Stub_StateFetcher: LiveAuctionStateFetcherType {
    func fetchSale() -> Observable<Result<AnyObject>> {
        let signal = Observable<Result<AnyObject>>()

        let jsonPath = NSBundle.mainBundle().pathForResource("live_auctions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

        signal.update(.Success(json))

        return signal
    }
}

class Stub_StaticDataFetcher: LiveAuctionStaticDataFetcherType {

    func fetchStaticData() -> Observable<Result<AnyObject>> {
        let signal = Observable<Result<AnyObject>>()
        return signal
    }
}
