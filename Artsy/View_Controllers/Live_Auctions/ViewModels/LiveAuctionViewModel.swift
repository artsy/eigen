import Foundation
import Interstellar

/// Represents the whole auction, all the live biz, timings, watchers

protocol LiveAuctionViewModelType {
    var startDate: NSDate { get }
    var lotCount: Int { get }
    var saleAvailability: SaleAvailabilityState { get }
    var saleAvailabilitySignal: Signal<SaleAvailabilityState> { get }
    func distanceFromCurrentLot(lot: LiveAuctionLot) -> Int?
}

class LiveAuctionViewModel: NSObject, LiveAuctionViewModelType {

    private let sale: LiveSale

    init(sale: LiveSale) {
        self.sale = sale
    }

    var startDate: NSDate {
        return NSDate()
    }

    var lotCount: Int {
        return sale.lotIDs.count
    }

    var saleAvailability: SaleAvailabilityState {
        return sale.saleAvailability
    }

    var saleAvailabilitySignal: Signal<SaleAvailabilityState> {
        return Signal<SaleAvailabilityState>() // TOOD: Make this actually do things.
    }

    /// A distance relative to the current lot, -x being that it precedded the current
    /// 0 being it is current and a positive number meaning it upcoming.
    func distanceFromCurrentLot(lot: LiveAuctionLot) -> Int? {
        let currentIndex =  Optional(0) // TODO: Put this back sale.lotIDs.indexOf(sale.currentLotId)
        let lotIndex = sale.lotIDs.indexOf(lot.liveAuctionLotID)
        guard let current = currentIndex, lot = lotIndex else { return nil }
        return (current - lot) * -1
    }
}
