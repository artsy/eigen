import UIKit

class LiveAuctionFancyLotCollectionViewLayout: UICollectionViewFlowLayout {

    override init() {
        super.init()

        itemSize = CGSize(width: 300, height: 300)
        scrollDirection = .Horizontal
        minimumLineSpacing = 0
    }

    required init?(coder aDecoder: NSCoder) {
        // Sorry Storyboarders.
        return nil
    }

    func updateScreenWidth(width: CGFloat) {
        itemSize = CGSize(width: width, height: 300)
        invalidateLayout()
    }

    override func shouldInvalidateLayoutForBoundsChange(newBounds: CGRect) -> Bool {
        return true
    }
}
