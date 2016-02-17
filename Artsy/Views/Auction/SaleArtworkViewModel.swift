import Foundation

@objc class SaleArtworkViewModel: NSObject {
    private let saleArtwork: SaleArtwork

    init(saleArtwork: SaleArtwork) {
        self.saleArtwork = saleArtwork
    }
}

private typealias PublicComputedProperties = SaleArtworkViewModel
extension PublicComputedProperties {
    var thumbnailURL: NSURL! {
        return saleArtwork.artwork.defaultImage.urlForThumbnailImage()
    }

    var artistName: String {
        return saleArtwork.artwork.artist.name
    }

    var artworkName: String {
        return saleArtwork.artwork.name()
    }

    var lotNumber: String {
        return saleArtwork.lotNumber.stringValue
    }

    var numberOfBids: String {
        return saleArtwork.numberOfBidsString()
    }

    func currentOrStartingBidWithNumberOfBids(includeNumberOfBids: Bool) -> String {
        let bidString = saleArtwork.highestOrStartingBidString()
        if includeNumberOfBids {
            let numberOfBidsString = saleArtwork.numberOfBidsString()
            return "\(bidString) \(numberOfBidsString)"
        } else {
            return bidString
        }
    }
}
