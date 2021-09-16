import Foundation
import Interstellar

/// Represents the whole auction, all the live biz, timings, watchers

protocol LiveAuctionViewModelType: class {
    var startDate: Date { get }
    var lotCount: Int { get }

    var saleAvailabilitySignal: Observable<SaleAvailabilityState> { get }
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> { get }
    var auctionState: ARAuctionState { get }

    func distanceFromCurrentLot(_ lot: LiveAuctionLotViewModelType) -> Int?
}

class LiveAuctionViewModel: NSObject, LiveAuctionViewModelType {

    fileprivate var sale: LiveSale
    fileprivate var lastUpdatedSaleAvailability: SaleAvailabilityState

    let saleAvailabilitySignal = Observable<SaleAvailabilityState>()
    let currentLotSignal: Observable<LiveAuctionLotViewModelType?>

    // When the bidder status changes, we get a full object refresh
    let biddingCredentials: BiddingCredentials

    init(sale: LiveSale, currentLotSignal: Observable<LiveAuctionLotViewModelType?>, biddingCredentials: BiddingCredentials) {
        self.sale = sale
        self.lastUpdatedSaleAvailability = sale.saleAvailability
        saleAvailabilitySignal.update(lastUpdatedSaleAvailability)
        self.currentLotSignal = currentLotSignal
        self.biddingCredentials = biddingCredentials
    }

    var startDate: Date {
        return sale.startDate
    }

    var lotCount: Int {
        return sale.saleArtworks.count
    }

    var auctionState: ARAuctionState {
        return sale.auctionStateWithBidders(biddingCredentials.bidders)
    }

    /// A distance relative to the current lot, -x being that it precedded the current
    /// 0 being it is current and a positive number meaning it upcoming.
    func distanceFromCurrentLot(_ lot: LiveAuctionLotViewModelType) -> Int? {
        guard let _lastUpdatedCurrentLot = currentLotSignal.peek() else { return nil }
        guard let lastUpdatedCurrentLot = _lastUpdatedCurrentLot else { return nil }

        let lotIDs = sale.saleArtworks.map { $0.liveAuctionLotID }

        let currentIndex = lotIDs.firstIndex(of: lastUpdatedCurrentLot.lotID)
        let lotIndex = lotIDs.firstIndex(of: lot.liveAuctionLotID)
        guard let current = currentIndex, let lot = lotIndex else { return nil }

        return (current - lot) * -1
    }
}

extension LiveSale: SaleAuctionStatusType { }
