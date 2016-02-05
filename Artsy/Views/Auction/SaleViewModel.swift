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

    var name: String {
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
        return saleArtworks.map { Int($0.lowEstimateCents) }
    }
}
