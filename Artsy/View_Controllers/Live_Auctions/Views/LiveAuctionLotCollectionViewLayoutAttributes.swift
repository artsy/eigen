import UIKit

/// Basic layout attributes that include an NSURL.
class LiveAuctionLotCollectionViewLayoutAttributes: UICollectionViewLayoutAttributes {
    var url: NSURL?

    override func copyWithZone(zone: NSZone) -> AnyObject {
        let instance = super.copyWithZone(zone)

        (instance as? LiveAuctionLotCollectionViewLayoutAttributes)?.url = self.url

        return instance
    }

}
