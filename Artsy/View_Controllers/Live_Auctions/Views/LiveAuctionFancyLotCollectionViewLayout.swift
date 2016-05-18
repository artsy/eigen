import UIKit

typealias RelativeIndex = Int

protocol LiveAuctionFancyLotCollectionViewDelegateLayout: class {
    func aspectRatioForIndex(index: RelativeIndex) -> CGFloat
    func thumbnailURLForIndex(index: RelativeIndex) -> NSURL
}

/// Layout for display previous/next lot images on the sides while showing the main lot in the centre, larger.
///
/// This layout is more aware of the _data_ being display by the cells than is typical. The reason is that the
/// layout is aware of how far we have scrolled in either direction, and due to the private nature of 
/// UIPageViewController, the datasource cannot know. See the PrivateFunctions discussions for more info.
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

    /// We invalidate on every bounds change (every scroll).
    override func shouldInvalidateLayoutForBoundsChange(newBounds: CGRect) -> Bool {
        return true
    }

    override func layoutAttributesForElementsInRect(rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        // Regardless of the rect, we always return the three layout attributes
        return [0,1,2].flatMap { layoutAttributesForItemAtIndexPath(NSIndexPath(forItem: $0, inSection: 0)) }
    }

    override func layoutAttributesForItemAtIndexPath(indexPath: NSIndexPath) -> UICollectionViewLayoutAttributes? {
        return super.layoutAttributesForItemAtIndexPath(indexPath)?.then { layoutAttributes in
            modifyLayoutAttributes(&layoutAttributes)
        }
    }

    class override func layoutAttributesClass() -> AnyClass {
        return LiveAuctionFancyLotCollectionViewLayoutAttributes.self
    }
}


/// Indicates scrolling direction (towards the Next or Previous lots, respectively).
private enum ScrollDirection {
    case Next, Previous
}

private let visiblePrevNextSliceSize = CGFloat(20)

private typealias PrivateFunctions = LiveAuctionFancyLotCollectionViewLayout
private extension PrivateFunctions {

    // Discussion:
    // The collection view is meant to be drive by scrollViewDidScroll() calls from a UIPageViewController. They use a clever
    // mechanism to shuffle between three view controllers, and only two are every on screen at once.
    //
    // Our collection view has up to _three_ on screen at once. To jive with UIPVC, we're going to assume that if the user has
    // scrolled more than halfway off the screen in either direction, the previous (or next) lot images are no longer visible.
    // Thus, they're available to be used as the "next" (or "previous") faux lots until the UIPVC resets to display a new view 
    // controller. Consequently, this layout is more aware of the data displayed in cells than is typical.

    /// Computed variable for the collection view's width, or zero if nil.
    var collectionViewWidth: CGFloat {
        return CGRectGetWidth(collectionView?.frame ?? CGRect.zero)
    }

    /// Computed variable for the amount the user has dragged. Has a range of (-1...0...1).
    /// Resting state is zero, -1 is dragging to the previous lot, and vice versa for the next.
    var ratioDragged: CGFloat {
        return ((collectionView?.contentOffset.x ?? 0) - collectionViewWidth) / collectionViewWidth
    }

    /// Computed variable for the direction the user is dragging.
    var userScrollDirection: ScrollDirection { return ratioDragged > 0 ? .Next : .Previous }

    /// Main entry for this extension. Applies layout attributes depending on the indexPath's item that is passed in.
    func modifyLayoutAttributes(inout layoutAttributes: UICollectionViewLayoutAttributes) {
        switch layoutAttributes.indexPath.item {
        case 0:
            modifyPreviousAttributes(&layoutAttributes)
        case 1:
            modifyCurrentAttributes(&layoutAttributes)
        default: // case 2:
            modifyNextAttributes(&layoutAttributes)
        }
    }

    /// Interpolates linearly from two float values based on the _absolute value_ of the ratio parameter.
    func interpolateFrom(a: CGFloat, to b: CGFloat, ratio: CGFloat) -> CGFloat {
        return a + abs(ratio) * (b - a)
    }

