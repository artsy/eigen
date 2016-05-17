import Foundation
import Interstellar

/// Represents the whole auction, all the live biz, timings, watchers

protocol LiveAuctionViewModelType: class {
    var startDate: NSDate { get }
    var lotCount: Int { get }
    var saleAvailabilitySignal: Observable<SaleAvailabilityState> { get }
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> { get }
    func distanceFromCurrentLot(lot: LiveAuctionLotViewModelType) -> Int?
}

class LiveAuctionViewModel: NSObject, LiveAuctionViewModelType {

    private var sale: LiveSale
    private var lastUpdatedSaleAvailability: SaleAvailabilityState

    let saleAvailabilitySignal = Observable<SaleAvailabilityState>()
    let currentLotSignal: Observable<LiveAuctionLotViewModelType?>

    init(sale: LiveSale, currentLotSignal: Observable<LiveAuctionLotViewModelType?>) {
        self.sale = sale
        self.lastUpdatedSaleAvailability = sale.saleAvailability
        saleAvailabilitySignal.update(lastUpdatedSaleAvailability)
        self.currentLotSignal = currentLotSignal
    }

    var startDate: NSDate {
        return sale.startDate
    }

    var lotCount: Int {
        return sale.saleArtworks.count
    }

    /// A distance relative to the current lot, -x being that it precedded the current
    /// 0 being it is current and a positive number meaning it upcoming.
    func distanceFromCurrentLot(lot: LiveAuctionLotViewModelType) -> Int? {
        guard let _lastUpdatedCurrentLot = currentLotSignal.peek() else { return nil }
        guard let lastUpdatedCurrentLot = _lastUpdatedCurrentLot else { return nil }

        let lotIDs = sale.saleArtworks.map { $0.liveAuctionLotID }

        let currentIndex = lotIDs.indexOf(lastUpdatedCurrentLot.lotID)
        let lotIndex = lotIDs.indexOf(lot.liveAuctionLotID)
        guard let current = currentIndex, lot = lotIndex else { return nil }

        return (current - lot) * -1
    }
}
