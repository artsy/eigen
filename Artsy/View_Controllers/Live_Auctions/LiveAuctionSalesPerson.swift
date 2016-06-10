import Foundation
import Interstellar

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> { get }

    /// Current lot "in focus" based on the page view controller.
    var currentFocusedLotIndex: Observable<Int> { get }

    var auctionViewModel: LiveAuctionViewModelType { get }
    var lotCount: Int { get }
    var liveSaleID: String { get }
    var liveSaleName: String { get }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModelType
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModelType

    func bidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)
    func leaveMaxBidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)

    // When we connect/disconnect true/false is sent down
    var socketConnectionSignal: Observable<Bool> { get }
    var operatorConnectedSignal: Observable<Bool> { get }

    /// Lets a client hook in to listen to all events
    /// shoud not be used outside of developer tools.
    var debugAllEventsSignal: Observable<LotEventJSON> { get }
}

class LiveAuctionsSalesPerson: NSObject, LiveAuctionsSalesPersonType {

    typealias StateManagerCreator = (host: String, sale: LiveSale, saleArtworks: [LiveAuctionLotViewModel], jwt: JWT, bidderCredentials: BiddingCredentials) -> LiveAuctionStateManager
    typealias AuctionViewModelCreator = (sale: LiveSale, currentLotSignal: Observable<LiveAuctionLotViewModelType?>, biddingCredentials: BiddingCredentials) -> LiveAuctionViewModelType

    let sale: LiveSale
    let lots: [LiveAuctionLotViewModel]

    let dataReadyForInitialDisplay = Observable<Void>()
    let auctionViewModel: LiveAuctionViewModelType

    var socketConnectionSignal: Observable<Bool> {
        return stateManager.socketConnectionSignal
    }

    private let stateManager: LiveAuctionStateManager
    private let bidderCredentials: BiddingCredentials

    // Lot currently being looked at by the user. Defaults to zero, the first lot in a sale.
    var currentFocusedLotIndex = Observable(0)

    init(sale: LiveSale,
         jwt: JWT,
         biddingCredentials: BiddingCredentials,
         defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults(),
         stateManagerCreator: StateManagerCreator = LiveAuctionsSalesPerson.defaultStateManagerCreator(),
         auctionViewModelCreator: AuctionViewModelCreator = LiveAuctionsSalesPerson.defaultAuctionViewModelCreator()) {

        self.sale = sale
        self.lots = sale.saleArtworks.map { LiveAuctionLotViewModel(lot: $0, bidderCredentials: biddingCredentials) }
        self.bidderCredentials = biddingCredentials

        let useBidderServer = (jwt.role == .Bidder)
        let host = useBidderServer ? ARRouter.baseBidderCausalitySocketURLString() : ARRouter.baseObserverCausalitySocketURLString()

        self.stateManager = stateManagerCreator(host: host, sale: sale, saleArtworks: self.lots, jwt: jwt, bidderCredentials: biddingCredentials)
        self.auctionViewModel = auctionViewModelCreator(sale: sale, currentLotSignal: stateManager.currentLotSignal, biddingCredentials: biddingCredentials)
    }
}

private typealias ComputedProperties = LiveAuctionsSalesPerson
extension ComputedProperties {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> {
        return stateManager.currentLotSignal
    }

    var lotCount: Int {
        return lots.count
    }

    var liveSaleID: String {
        return sale.liveSaleID
    }

    var liveSaleName: String {
        return sale.name
    }

    var debugAllEventsSignal: Observable<LotEventJSON> {
        return stateManager.debugAllEventsSignal
    }

    var operatorConnectedSignal: Observable<Bool> {
        return stateManager.operatorConnectedSignal
    }
}

private typealias PublicFunctions = LiveAuctionsSalesPerson
extension LiveAuctionsSalesPerson {

    // Returns nil if there is no current lot.
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModelType {
        precondition(abs(offset) < lotCount)

        let currentlyShowingIndex = currentFocusedLotIndex.peek() ?? 0 // The coalesce is only to satisfy the compiler, should never happen since the currentFocusedLotIndex is created with an initial value.

        // Apply the offset
        let newIndex = currentlyShowingIndex + offset

        // Guarantee the offset is within the bounds of our array.
        let loopingIndex: Int
        if newIndex >= lotCount {
            loopingIndex = newIndex - lotCount
        } else if newIndex < 0 {
            loopingIndex = newIndex + lotCount
        } else {
            loopingIndex = newIndex
        }

        return lotViewModelForIndex(loopingIndex)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModelType {
        return lots[index]
    }

    func bidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        guard let askingPrice = lot.askingPriceSignal.peek() else { return }
        stateManager.bidOnLot(lot.lotID, amountCents: askingPrice, biddingViewModel: biddingViewModel)
    }

    func leaveMaxBidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        stateManager.leaveMaxBidOnLot(lot.lotID, amountCents: amountCents, biddingViewModel: biddingViewModel)
    }
}

private typealias ClassMethods = LiveAuctionsSalesPerson
extension ClassMethods {

    class func defaultStateManagerCreator() -> StateManagerCreator {
        return { host, sale, saleArtworks, jwt, bidderCredentials in
            LiveAuctionStateManager(host: host, sale: sale, saleArtworks: saleArtworks, jwt: jwt, bidderCredentials: bidderCredentials)
        }
    }

    class func stubbedStateManagerCreator() -> StateManagerCreator {
        return { host, sale, saleArtworks, jwt, bidderCredentials in
            LiveAuctionStateManager(host: host, sale: sale, saleArtworks: saleArtworks, jwt: jwt, bidderCredentials: bidderCredentials, socketCommunicatorCreator: LiveAuctionStateManager.stubbedSocketCommunicatorCreator())
        }
    }

    class func defaultAuctionViewModelCreator() -> AuctionViewModelCreator {
        return { sale, currentLotSignal, biddingCredentials in
            return LiveAuctionViewModel(sale: sale, currentLotSignal: currentLotSignal, biddingCredentials: biddingCredentials)
        }
    }

}
