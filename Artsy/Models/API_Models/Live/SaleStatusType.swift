import Foundation

enum SaleAvailabilityState {
    case NotYetOpen
    case Active(liveAuctionDate: NSDate?)
    case Closed
}

extension SaleAvailabilityState: Equatable {}

func ==(l: SaleAvailabilityState, r: SaleAvailabilityState) -> Bool {
    switch (l, r) {
    case (.NotYetOpen, .NotYetOpen): return true
    case (.Closed, .Closed): return true
    case (.Active(let x), .Active(let y)) where x == y: return true
    default: return false
    }
}

protocol SaleStatusType {
    var startDate: NSDate! { get }
    var liveAuctionStartDate: NSDate! { get }

    func isCurrentlyActive() -> Bool
}

extension SaleStatusType {

    var saleAvailability: SaleAvailabilityState {
        if isCurrentlyActive() {
            guard let liveDate = liveAuctionStartDate else { return .Active(liveAuctionDate:nil) }
            return .Active(liveAuctionDate: liveDate)
        }
        if startDate.laterDate(NSDate()) == startDate { return .NotYetOpen }
        return .Closed
    }
}

extension LiveSale: SaleStatusType { }
extension Sale: SaleStatusType { }
