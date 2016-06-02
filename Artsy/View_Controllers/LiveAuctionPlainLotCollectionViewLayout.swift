import UIKit

class LiveAuctionPlainLotCollectionViewLayout: UICollectionViewFlowLayout, LiveAuctionLotCollectionViewLayoutType {

    unowned let delegate: LiveAuctionLotCollectionViewDelegateLayout

    private let maxHeight: CGFloat = 360

    init(delegate: LiveAuctionLotCollectionViewDelegateLayout) {
        self.delegate = delegate

        super.init()

        scrollDirection = .Horizontal
        minimumLineSpacing = 0
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    var repulsionConstant: CGFloat = 0 {
        didSet {
            invalidateLayout()
        }
    }

    func updateScreenWidth(width: CGFloat) {
        itemSize = CGSize(width: width, height: maxHeight)
        invalidateLayout()
    }

    class override func layoutAttributesClass() -> AnyClass {
        return LiveAuctionLotCollectionViewLayoutAttributes.self
    }


    override func layoutAttributesForElementsInRect(rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        // Regardless of the rect, we always return the one layout attributes
        return [layoutAttributesForItemAtIndexPath(NSIndexPath(forItem: 1, inSection: 0))].flatMap { $0 }
    }

    override func layoutAttributesForItemAtIndexPath(indexPath: NSIndexPath) -> UICollectionViewLayoutAttributes? {
        return super.layoutAttributesForItemAtIndexPath(indexPath).flatMap { modifiedLayoutAttributesCopy($0) }
    }


    func modifiedLayoutAttributesCopy(layoutAttributes: UICollectionViewLayoutAttributes) -> UICollectionViewLayoutAttributes {
        guard let copy = layoutAttributes.copy() as? LiveAuctionLotCollectionViewLayoutAttributes else { return layoutAttributes }
        
        let index: RelativeIndex = copy.indexPath.item
        let aspectRatio = delegate.aspectRatioForIndex(index)
        let isWide = (aspectRatio > itemSize.width / maxHeight)

        // copy has size = itemSize by default, we just need to set the appropriate dimension, based on aspect ratio.
        // This is a simplified version of the fancy layout math.
        if isWide {
            copy.size.height = itemSize.width / aspectRatio - repulsionConstant / aspectRatio
        } else {
            copy.size.width = itemSize.height * aspectRatio - repulsionConstant * aspectRatio
        }

        // Center the item vertically, minus repulsion
        copy.center.y = CGRectGetMidY(collectionView?.frame ?? CGRectZero) - (repulsionConstant / 2)

        copy.url = delegate.thumbnailURLForIndex(index)

        return copy
    }

}
