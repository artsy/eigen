import Foundation

protocol SaleAuctionStatusType {
    var startDate: Date! { get }
    var saleState: SaleState { get }
    var registrationEndsAtDate: Date! { get }

    func auctionStateWithBidders(_ bidders: [Bidder]) -> ARAuctionState
}

extension SaleAuctionStatusType {
    func auctionStateWithBidders(_ bidders: [Bidder]) -> ARAuctionState {
        var state: ARAuctionState = ARAuctionState()
        let now = ARSystemTime.date()

        // These have a habit of being nil, so let's be _extra_ careful.
        let hasStarted = (startDate != nil && startDate.compare(now!) == .orderedAscending)
        let hasFinished = (saleState == SaleStateClosed)
        let notYetStarted = (startDate != nil && startDate.compare(now!) == .orderedDescending)
        let registrationClosed = (registrationEndsAtDate != nil && registrationEndsAtDate.compare(now!) == .orderedAscending)

        if notYetStarted {
            state.insert(.showingPreview)
        }

        if hasStarted && !hasFinished {
            state.insert(.started)
        }

        if hasFinished {
            state.insert(.ended)
        }

        if let bidder = bidders.bestBidder {
            if bidder.saleRequiresBidderApproval && !bidder.qualifiedForBidding {
                state.insert(.userPendingRegistration)
            } else {
                state.insert(.userIsRegistered)
            }
        } else if registrationClosed {
            state.insert(.userRegistrationClosed)
        }

        return state
    }
}

protocol BidderType {
    var qualifiedForBidding: Bool { get }
}

extension Bidder: BidderType { }

extension Array where Element: BidderType {
    var bestBidder: Element? {
        // If we contain a bidder that is qualified, return it.
        if let qualifiedBidder = filter({ $0.qualifiedForBidding }).first {
            return qualifiedBidder
        }
        // Otherwise, just return our first bidder.
        return first
    }
}