    func modifyPreviousAttributes(inout layoutAttributes: UICollectionViewLayoutAttributes, underflow: Bool = false) {
        if ratioDragged > 0.5 {
            print("overflowing")
            return modifyNextAttributes(&layoutAttributes, overflow: true)
        }

        let index = underflow ? -1 : 0
        (layoutAttributes as? LiveAuctionFancyLotCollectionViewLayoutAttributes)?.url = delegate.thumbnailURLForIndex(index)
        let aspectRatio = delegate.aspectRatioForIndex(index)

        let restingWidth: CGFloat
        let restingHeight: CGFloat
        let targetHeight: CGFloat
        let targetWidth: CGFloat

        if aspectRatio > 1 {
            restingWidth = 200
            restingHeight = restingWidth / aspectRatio
            targetWidth = underflow ? 200 : 300
            targetHeight = targetWidth / aspectRatio
        } else {
            restingHeight = 200
            restingWidth = restingHeight * aspectRatio
            targetHeight = underflow ? 200 : 300
            targetWidth = targetHeight * aspectRatio
        }

        let targetRightEdge = visiblePrevNextSliceSize - CGFloat(underflow ? collectionViewWidth : 0) + collectionViewWidth
        let computedLeftEdge = targetRightEdge - restingWidth
        let restingCenterX = (targetRightEdge + computedLeftEdge) / 2


        let targetCenterX: CGFloat
        if underflow || userScrollDirection == .Next {
            targetCenterX = restingCenterX
        } else {
            targetCenterX = CGRectGetMidX(collectionView?.frame ?? CGRect.zero)
        }

        layoutAttributes.center.x = interpolateFrom(restingCenterX, to: targetCenterX, ratio: ratioDragged)
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, ratio: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, ratio: ratioDragged)
    }

    func modifyCurrentAttributes(inout layoutAttributes: UICollectionViewLayoutAttributes) {
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
        if userScrollDirection == .Next {
            let targetRightEdge = visiblePrevNextSliceSize
            let computedLeftEdge = targetRightEdge - targetWidth
            targetCenterX = (targetRightEdge + computedLeftEdge) / 2 + collectionViewWidth * 2
        } else {
            let targetLeftEdge = collectionViewWidth - visiblePrevNextSliceSize
            let computedRightEdge = targetLeftEdge + targetWidth
            targetCenterX = (targetLeftEdge + computedRightEdge) / 2
        }

        layoutAttributes.center.x = interpolateFrom(restingCenterX, to: targetCenterX, ratio: ratioDragged)
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, ratio: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, ratio: ratioDragged)
    }

    func modifyNextAttributes(inout layoutAttributes: UICollectionViewLayoutAttributes, overflow: Bool = false) {
        if ratioDragged < -0.5 {
            print("underflowing")
            return modifyPreviousAttributes(&layoutAttributes, underflow: true)
        }

        let index = overflow ? 3 : 2
        let aspectRatio = delegate.aspectRatioForIndex(index)
        (layoutAttributes as? LiveAuctionFancyLotCollectionViewLayoutAttributes)?.url = delegate.thumbnailURLForIndex(index)

        let restingWidth: CGFloat
        let restingHeight: CGFloat
        let targetHeight: CGFloat
        let targetWidth: CGFloat

        if aspectRatio > 1 {
            restingWidth = 200
            restingHeight = restingWidth / aspectRatio
            targetWidth = overflow ? 200 : 300
            targetHeight = targetWidth / aspectRatio
        } else {
            restingHeight = 200
            restingWidth = restingHeight * aspectRatio
            targetHeight = overflow ? 200 : 300
            targetWidth = targetHeight * aspectRatio
        }

        let targetLeftEdge = CGFloat(index) * collectionViewWidth - visiblePrevNextSliceSize
        let computedRightEdge = targetLeftEdge + restingWidth
        let restingCenterX = (targetLeftEdge + computedRightEdge) / 2

        let targetCenterX: CGFloat
        if overflow {
            targetCenterX = restingCenterX
        } else if userScrollDirection == .Next {
            targetCenterX = CGRectGetMidX(collectionView?.frame ?? CGRect.zero) + collectionViewWidth * 2
        } else {
            targetCenterX = restingCenterX
        }

        layoutAttributes.center.x = interpolateFrom(restingCenterX, to: targetCenterX, ratio: ratioDragged)
        layoutAttributes.size.height = interpolateFrom(restingHeight, to: targetHeight, ratio: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(restingWidth, to: targetWidth, ratio: ratioDragged)
    }
}