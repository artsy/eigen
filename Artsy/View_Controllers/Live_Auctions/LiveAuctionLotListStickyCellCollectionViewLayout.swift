import UIKit

class LiveAuctionLotListStickyCellCollectionViewLayout: UICollectionViewFlowLayout {
    private var currentIndex = 0

    override init() {
        super.init()

        self.scrollDirection = .Vertical
        self.minimumInteritemSpacing = 0
        self.minimumLineSpacing = 1
        self.itemSize = CGSizeMake(200, 80)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

}


private typealias PublicFunctions = LiveAuctionLotListStickyCellCollectionViewLayout
extension PublicFunctions {

    func setActiveIndex(index: Int) {
        currentIndex = index
        invalidateLayout()
    }
}


private typealias PrivateFunctions = LiveAuctionLotListStickyCellCollectionViewLayout
extension PrivateFunctions {

    func setActiveAttributes(attributes: UICollectionViewLayoutAttributes) {

        let contentOffset = collectionView?.contentOffset.y ?? 0
        if attributes.frame.origin.y < contentOffset {
            attributes.frame.origin.y = contentOffset
        }
        attributes.zIndex = 1
    }
}


private typealias Overrides = LiveAuctionLotListStickyCellCollectionViewLayout
extension Overrides {

    override func layoutAttributesForElementsInRect(rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        guard var attributesArray = super.layoutAttributesForElementsInRect(rect) else { return nil }
        attributesArray = attributesArray.flatMap { ($0.copy() as? UICollectionViewLayoutAttributes) }

        // TODO: Necessary? Can't remember.
//        if (attributesArray.map { $0.indexPath.item }).contains(currentIndex) == false {
//            let indexPath = NSIndexPath(forItem: currentIndex, inSection: 0)
//            attributesArray += [UICollectionViewLayoutAttributes(forCellWithIndexPath: indexPath)]
//        }

        attributesArray.forEach { attributes in
            if attributes.indexPath.item == currentIndex {
                setActiveAttributes(attributes)
            }
        }

        return attributesArray
    }

    override func layoutAttributesForItemAtIndexPath(indexPath: NSIndexPath) -> UICollectionViewLayoutAttributes? {
        guard let attributes = super.layoutAttributesForItemAtIndexPath(indexPath)?.copy() as? UICollectionViewLayoutAttributes else { return nil }

        if attributes.indexPath.item == currentIndex {
            setActiveAttributes(attributes)
        }

        return attributes
    }

    override func shouldInvalidateLayoutForBoundsChange(newBounds: CGRect) -> Bool {
        return true
    }
}
