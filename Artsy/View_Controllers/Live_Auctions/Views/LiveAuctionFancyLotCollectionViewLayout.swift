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

    var collectionViewWidth: CGFloat {
        return CGRectGetWidth(collectionView?.frame ?? CGRect.zero)
    }

    var ratioDragged: CGFloat {
        return ((collectionView?.contentOffset.x ?? 0) - collectionViewWidth) / collectionViewWidth
    }

    var draggingToNext: Bool { return ratioDragged > 0 }

    func modifyLayoutAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        switch layoutAttributes.indexPath.item {
        case 0:
            modifyPreviousAttributes(layoutAttributes)
        case 1:
            modifyCurrentAttributes(layoutAttributes)
        default: // case 2:
            modifyNextAttributes(layoutAttributes)
        }
    }

    func interpolateFrom(a: CGFloat, to b: CGFloat, value: CGFloat, absolute: Bool = true) -> CGFloat {
        let ratio = absolute ? abs(value) : value
        return a + ratio * (b - a)
    }

    func modifyPreviousAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        let aspectRatio = delegate.aspectRatioForIndex(0)

        let restingWidth: CGFloat
        let restingHeight: CGFloat
        let targetHeight: CGFloat
        let targetWidth: CGFloat

        if aspectRatio > 1 {
            restingWidth = 200
            restingHeight = restingWidth / aspectRatio
            targetWidth = 300
            targetHeight = targetWidth / aspectRatio
        } else {
            restingHeight = 200
            restingWidth = restingHeight * aspectRatio
            targetHeight = 300
            targetWidth = targetHeight * aspectRatio
        }

        let targetRightEdge = visiblePrevNextSliceSize
        let computedLeftEdge = targetRightEdge - restingWidth
        let restingCenterX = (targetRightEdge + computedLeftEdge) / 2 + collectionViewWidth


        let targetCenterX: CGFloat
        if draggingToNext {
            targetCenterX = restingCenterX
        } else {
            targetCenterX = CGRectGetMidX(collectionView?.frame ?? CGRect.zero)
        }

        layoutAttributes.center.x = interpolateFrom(restingCenterX, to: targetCenterX, value: ratioDragged)
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, value: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, value: ratioDragged)
    }

    func modifyCurrentAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        let restingCenterX = CGRectGetMidX(collectionView?.frame ?? CGRect.zero) + collectionViewWidth
        let aspectRatio = delegate.aspectRatioForIndex(1)

        let restingWidth: CGFloat
        let restingHeight: CGFloat
        let targetHeight: CGFloat
        let targetWidth: CGFloat

        if aspectRatio > 1 {
            restingWidth = 300
            restingHeight = restingWidth / aspectRatio
            targetWidth = 200
            targetHeight = targetWidth / aspectRatio
        } else {
            restingHeight = 300
            restingWidth = restingHeight * aspectRatio
            targetHeight = 200
            targetWidth = targetHeight * aspectRatio
        }

        let targetCenterX: CGFloat
        if draggingToNext {
            let targetRightEdge = visiblePrevNextSliceSize
            let computedLeftEdge = targetRightEdge - targetWidth
            targetCenterX = (targetRightEdge + computedLeftEdge) / 2 + collectionViewWidth * 2
        } else {
            let targetLeftEdge = collectionViewWidth - visiblePrevNextSliceSize
            let computedRightEdge = targetLeftEdge + targetWidth
            targetCenterX = (targetLeftEdge + computedRightEdge) / 2
        }

        layoutAttributes.center.x = interpolateFrom(restingCenterX, to: targetCenterX, value: ratioDragged)
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, value: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, value: ratioDragged)
    }

    func modifyNextAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        let aspectRatio = delegate.aspectRatioForIndex(0)

        let restingWidth: CGFloat
        let restingHeight: CGFloat
        let targetHeight: CGFloat
        let targetWidth: CGFloat

        if aspectRatio > 1 {
            restingWidth = 200
            restingHeight = restingWidth / aspectRatio
            targetWidth = 300
            targetHeight = targetWidth / aspectRatio
        } else {
            restingHeight = 200
            restingWidth = restingHeight * aspectRatio
            targetHeight = 300
            targetWidth = targetHeight * aspectRatio
        }

        let targetLeftEdge = 2 * collectionViewWidth - visiblePrevNextSliceSize
        let computedRightEdge = targetLeftEdge + restingWidth
        let restingCenterX = (targetLeftEdge + computedRightEdge) / 2

        let targetCenterX: CGFloat
        if draggingToNext {
            targetCenterX = CGRectGetMidX(collectionView?.frame ?? CGRect.zero) + collectionViewWidth * 2
        } else {
            targetCenterX = restingCenterX
        }

        layoutAttributes.center.x = interpolateFrom(restingCenterX, to: targetCenterX, value: ratioDragged)
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, value: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, value: ratioDragged)
    }
}