import Foundation

@objc class SaleArtworkViewModel: NSObject {
    private let saleArtwork: SaleArtwork

    init(saleArtwork: SaleArtwork) {
        self.saleArtwork = saleArtwork
    }
}

private typealias PublicComputedProperties = SaleArtworkViewModel
extension PublicComputedProperties {
    var thumbnailURL: NSURL? {
        return saleArtwork.artwork.defaultImage.urlForThumbnailImage()
    }

    var aspectRatio: CGFloat {
        return saleArtwork.artwork.defaultImage.aspectRatio
    }

    var artistName: String {
        return saleArtwork.artwork.artist?.name ?? ""
    }

    var artworkName: String {
        return saleArtwork.artwork.title ?? ""
    }

    var lotNumber: String {
        return saleArtwork.lotNumber?.stringValue ?? ""
    }

    var numberOfBids: String {
        return saleArtwork.numberOfBidsString()
    }

    var artworkID: String {
        return saleArtwork.artwork.artworkID
    }

    func currentOrStartingBidWithNumberOfBids(includeNumberOfBids: Bool) -> String {
        if saleArtwork.auctionState.contains(.Ended) {
            return ""
        }

        let bidString = saleArtwork.highestOrStartingBidString()
        if includeNumberOfBids {
            let numberOfBidsString = saleArtwork.numberOfBidsString()
            return "\(bidString) \(numberOfBidsString)"
        } else {
            return bidString
        }
    }
}
