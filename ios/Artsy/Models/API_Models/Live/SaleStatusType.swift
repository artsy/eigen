import Foundation

enum SaleAvailabilityState {
    case notYetOpen
    case active(liveAuctionDate: Date?)
    case closed
}

extension SaleAvailabilityState: Equatable {}

func == (lhs: SaleAvailabilityState, rhs: SaleAvailabilityState) -> Bool {
    switch (lhs, rhs) {
    case (.notYetOpen, .notYetOpen): return true
    case (.closed, .closed): return true
    case (.active(let x), .active(let y)) where x == y: return true
    default: return false
    }
}

protocol SaleStatusType {
    var startDate: Date! { get }
    var liveAuctionStartDate: Date! { get }

    func isCurrentlyActive() -> Bool
}

extension SaleStatusType {

    var saleAvailability: SaleAvailabilityState {
        if isCurrentlyActive() {
            guard let liveDate = liveAuctionStartDate else { return .active(liveAuctionDate:nil) }
            return .active(liveAuctionDate: liveDate)
        }
        if startDate > Date() { return .notYetOpen }
        return .closed
    }
}

extension LiveSale: SaleStatusType { }
extension Sale: SaleStatusType { }
