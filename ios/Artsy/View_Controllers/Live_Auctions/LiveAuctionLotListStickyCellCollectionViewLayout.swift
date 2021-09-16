import UIKit

class LiveAuctionLotListStickyCellCollectionViewLayout: UICollectionViewFlowLayout {
    fileprivate var currentIndex: Int?

    override init() {
        super.init()

        self.scrollDirection = .vertical
        self.minimumInteritemSpacing = 0
        self.minimumLineSpacing = 0
        self.sectionInset = UIEdgeInsets(top: 1, left: 0, bottom: 40, right: 0)
        // itemSize must be set in prepareLayout
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

}


private typealias PublicFunctions = LiveAuctionLotListStickyCellCollectionViewLayout
extension PublicFunctions {

    func setActiveIndex(_ index: Int?) {
        currentIndex = index
        invalidateLayout()
        collectionView?.reloadData()
    }
}


private typealias PrivateFunctions = LiveAuctionLotListStickyCellCollectionViewLayout
extension PrivateFunctions {

    func setActiveAttributes(_ attributes: UICollectionViewLayoutAttributes) {
        guard let collectionView = collectionView else { return }

        let contentOffset = collectionView.contentOffset.y

        if attributes.frame.minY < contentOffset {
            // Attributes want to be above the visible rect, so let's stick it to the top.
            attributes.frame.origin.y = contentOffset
        } else if attributes.frame.maxY > collectionView.frame.height + contentOffset {
            // Attributes want to be below the visible rect, so let's stick it to the bottom (height + contentOffset - height of attributes)
            attributes.frame.origin.y = collectionView.frame.height + contentOffset - attributes.frame.height
        }

        attributes.zIndex = 1
    }
}


private typealias Overrides = LiveAuctionLotListStickyCellCollectionViewLayout
extension Overrides {

    override func prepare() {
        super.prepare()

        let width = collectionViewContentSize.width
        let height = LotListCollectionViewCell.Height

        itemSize = CGSize(width: width, height: height)
    }

    override func layoutAttributesForElements(in rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        guard let superAttributesArray = super.layoutAttributesForElements(in: rect) else { return nil }
        guard superAttributesArray.isNotEmpty else { return [] }

        var attributesArray = superAttributesArray.compactMap { $0 }

        // Guarantee any selected cell is presented, regardless of the rect.
        if let currentIndex = currentIndex {
            if (attributesArray.map { $0.indexPath.item }).contains(currentIndex) == false {
                let indexPath = IndexPath(item: currentIndex, section: 0)
                if let stickyAttributes = layoutAttributesForItem(at: indexPath) {
                    attributesArray += [stickyAttributes]
                }
            }
        }

        attributesArray
            .filter { $0.indexPath.item == currentIndex }
            .forEach(setActiveAttributes)

        return attributesArray
    }

    override func layoutAttributesForItem(at indexPath: IndexPath) -> UICollectionViewLayoutAttributes? {
        guard let attributes = super.layoutAttributesForItem(at: indexPath)?.copy() as? UICollectionViewLayoutAttributes else { return nil }

        if attributes.indexPath.item == currentIndex {
            setActiveAttributes(attributes)
        }

        return attributes
    }

    override func shouldInvalidateLayout(forBoundsChange newBounds: CGRect) -> Bool {
        return true
    }
}
