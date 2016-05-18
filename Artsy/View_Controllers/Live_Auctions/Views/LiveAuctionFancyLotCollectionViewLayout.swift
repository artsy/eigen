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
        let draggingToNext = ratioDragged > 0

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
        let targetCenterX: CGFloat
        switch index {
        case 0:
            let targetRightEdge = visiblePrevNextSliceSize
            let computedLeftEdge = targetRightEdge - restingWidth
            restingCenterX = (targetRightEdge + computedLeftEdge) / 2
            targetCenterX = 0
        case 1:
            restingCenterX = CGRectGetMidX(collectionView?.frame ?? CGRect.zero) + collectionViewWidth

            if draggingToNext {
                let targetRightEdge = visiblePrevNextSliceSize
                let computedLeftEdge = targetRightEdge - targetWidth
                targetCenterX = (targetRightEdge + computedLeftEdge) / 2 + collectionViewWidth * 2
            } else {
                let targetLeftEdge = collectionViewWidth - visiblePrevNextSliceSize
                let computedRightEdge = targetLeftEdge + targetWidth
                targetCenterX = (targetLeftEdge + computedRightEdge) / 2
            }
        default: // case 2:
            let targetLeftEdge = collectionViewWidth - visiblePrevNextSliceSize
            let computedRightEdge = targetLeftEdge + restingWidth
            restingCenterX = (targetLeftEdge + computedRightEdge) / 2
            targetCenterX = 0
        }

        layoutAttributes.center.x = interpolateFrom(restingCenterX, to: targetCenterX, value: ratioDragged)
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, value: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, value: ratioDragged)
        print("draggingToNext:", draggingToNext, "target center X:", targetCenterX)
//        print("ratio:", ratioDragged)
//        print("size:", layoutAttributes.size)
    }

    func interpolateFrom(a: CGFloat, to b: CGFloat, value: CGFloat, absolute: Bool = true) -> CGFloat {
        let ratio = absolute ? abs(value) : value
        return a + ratio * (b - a)
    }
}
