import Foundation
import Interstellar

/// Represents the whole auction, all the live biz, timings, watchers

protocol LiveAuctionViewModelType: class {
    var startDate: NSDate { get }
    var lotCount: Int { get }
    var saleAvailabilitySignal: Signal<SaleAvailabilityState> { get }
    func distanceFromCurrentLot(lot: LiveAuctionLot) -> Int?
}

class LiveAuctionViewModel: NSObject, LiveAuctionViewModelType {

    private var sale: LiveSale
    private var lastUpdatedSaleAvailability: SaleAvailabilityState

    init(sale: LiveSale) {
        self.sale = sale
        self.lastUpdatedSaleAvailability = sale.saleAvailability
        saleAvailabilitySignal.update(lastUpdatedSaleAvailability)
    }

    var startDate: NSDate {
        return sale.startDate
    }

    var lotCount: Int {
        return sale.lotIDs.count
    }

    let saleAvailabilitySignal = Signal<SaleAvailabilityState>()

    /// A distance relative to the current lot, -x being that it precedded the current
    /// 0 being it is current and a positive number meaning it upcoming.
    func distanceFromCurrentLot(lot: LiveAuctionLot) -> Int? {
        let currentIndex =  Optional(0) // TODO: Put this back sale.lotIDs.indexOf(sale.currentLotId)
        let lotIndex = sale.lotIDs.indexOf(lot.liveAuctionLotID)
        guard let current = currentIndex, lot = lotIndex else { return nil }
        return (current - lot) * -1
    }

    func updateWithNewSale(newSale: LiveSale) {
        if lastUpdatedSaleAvailability != newSale.saleAvailability {
            lastUpdatedSaleAvailability = newSale.saleAvailability
            saleAvailabilitySignal.update(newSale.saleAvailability)
        }

        self.sale = newSale
    }
}
