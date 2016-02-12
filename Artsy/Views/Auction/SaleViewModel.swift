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
    var backgroundImageURL: NSURL! {
        return NSURL(string: "https://d32dm0rphc51dk.cloudfront.net/BLv_dHIIVvShtDB8GCxFdg/large_rectangle.jpg")!
    }

    var profileImageURL: NSURL! {
        return NSURL(string: "https://d32dm0rphc51dk.cloudfront.net/n9QgQtio1Rrp-vaKGJH7aA/square140.png")
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

    // TODO: Temporary, shouldn't be exposing raw models 😬
    var artworks: [Artwork] {
        return saleArtworks.map { saleArtwork in
            return saleArtwork.artwork
        }
    }

    /// Provides a range of the smallest-to-largest low estimates.
    var lowEstimateRange: AuctionRefineSettings.Range {
        return (min: self.smallestLowEstimate, max: self.largestLowEstimate)
    }

    // TODO: Temporary, will need to be SaleArtworks instead.
    func refinedArtworks(refineSettings: AuctionRefineSettings) -> [Artwork] {
        return saleArtworks
            .filter(SaleArtwork.includedInRefineSettings(refineSettings))
            .map { saleArtwork in
                return saleArtwork.artwork
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
