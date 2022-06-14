import UIKit

class LiveAuctionPlainLotCollectionViewLayout: UICollectionViewFlowLayout, LiveAuctionLotCollectionViewLayoutType {

    unowned let delegate: LiveAuctionLotCollectionViewDelegateLayout

    init(delegate: LiveAuctionLotCollectionViewDelegateLayout) {
        self.delegate = delegate

        super.init()

        scrollDirection = .horizontal
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

    fileprivate var maxHeight: CGFloat {
        guard let height = collectionView?.bounds.height else { return 0 }
        return height - 40
    }

    class override var layoutAttributesClass : AnyClass {
        return LiveAuctionLotCollectionViewLayoutAttributes.self
    }


    override func layoutAttributesForElements(in rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        // Regardless of the rect, we always return the one layout attributes
        return [layoutAttributesForItem(at: IndexPath(item: 1, section: 0))].compactMap { $0 }
    }

    override func layoutAttributesForItem(at indexPath: IndexPath) -> UICollectionViewLayoutAttributes? {
        return super.layoutAttributesForItem(at: indexPath).flatMap { modifiedLayoutAttributesCopy($0) }
    }

    override func shouldInvalidateLayout(forBoundsChange newBounds: CGRect) -> Bool {
        return true
    }

    override func prepare() {
        super.prepare()

        let width = collectionView?.frame.size.width ?? 0
        itemSize = CGSize(width: width, height: maxHeight)
    }

    func modifiedLayoutAttributesCopy(_ layoutAttributes: UICollectionViewLayoutAttributes) -> UICollectionViewLayoutAttributes {
        guard let copy = layoutAttributes.copy() as? LiveAuctionLotCollectionViewLayoutAttributes else { return layoutAttributes }

        copy.size.width -= 80 // For side margins, done upfront so we can rely on copy.size for the remainder of the function.

        let index: RelativeIndex = (copy.indexPath as IndexPath).item
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
        copy.center.y = (collectionView?.frame.midY ?? 0) - (repulsionConstant / 2)
        // Center horizontally according to current contentSize (which is the bounds size in all scroll views)
        copy.center.x = collectionView?.bounds.midX ?? 0

        copy.url = delegate.thumbnailURLForIndex(index)

        return copy
    }

}
