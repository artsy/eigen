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

        let hasStarted = startDate.compare(now) == .OrderedAscending
        let hasFinished = endDate.compare(now) == .OrderedAscending
        let notYetStarted = startDate.compare(now) == .OrderedDescending
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

        // TODO: Get better criteria for choosing a bidder, similar to https://github.com/artsy/eigen/pull/1661/files#diff-6d73ebd58fdd2d00c32813f60608fbd1R111
        // TODO: This could go in an Array extension.
        if let bidder = bidders.first {
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
