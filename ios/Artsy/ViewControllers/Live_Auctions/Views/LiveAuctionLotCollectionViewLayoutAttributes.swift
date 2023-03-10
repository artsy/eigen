import UIKit

/// Basic layout attributes that include an NSURL.
class LiveAuctionLotCollectionViewLayoutAttributes: UICollectionViewLayoutAttributes {
    var url: URL?

    override func copy(with zone: NSZone?) -> Any {
        let instance = super.copy(with: zone)

        (instance as? LiveAuctionLotCollectionViewLayoutAttributes)?.url = self.url

        return instance
    }

}
