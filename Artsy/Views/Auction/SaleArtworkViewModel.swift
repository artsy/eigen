import Foundation
import UIKit

@objc class SaleArtworkViewModel: NSObject {
    fileprivate let saleArtwork: SaleArtwork

    @objc init(saleArtwork: SaleArtwork) {
        self.saleArtwork = saleArtwork
    }
}

private typealias PublicComputedProperties = SaleArtworkViewModel
extension PublicComputedProperties {
    @objc var thumbnailURL: URL? {
        return saleArtwork.artwork.defaultImage.urlForThumbnailImage()
    }

    @objc var aspectRatio: CGFloat {
        return saleArtwork.artwork.defaultImage.aspectRatio
    }

    @objc var artistName: String {
        return saleArtwork.artwork.artist?.name ?? ""
    }

    @objc var artworkName: String {
        return saleArtwork.artwork.title ?? ""
    }

    @objc var artworkDate: String {
        return saleArtwork.artwork.date
    }

    @objc var lotLabel: String {
        return saleArtwork.lotLabel ?? ""
    }

    @objc var isAuctionOpen: Bool {
        // If we have no sale state, assume auction is closed to prevent leaking info post-sale.
        guard let saleState = saleArtwork.auction?.saleState else { return false }
        // For our purposes, an auction is "open" if its sale state is open or in preview.
        return [SaleStateOpen, SaleStatePreview].contains(saleState)
    }

    @objc var numberOfBids: String {
        return saleArtwork.numberOfBidsString()
    }

    @objc var artworkID: String {
        return saleArtwork.artwork.artworkID
    }

    @objc func currentOrStartingBidWithNumberOfBids(_ includeNumberOfBids: Bool) -> String {
        if saleArtwork.auctionState.contains(.ended) {
            return ""
        }

        let bidString = saleArtwork.highestOrStartingBidString()
        if includeNumberOfBids && (saleArtwork.bidCount?.intValue ?? 0) > 0 {
            let numberOfBidsString = saleArtwork.numberOfBidsString()
            return "\(bidString) \(numberOfBidsString)"
        } else {
            return bidString
        }
    }
}
