import Foundation
import Artsy_UILabels

class SaleViewModel: NSObject {
    private let sale: Sale
    private let saleArtworks: [SaleArtwork]

    var bidders: [Bidder]

    init(sale: Sale, saleArtworks: [SaleArtwork], bidders: [Bidder]) {
        self.sale = sale
        self.saleArtworks = saleArtworks
        self.bidders = bidders
    }
}

extension SaleViewModel {

    var saleIsClosed: Bool {
        switch saleAvailability {
        case .Closed: return true
        default: return false
        }
    }

    var auctionState: ARAuctionState {
        var state: ARAuctionState = [.Default]
        let now = ARSystemTime.date()

        let hasStarted = sale.startDate.compare(now) == .OrderedAscending
        let hasFinished = sale.endDate.compare(now) == .OrderedAscending
        let notYetStarted = sale.startDate.compare(now) == .OrderedDescending
        let registrationClosed = (sale.registrationEndsAtDate != nil && sale.registrationEndsAtDate.compare(now) == .OrderedAscending)

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

    var backgroundImageURL: NSURL? {
        guard let bannerURL = sale.bannerImageURLString() else { return nil }
        return NSURL(string: bannerURL)
    }

    var profileImageURL: NSURL? {
        guard let profile = sale.profile else { return nil }
        guard let avatarURL = profile.avatarURLString() else { return nil }
        return NSURL(string: avatarURL)
    }

    var saleAvailability: SaleAvailabilityState {
        return sale.saleAvailability
    }

    var currencySymbol: String {
        return saleArtworks.first?.currencySymbol ?? "" // first returns an Optional, returning "" as a precaution.
    }

    // This is used by analytics
    var saleAvailabilityString: String {
        switch saleAvailability {
        case .Active: return "active"
        case .Closed: return "closed"
        case .NotYetOpen: return "preview"
        }
    }

    var isRunningALiveAuction: Bool {
        return sale.liveAuctionStartDate != nil
    }

    var liveAuctionHasStarted: Bool {
        guard let liveStartDate = sale.liveAuctionStartDate else { return false }
        let now = ARSystemTime.date()
        return liveStartDate.laterDate(now) == now
    }

    var saleID: NSString {
        return sale.saleID
    }

    var startDate: NSDate {
        return sale.startDate
    }

    var closingDate: NSDate {
        return sale.endDate
    }

    var isUpcomingAndHasNoLots: Bool {
        return saleAvailability == .NotYetOpen && numberOfLots == 0
    }

    var numberOfLots: Int {
        return saleArtworks.count
    }

    var displayName: String {
        return sale.name
    }

    var saleDescription: String {
        return sale.saleDescription
    }

    var hasBuyersPremium: Bool {
        return sale.hasBuyersPremium()
    }

    /// Provides a range of the smallest-to-largest low estimates.
    var lowEstimateRange: PriceRange {
        return (min: self.smallestLowEstimate, max: self.largestLowEstimate)
    }

    func refinedSaleArtworks(refineSettings: AuctionRefineSettings) -> [SaleArtworkViewModel] {
        return refineSettings.ordering.sortSaleArtworks(saleArtworks)
            .filter(SaleArtwork.includedInRefineSettings(refineSettings))
            .map { saleArtwork in
                return SaleArtworkViewModel(saleArtwork: saleArtwork)
        }
    }

    func subtitleForRefineSettings(refineSettings: AuctionRefineSettings, defaultRefineSettings: AuctionRefineSettings) -> String {
        let numberOfLots = refinedSaleArtworks(refineSettings).count
        var subtitle = "\(numberOfLots) Lots"

        switch refineSettings.ordering {
        case .LotNumber: break
        default:
            subtitle += "・\(refineSettings.ordering.rawValue)"
        }

        if let priceRange = refineSettings.priceRange,
            defaultPriceRange = defaultRefineSettings.priceRange where
            priceRange.min != defaultPriceRange.min ||
            priceRange.max != defaultPriceRange.max {
            subtitle += formattedStringForPriceRange(priceRange)
        }

        return subtitle
    }

    func formattedStringForPriceRange(range: PriceRange) -> String {
        let min = range.min.roundCentsToNearestThousandAndFormat(currencySymbol)
        let max = range.max.roundCentsToNearestThousandAndFormat(currencySymbol)
        return "・\(min)–\(max)"
    }

}

/// Allows us to support spotlight indexing

extension SaleViewModel {
    func registerSaleAsActiveActivity(viewController: UIViewController?) {
        viewController?.userActivity = ARUserActivity(forEntity: sale)
        viewController?.userActivity?.becomeCurrent()
    }
}


extension SaleArtwork: AuctionOrderable {
    var bids: Int {
        return bidCount as? Int ?? 0
    }

    var artistSortableID: String {
        return artwork.artist?.sortableID ?? ""
    }

    var currentBid: Int {
        guard let saleHighestBid = self.saleHighestBid else { return 0 }
        return saleHighestBid.cents as Int
    }
}

/// Private helpers for SaleViewModel

private extension SaleViewModel {

    var smallestLowEstimate: Int {
        return lowEstimates.reduce(Int.max, combine: min)
    }

    var largestLowEstimate: Int {
        return lowEstimates.reduce(Int.min, combine: max)
    }

    var lowEstimates: [Int] {
        return saleArtworks.flatMap { saleArtwork in
            return Int(saleArtwork.lowEstimateCents ?? 0)
        }
    }
}

private extension SaleArtwork {
    class func includedInRefineSettings(refineSettings: AuctionRefineSettings) -> SaleArtwork -> Bool {
        return { saleArtwork in
            // Includes iff the sale artwork's low estimate is within the range, inclusive.
            let (min, max) = (refineSettings.priceRange?.min ?? 0, refineSettings.priceRange?.max ?? 0)

            return (min...max) ~= (saleArtwork.lowEstimateCents as? Int ?? 0)
        }
    }
}
