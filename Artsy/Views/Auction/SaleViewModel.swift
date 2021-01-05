import Foundation

class SaleViewModel: NSObject {
    fileprivate let sale: Sale
    fileprivate let me: User
    fileprivate let saleArtworks: [SaleArtwork]
    let promotedSaleArtworks: [SaleArtwork]?

    var bidders: [Bidder]

    init(sale: Sale, saleArtworks: [SaleArtwork], promotedSaleArtworks: [SaleArtwork]? = nil, bidders: [Bidder], me: User) {
        self.sale = sale
        self.saleArtworks = saleArtworks
        self.promotedSaleArtworks = promotedSaleArtworks
        self.bidders = bidders
        self.me = me
    }

    var saleIsClosed: Bool {
        switch saleAvailability {
        case .closed: return true
        default: return false
        }
    }

    var requireIdentityVerification: Bool {
        return sale.requireIdentityVerification
    }

    var identityVerified: Bool {
        return me.identityVerified
    }

    var auctionState: ARAuctionState {
        return sale.auctionStateWithBidders(bidders)
    }

    var backgroundImageURL: URL? {
        guard let bannerURL = sale.bannerImageURLString() else { return nil }
        return URL(string: bannerURL)
    }

    var profileImageURL: URL? {
        guard let profile = sale.profile else { return nil }
        guard let avatarURL = profile.avatarURLString() else { return nil }
        return URL(string: avatarURL)
    }

    var saleAvailability: SaleAvailabilityState {
        return sale.saleAvailability
    }

    var currencySymbol: String {
        return saleArtworks.first?.currencySymbol ?? "" // first returns an Optional, returning "" as a precaution.
    }

    // This is used by analytics
    @objc var saleAvailabilityString: String {
        switch saleAvailability {
        case .active: return "active"
        case .closed: return "closed"
        case .notYetOpen: return "preview"
        }
    }

    var liveAuctionStartDate: Date? {
        return sale.liveAuctionStartDate as Date?
    }

    var isRunningALiveAuction: Bool {
        return liveAuctionStartDate != nil
    }

    var shouldShowLiveInterface: Bool {
        return sale.shouldShowLiveInterface()
    }

    var timeToLiveStart: TimeInterval? {
        guard let liveStartDate = sale.liveAuctionStartDate else { return nil }

        let now = ARSystemTime.date()
        let timeInterval = liveStartDate.timeIntervalSince(now!)
        return (timeInterval > 0 ? timeInterval : nil)
    }

    var saleID: NSString {
        return sale.saleID as NSString
    }

    var startDate: Date {
        return sale.startDate
    }

    var closingDate: Date? {
        return sale.endDate
    }

    var isUpcomingAndHasNoLots: Bool {
        return saleAvailability == .notYetOpen && numberOfLots == 0
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

    func formattedStringForPriceRange(_ range: PriceRange) -> String {
        let min = range.min.roundCentsToNearestThousandAndFormat(currencySymbol)
        let max = range.max.roundCentsToNearestThousandAndFormat(currencySymbol)
        return "・\(min)–\(max)"
    }

}

/// Allows us to support spotlight indexing

extension SaleViewModel {
    func registerSaleAsActiveActivity(_ viewController: UIViewController?) {
        viewController?.userActivity = ARUserActivity(forEntity: sale)
        viewController?.userActivity?.becomeCurrent()
    }
}

extension Sale: SaleAuctionStatusType { }

/// Private helpers for SaleViewModel

private extension SaleViewModel {

    var smallestLowEstimate: Int {
        return lowEstimates.reduce(Int.max, min)
    }

    var largestLowEstimate: Int {
        return lowEstimates.reduce(Int.min, max)
    }

    var lowEstimates: [Int] {
        return saleArtworks.compactMap { saleArtwork in
            return Int(truncating: saleArtwork.lowEstimateCents ?? 0)
        }
    }
}
