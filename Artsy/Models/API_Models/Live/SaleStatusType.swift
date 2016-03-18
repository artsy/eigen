import Foundation

enum SaleAvailabilityState {
    case NotYetOpen
    case Active
    case Closed
}

protocol SaleStatusType {
    var startDate: NSDate! { get }
    func isCurrentlyActive() -> Bool
}

extension SaleStatusType {

    var saleAvailability: SaleAvailabilityState {
        if isCurrentlyActive() { return .Active }
        if startDate.laterDate(NSDate()) == startDate { return .NotYetOpen }
        return .Closed
    }
}

extension LiveSale: SaleStatusType { }
extension Sale: SaleStatusType { }
