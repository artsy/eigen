import UIKit

protocol LiveAuctionFancyLotCollectionViewDelegateLayout: class {
    func aspectRatioForIndex(index: Int) -> CGFloat
}

class LiveAuctionFancyLotCollectionViewLayout: UICollectionViewFlowLayout {

    unowned let delegate: LiveAuctionFancyLotCollectionViewDelegateLayout

    init(delegate: LiveAuctionFancyLotCollectionViewDelegateLayout) {
        self.delegate = delegate
        
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

    override func layoutAttributesForElementsInRect(rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        // Regardless of the rect, we always return the three layout attributes
        return [0,1,2].flatMap { layoutAttributesForItemAtIndexPath(NSIndexPath(forItem: $0, inSection: 0)) }
    }

    override func layoutAttributesForItemAtIndexPath(indexPath: NSIndexPath) -> UICollectionViewLayoutAttributes? {
        return super.layoutAttributesForItemAtIndexPath(indexPath)?.then { layoutAttributes in
            modifyLayoutAttributes(layoutAttributes)
        }
    }
}


private let visiblePrevNextSliceSize = CGFloat(20)

private typealias PrivateFunctions = LiveAuctionFancyLotCollectionViewLayout
extension PrivateFunctions {

    func modifyLayoutAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        let collectionViewWidth = CGRectGetWidth(collectionView?.frame ?? CGRect.zero)
        let ratioDragged = ((collectionView?.contentOffset.x ?? 0) - collectionViewWidth) / collectionViewWidth

        let index = layoutAttributes.indexPath.item
        let aspectRatio = delegate.aspectRatioForIndex(index)

        let restingWidth: CGFloat
        let restingHeight: CGFloat
        let targetHeight: CGFloat
        let targetWidth: CGFloat

        if aspectRatio > 1 {
            restingWidth = CGFloat(index == 1 ? 300 : 200)
            restingHeight = restingWidth / aspectRatio
            targetWidth = CGFloat(index == 1 ? 200 : 300)
            targetHeight = targetWidth / aspectRatio
        } else {
            restingHeight = CGFloat(index == 1 ? 300 : 200)
            restingWidth = restingHeight * aspectRatio
            targetHeight = CGFloat(index == 1 ? 200 : 300)
            targetWidth = targetHeight * aspectRatio
        }

        let restingCenterX: CGFloat
        switch index {
        case 0:
            let targetRightEdge = visiblePrevNextSliceSize
            let computedLeftEdge = targetRightEdge - restingWidth
            restingCenterX = (targetRightEdge + computedLeftEdge) / 2
            layoutAttributes.alpha = 0 // TODO: Remove
        case 1:
            restingCenterX = CGRectGetMidX(collectionView?.frame ?? CGRect.zero) + collectionViewWidth
        default: // case 2:
            let targetLeftEdge = collectionViewWidth - visiblePrevNextSliceSize
            let computedRightEdge = targetLeftEdge + restingWidth
            restingCenterX = (targetLeftEdge + computedRightEdge) / 2
            layoutAttributes.alpha = 0 // TODO: Remove
        }

        layoutAttributes.center.x = restingCenterX
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, value: ratioDragged, absolute: true)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, value: ratioDragged, absolute: true)
        print("ratio:", ratioDragged)
//        print("size:", layoutAttributes.size)
    }

    func interpolateFrom(a: CGFloat, to b: CGFloat, value: CGFloat, absolute: Bool = false) -> CGFloat {
        let ratio = absolute ? abs(value) : value
        return a + ratio * (b - a)
    }
}
