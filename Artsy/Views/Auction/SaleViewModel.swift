import Foundation
import Artsy_UILabels

class SaleViewModel: NSObject {
    fileprivate let sale: Sale
    fileprivate let saleArtworks: [SaleArtwork]
    fileprivate var lotStandings: [LotStanding]

    var bidders: [Bidder]

    init(sale: Sale, saleArtworks: [SaleArtwork], bidders: [Bidder], lotStandings: [LotStanding]) {
        self.sale = sale
        self.saleArtworks = saleArtworks
        self.bidders = bidders
        self.lotStandings = lotStandings
    }
}

extension SaleViewModel {

    var saleIsClosed: Bool {
        switch saleAvailability {
        case .closed: return true
        default: return false
        }
    }

    var hasLotStandings: Bool {
        return lotStandings.isNotEmpty
    }

    var numberOfLotStandings: Int {
        return lotStandings.count
    }

    func lotStanding(at index: Int) -> LotStanding {
        precondition(0..<numberOfLotStandings ~= index, "Index exceeds bounds of lotStandings")

        return lotStandings[index]
    }

    func updateLotStandings(_ lotStandings: [LotStanding]) {
        self.lotStandings = lotStandings
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
    var saleAvailabilityString: String {
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

    func refinedSaleArtworks(_ refineSettings: AuctionRefineSettings) -> [SaleArtworkViewModel] {
        return refineSettings.ordering.sortSaleArtworks(saleArtworks)
            .filter(SaleArtwork.includedInRefineSettings(refineSettings))
            .map { saleArtwork in
                return SaleArtworkViewModel(saleArtwork: saleArtwork)
        }
    }

    func subtitleForRefineSettings(_ refineSettings: AuctionRefineSettings, defaultRefineSettings: AuctionRefineSettings) -> String {
        let numberOfLots = refinedSaleArtworks(refineSettings).count
        var subtitle = "\(numberOfLots) Lots"

        switch refineSettings.ordering {
        case .LotNumber: break
        default:
            subtitle += "・\(refineSettings.ordering.rawValue)"
        }

        if let priceRange = refineSettings.priceRange,
            let defaultPriceRange = defaultRefineSettings.priceRange,
            priceRange.min != defaultPriceRange.min ||
            priceRange.max != defaultPriceRange.max {
            subtitle += formattedStringForPriceRange(priceRange)
        }

        return subtitle
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


extension SaleArtwork: AuctionOrderable {
    var bids: Int {
        return bidCount as? Int ?? 0
    }

    var artistSortableID: String {
        return artwork.artist?.sortableID ?? ""
    }

    var currentBid: Int {
        guard let saleHighestBid = self.saleHighestBid else { return 0 }
        return saleHighestBid.cents as! Int
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
        return saleArtworks.flatMap { saleArtwork in
            return Int(saleArtwork.lowEstimateCents ?? 0)
        }
    }
}

private extension SaleArtwork {
    class func includedInRefineSettings(_ refineSettings: AuctionRefineSettings) -> (SaleArtwork) -> Bool {
        return { saleArtwork in
            // Includes iff the sale artwork's low estimate is within the range, inclusive.
            let (min, max) = (refineSettings.priceRange?.min ?? 0, refineSettings.priceRange?.max ?? 0)

            return (min...max) ~= (saleArtwork.lowEstimateCents as? Int ?? 0)
        }
    }
}
