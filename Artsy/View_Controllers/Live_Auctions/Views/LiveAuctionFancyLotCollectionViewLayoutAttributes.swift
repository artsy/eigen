import UIKit

class LiveAuctionFancyLotCollectionViewLayoutAttributes: UICollectionViewLayoutAttributes {
    var url: NSURL?

    override func copyWithZone(zone: NSZone) -> AnyObject {
        let instance = super.copyWithZone(zone)

        (instance as? LiveAuctionFancyLotCollectionViewLayoutAttributes)?.url = self.url

        return instance
    }

}