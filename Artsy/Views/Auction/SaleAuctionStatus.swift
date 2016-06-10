import Foundation

protocol SaleAuctionStatusType {
    var startDate: NSDate! { get }
    var endDate: NSDate! { get }
    var registrationEndsAtDate: NSDate! { get }

    func auctionStateWithBidders(bidders: [Bidder]) -> ARAuctionState
}

extension SaleAuctionStatusType {
    func auctionStateWithBidders(bidders: [Bidder]) -> ARAuctionState {
        var state: ARAuctionState = [.Default]
        let now = ARSystemTime.date()

        // These have a habit of being nil, so let's be _extra_ careful.
        let hasStarted = (startDate != nil && startDate.compare(now) == .OrderedAscending)
        let hasFinished = (endDate != nil && endDate.compare(now) == .OrderedAscending)
        let notYetStarted = (startDate != nil && startDate.compare(now) == .OrderedDescending)
        let registrationClosed = (registrationEndsAtDate != nil && registrationEndsAtDate.compare(now) == .OrderedAscending)

        if notYetStarted {
            state.insert(.ShowingPreview)
        }

        if hasStarted && !hasFinished {
            state.insert(.Started)
        }

        if hasFinished {
            state.insert(.Ended)
        }

        if let bidder = bidders.bestBidder {
            if bidder.saleRequiresBidderApproval && !bidder.qualifiedForBidding {
                state.insert(.UserPendingRegistration)
            } else {
                state.insert(.UserIsRegistered)
            }
        } else if registrationClosed {
            state.insert(.UserRegistrationClosed)
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
