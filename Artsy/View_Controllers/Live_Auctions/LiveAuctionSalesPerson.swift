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
    var bidderStatus: ArtsyAPISaleRegistrationStatus { get }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModelType
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModelType

    func bidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)
    func leaveMaxBidOnLot(lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)
}

class LiveAuctionsSalesPerson:  NSObject, LiveAuctionsSalesPersonType {
    typealias StateManagerCreator = (host: String, sale: LiveSale, saleArtworks: [LiveAuctionLotViewModel], jwt: JWT, bidderID: String?) -> LiveAuctionStateManager

    let sale: LiveSale
    let lots: [LiveAuctionLotViewModel]

    let dataReadyForInitialDisplay = Observable<Void>()
    let auctionViewModel: LiveAuctionViewModelType

    var bidderStatus: ArtsyAPISaleRegistrationStatus {
        return stateManager.bidderStatus
    }

    private let stateManager: LiveAuctionStateManager

    // Lot currently being looked at by the user. Defaults to zero, the first lot in a sale.
    var currentFocusedLotIndex = Observable(0)

    init(sale: LiveSale,
         jwt: JWT,
         bidderID: String?,
         defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults(),
         stateManagerCreator: StateManagerCreator = LiveAuctionsSalesPerson.stubbedStateManagerCreator()) {

        self.sale = sale
        self.lots = sale.saleArtworks.map { LiveAuctionLotViewModel(lot: $0, bidderID: bidderID) }

        let host = ARRouter.baseCausalitySocketURLString()
        self.stateManager = stateManagerCreator(host: host, sale: sale, saleArtworks: self.lots, jwt: jwt, bidderID: bidderID)
        self.auctionViewModel = LiveAuctionViewModel(sale: sale, currentLotSignal: stateManager.currentLotSignal, bidderStatus: stateManager.bidderStatus)
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
        return { host, sale, saleArtworks, jwt, bidderID in
            LiveAuctionStateManager(host: host, sale: sale, saleArtworks: saleArtworks, jwt: jwt, bidderID: bidderID)
        }
    }

    class func stubbedStateManagerCreator() -> StateManagerCreator {
        return { host, sale, saleArtworks, jwt, bidderID in
            LiveAuctionStateManager(host: host, sale: sale, saleArtworks: saleArtworks, jwt: jwt, bidderID: bidderID, socketCommunicatorCreator: LiveAuctionStateManager.stubbedSocketCommunicatorCreator())
        }
    }

}
