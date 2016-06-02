import UIKit

class LiveAuctionPlainLotCollectionViewLayout: UICollectionViewFlowLayout, LiveAuctionLotCollectionViewLayoutType {

    unowned let delegate: LiveAuctionLotCollectionViewDelegateLayout

    init(delegate: LiveAuctionLotCollectionViewDelegateLayout) {
        self.delegate = delegate

        super.init()

        itemSize = CGSize(width: 300, height: 300)
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
        let maxCurrentHeight = CGFloat(400) // TODO: What to use here?
        itemSize = CGSize(width: width, height: maxCurrentHeight)
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
        return super.layoutAttributesForItemAtIndexPath(indexPath)//.flatMap { modifiedLayoutAttributesCopy($0) }
    }


    func modifiedLayoutAttributesCopy(layoutAttributes: UICollectionViewLayoutAttributes) -> UICollectionViewLayoutAttributes {
        guard let copy = layoutAttributes.copy() as? LiveAuctionLotCollectionViewLayoutAttributes else { return layoutAttributes }
        let index: RelativeIndex = copy.indexPath.item
        
        copy.url = delegate.thumbnailURLForIndex(index)

        return copy
    }

}
