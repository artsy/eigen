import Foundation

class SaleViewModel {
    private let sale: Sale
    private let saleArtworks: [SaleArtwork]

    init(sale: Sale, saleArtworks: [SaleArtwork]) {
        self.sale = sale
        self.saleArtworks = saleArtworks
    }
}

extension SaleViewModel {
    var backgroundImageURL: NSURL? {
        guard let bannerURL = sale.bannerImageURLString() else { return nil }
        return NSURL(string: bannerURL)
    }

    var profileImageURL: NSURL? {
        guard let profile = sale.profile else { return nil }
        guard let avatarURL = profile.avatarURLString() else { return nil }
        return NSURL(string: avatarURL)
    }

    var closingDate: NSDate {
        return sale.endDate
    }

    var numberOfLots: Int {
        return saleArtworks.count
    }

    var displayName: String {
        return sale.name
    }

    /// Provides a range of the smallest-to-largest low estimates.
    var lowEstimateRange: AuctionRefineSettings.Range {
        return (min: self.smallestLowEstimate, max: self.largestLowEstimate)
    }

    // TODO: Should not be exposing raw models.
    func refinedSaleArtworks(refineSettings: AuctionRefineSettings) -> [SaleArtworkViewModel] {
        return saleArtworks
            .filter(SaleArtwork.includedInRefineSettings(refineSettings))
            .map { saleArtwork in
                return SaleArtworkViewModel(saleArtwork: saleArtwork)
            }
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
        // lowEstimateCents is an NSNumber! and I want to make sure we don't unwrap one that's nil.
        return saleArtworks.flatMap { saleArtwork in
            if saleArtwork.lowEstimateCents == nil {
                return nil
            }

            return Int(saleArtwork.lowEstimateCents)
        }
    }
}

private extension SaleArtwork {
    class func includedInRefineSettings(refineSettings: AuctionRefineSettings) -> SaleArtwork -> Bool {
        return { saleArtwork in
            // Includes iff the sale artwork's low estimate is within the range, inclusive.
            let (min, max) = (refineSettings.range.min, refineSettings.range.max)
            return (min...max) ~= (saleArtwork.lowEstimateCents as Int)
        }
    }
}
