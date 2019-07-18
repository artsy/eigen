import Foundation
import Interstellar

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType: class {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> { get }
    var initialStateLoadedSignal: Observable<Void> { get }

    /// Current lot "in focus" based on the page view controller.
    var currentFocusedLotIndex: Observable<Int> { get }

    var auctionViewModel: LiveAuctionViewModelType { get }
    var lotCount: Int { get }
    var liveSaleID: String { get }
    var liveSaleName: String { get }
    var bidIncrements: [BidIncrementStrategy] { get }

    func lotViewModelForIndex(_ index: Int) -> LiveAuctionLotViewModelType
    func indexForViewModel(_ viewModel: LiveAuctionLotViewModelType) -> Int?
    func lotViewModelRelativeToShowingIndex(_ offset: Int) -> LiveAuctionLotViewModelType
    func askingPriceString(_ lot: LiveAuctionLotViewModelType) -> String
    func winningLotValueString(_ lot: LiveAuctionLotViewModelType) -> String?

    func bidOnLot(_ lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)
    func leaveMaxBidOnLot(_ lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType)

    // When we connect/disconnect true/false is sent down
    var socketConnectionSignal: Observable<Bool> { get }
    var operatorConnectedSignal: Observable<Bool> { get }
    var saleOnHoldSignal: Observable<(isOnHold: Bool, message: String?)> { get }

    /// Lets a client hook in to listen to all events
    /// shoud not be used outside of developer tools.
    var debugAllEventsSignal: Observable<LotEventJSON> { get }
}

class LiveAuctionsSalesPerson: NSObject, LiveAuctionsSalesPersonType {

    typealias StateManagerCreator = (_ host: String, _ sale: LiveSale, _ saleArtworks: [LiveAuctionLotViewModel], _ jwt: JWT, _ bidderCredentials: BiddingCredentials) -> LiveAuctionStateManager
    typealias AuctionViewModelCreator = (_ sale: LiveSale, _ currentLotSignal: Observable<LiveAuctionLotViewModelType?>, _ biddingCredentials: BiddingCredentials) -> LiveAuctionViewModelType

    let sale: LiveSale
    let lots: [LiveAuctionLotViewModel]

    let dataReadyForInitialDisplay = Observable<Void>()
    let auctionViewModel: LiveAuctionViewModelType

    var socketConnectionSignal: Observable<Bool> {
        return stateManager.socketConnectionSignal
    }

    fileprivate let stateManager: LiveAuctionStateManager
    fileprivate let bidderCredentials: BiddingCredentials

    // Lot currently being looked at by the user. Defaults to zero, the first lot in a sale.
    var currentFocusedLotIndex = Observable(0)
    var initialStateLoadedSignal: Observable<Void> {
        return stateManager.initialStateLoadedSignal
    }

    init(sale: LiveSale,
         jwt: JWT,
         biddingCredentials: BiddingCredentials,
         defaults: UserDefaults = UserDefaults.standard,
         stateManagerCreator: StateManagerCreator = LiveAuctionsSalesPerson.defaultStateManagerCreator(),
         auctionViewModelCreator: AuctionViewModelCreator = LiveAuctionsSalesPerson.defaultAuctionViewModelCreator()) {

        self.sale = sale
        self.lots = sale.saleArtworks.map { LiveAuctionLotViewModel(lot: $0, bidderCredentials: biddingCredentials) }
        self.bidderCredentials = biddingCredentials

        let host = ARRouter.baseCausalitySocketURLString()!

        self.stateManager = stateManagerCreator(host, sale, self.lots, jwt, biddingCredentials)
        self.auctionViewModel = auctionViewModelCreator(sale, stateManager.currentLotSignal, biddingCredentials)
    }

    lazy var bidIncrements: [BidIncrementStrategy] = { [weak self] in
        // It's very unikely the API would fail to send us bid increments, but just in case, let's avoid a crash.
        guard let bidIncrements = self?.sale.bidIncrementStrategy else { return [] }
        return bidIncrements.sorted()
    }()

    func askingPriceString(_ lot: LiveAuctionLotViewModelType) -> String {
        return lot.askingPrice.convertToDollarString(lot.currencySymbol)
    }

    func winningLotValueString(_ lot: LiveAuctionLotViewModelType) -> String? {
        guard let winningBidPrice = lot.winningBidPrice else { return nil }

        return winningBidPrice.convertToDollarString(lot.currencySymbol)
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
        let saleName = sale.name
        // Bit of a hack until we have our server-side stuff figured out. If the sale name has a :, it's likely
        // "Partner Name: The Awesome Sale", and we want just "Partner Name"
        let colonRange = saleName?.range(of: ":", options: [], range: nil, locale: nil)

        if colonRange != nil {
            return saleName!.components(separatedBy: ":").first!
        } else {
            return saleName!
        }
    }

    var debugAllEventsSignal: Observable<LotEventJSON> {
        return stateManager.debugAllEventsSignal
    }

    var operatorConnectedSignal: Observable<Bool> {
        return stateManager.operatorConnectedSignal
    }

    var saleOnHoldSignal: Observable<(isOnHold: Bool, message: String?)> {
        return stateManager.saleOnHoldSignal
    }
}

private typealias PublicFunctions = LiveAuctionsSalesPerson
extension LiveAuctionsSalesPerson {

    // Returns nil if there is no current lot.
    func lotViewModelRelativeToShowingIndex(_ offset: Int) -> LiveAuctionLotViewModelType {
        let currentlyShowingIndex = currentFocusedLotIndex.peek() ?? 0 // The coalesce is only to satisfy the compiler, should never happen since the currentFocusedLotIndex is created with an initial value.

        // Apply the offset
        let newIndex = currentlyShowingIndex + offset
        var loopingIndex = newIndex

        // Guarantee the offset is within the bounds of our array.
        repeat {
            if loopingIndex >= lotCount {
                loopingIndex -= lotCount
            } else if loopingIndex < 0 {
                loopingIndex += lotCount
            } else {
                loopingIndex = newIndex
            }
        } while !lots.indices.contains(loopingIndex)

        return lotViewModelForIndex(loopingIndex)
    }

    func lotViewModelForIndex(_ index: Int) -> LiveAuctionLotViewModelType {
        return lots[index]
    }

    // Performs a linear scan through all the lots, use parsimoniously.
    func indexForViewModel(_ viewModel: LiveAuctionLotViewModelType) -> Int? {
        return lots.index { $0.lotID == viewModel.lotID }
    }

    func bidOnLot(_ lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        guard let askingPrice = lot.askingPriceSignal.peek() else { return }
        stateManager.bidOnLot(lot.lotID, amountCents: askingPrice, biddingViewModel: biddingViewModel)
    }

    func leaveMaxBidOnLot(_ lot: LiveAuctionLotViewModelType, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
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
