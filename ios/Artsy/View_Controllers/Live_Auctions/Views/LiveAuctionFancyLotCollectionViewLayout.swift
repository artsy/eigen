import UIKit


/// Layout for display previous/next lot images on the sides while showing the main lot in the centre, larger.
///
/// This layout is more aware of the _data_ being display by the cells than is typical. The reason is that the
/// layout is aware of how far we have scrolled in either direction, and due to the private nature of
/// UIPageViewController, the datasource cannot know. See the PrivateFunctions discussions for more info.
class LiveAuctionFancyLotCollectionViewLayout: UICollectionViewFlowLayout, LiveAuctionLotCollectionViewLayoutType {

    enum Size {
        case normal, compact
    }

    unowned let delegate: LiveAuctionLotCollectionViewDelegateLayout

    fileprivate let visiblePrevNextSliceSize: CGFloat
    fileprivate let maxCurrentWidth: CGFloat
    fileprivate let maxCurrentHeight: CGFloat
    fileprivate let maxOffscreenWidth: CGFloat
    fileprivate let maxOffscrenHeight: CGFloat

    init(delegate: LiveAuctionLotCollectionViewDelegateLayout, size: Size) {
        self.delegate = delegate
        switch size {
        case .normal:
            self.visiblePrevNextSliceSize = 20
            maxCurrentWidth = 300
            maxCurrentHeight = 260
            maxOffscreenWidth = 200
            maxOffscrenHeight = 160
        case .compact:
            self.visiblePrevNextSliceSize = 0
            maxCurrentWidth = 280
            maxCurrentHeight = 150
            maxOffscreenWidth = maxCurrentWidth
            maxOffscrenHeight = maxCurrentHeight
        }

        super.init()

        itemSize = CGSize(width: maxCurrentWidth, height: maxCurrentHeight)
        scrollDirection = .horizontal
        minimumLineSpacing = 0
    }

    required init?(coder aDecoder: NSCoder) {
        // Sorry Storyboarders.
        return nil
    }

    /// A variable that defines how much smaller to make the current cell, and how far away from the centre to push next/previous cells.
    var repulsionConstant: CGFloat = 0 {
        didSet {
            invalidateLayout()
        }
    }

    override func prepare() {
        super.prepare()

        let width = collectionView?.frame.size.width ?? 0
        itemSize = CGSize(width: width, height: maxCurrentHeight)
    }

    /// We invalidate on every bounds change (every scroll).
    override func shouldInvalidateLayout(forBoundsChange newBounds: CGRect) -> Bool {
        return true
    }

    override func layoutAttributesForElements(in rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        // Regardless of the rect, we always return the three layout attributes
        return [0, 1, 2].compactMap { layoutAttributesForItem(at: IndexPath(item: $0, section: 0)) }
    }

    override func layoutAttributesForItem(at indexPath: IndexPath) -> UICollectionViewLayoutAttributes? {
        return super.layoutAttributesForItem(at: indexPath).flatMap { modifiedLayoutAttributesCopy($0) }
    }

    class override var layoutAttributesClass : AnyClass {
        return LiveAuctionLotCollectionViewLayoutAttributes.self
    }
}


/// Indicates scrolling direction (towards the Next or Previous lots, respectively).
private enum ScrollDirection {
    case next, previous
}

private enum CellPosition: Int {
    case previousUnderflow = -1
    case previous = 0
    case current = 1
    case next = 2
    case nextOverflow = 3

    var isUnderOverflow: Bool {
        return [.nextOverflow, .previousUnderflow].contains(self)
    }
}


private typealias LayoutMetrics = (restingWidth: CGFloat, restingHeight: CGFloat, targetWidth: CGFloat, targetHeight: CGFloat)
private typealias CenterXPositions = (restingCenterX: CGFloat, targetCenterX: CGFloat)

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
        return collectionView?.frame.width ?? 0
    }

    /// Computed variable for the amount the user has dragged. Has a range of (-1...0...1).
    /// Resting state is zero, -1 is dragging to the previous lot, and vice versa for the next.
    var ratioDragged: CGFloat {
        return ((collectionView?.contentOffset.x ?? 0) - collectionViewWidth) / collectionViewWidth
    }

    /// Computed variable for the direction the user is dragging.
    var userScrollDirection: ScrollDirection { return ratioDragged > 0 ? .next : .previous }

    /// Main entry for this extension. Applies layout attributes depending on the indexPath's item that is passed in.
    /// If the user has scrolled more than half way in either direction, the cell is placed in an overflow or underflow
    /// position (to be the next next or previous previous cells, since they're not in the collection view yet).
    func modifiedLayoutAttributesCopy(_ layoutAttributes: UICollectionViewLayoutAttributes) -> UICollectionViewLayoutAttributes {
        guard var copy = layoutAttributes.copy() as? UICollectionViewLayoutAttributes else { return layoutAttributes }
        switch (layoutAttributes.indexPath as IndexPath).item {
        case 0 where ratioDragged > 0.5:
            applyFancyLayoutToAttributes(&copy, position: .nextOverflow)
        case 0:
            applyFancyLayoutToAttributes(&copy, position: .previous)
        case 1:
            applyFancyLayoutToAttributes(&copy, position: .current)
        case 2 where ratioDragged < -0.5:
            applyFancyLayoutToAttributes(&copy, position: .previousUnderflow)
        case 2:
            applyFancyLayoutToAttributes(&copy, position: .next)
        default: break
        }

        return copy
    }

    /// Interpolates linearly from two float values based on the _absolute value_ of the ratio parameter.
    func interpolateFrom(_ a: CGFloat, to b: CGFloat, ratio: CGFloat) -> CGFloat {
        return a + abs(ratio) * (b - a)
    }

    /// Calculates and applies fancy layout to a set of attributes, given a specified position.
    func applyFancyLayoutToAttributes(_ layoutAttributes: inout UICollectionViewLayoutAttributes, position: CellPosition) {
        let index: RelativeIndex = position.rawValue

        // Grab/set information from the delegate.
        let aspectRatio = delegate.aspectRatioForIndex(index)
        (layoutAttributes as? LiveAuctionLotCollectionViewLayoutAttributes)?.url = delegate.thumbnailURLForIndex(index)

        // Calculate metrics, and subsequent centers. Note that the centers depend on the metrics.
        let preRepulsedMetrics = layoutMetricsForPosition(position, aspectRatio: aspectRatio)
        let preRepulsedCenters = centersForPosition(position, metrics: preRepulsedMetrics)

        // Apply repulsionConstant to metrics and centers.
        let metrics = applyRepulsionToMetrics(preRepulsedMetrics, atPosition: position, aspectRatio: aspectRatio)
        let centers = applyRepulsionToCenters(preRepulsedCenters, atPosition: position)

        // Apply the centers and metrics to the layout attributes.
        layoutAttributes.center.x = interpolateFrom(centers.restingCenterX, to: centers.targetCenterX, ratio: ratioDragged)
        layoutAttributes.center.y = (collectionView?.frame.midY ?? 0) - (repulsionConstant / 2)
        layoutAttributes.size.height = interpolateFrom(metrics.restingHeight, to: metrics.targetHeight, ratio: ratioDragged)
        layoutAttributes.size.width = interpolateFrom(metrics.restingWidth, to: metrics.targetWidth, ratio: ratioDragged)
    }

    /// This calculates the width and height of an attribute "at rest" and "at its target."
    /// It relies solely on the position and desired aspect ratio of the cell, and not on any
    /// calculated state from the collection view.
    /// Note: This function would be a good candidate to cache values if scrolling performance is an issue.
    func layoutMetricsForPosition(_ position: CellPosition, aspectRatio: CGFloat) -> LayoutMetrics {
        let restingWidth: CGFloat
        let restingHeight: CGFloat
        let targetHeight: CGFloat
        let targetWidth: CGFloat

        // Resting/target widths for the current position are always the same.
        // Depending on the aspect ratio, we use a given width or height, and calculate the other, for both resting and target metrics.
        // Overflow and underflow have the same target and at-rest metrics.
        // (Note: "Normal" layout values are given in comments for readability.)

        if aspectRatio > (maxCurrentWidth / maxCurrentHeight) {
            if position == .current {
                restingWidth = maxCurrentWidth  //300
                targetWidth = maxOffscreenWidth //200
            } else if position.isUnderOverflow {
                restingWidth = maxOffscreenWidth//200
                targetWidth = maxOffscreenWidth //200
            } else {
                restingWidth = maxOffscreenWidth//200
                targetWidth = maxCurrentWidth   //300
            }

            restingHeight = restingWidth / aspectRatio
            targetHeight = targetWidth / aspectRatio
        } else {
            if position == .current {
                restingHeight = maxCurrentHeight//300
                targetHeight = maxOffscrenHeight//200
            } else if position.isUnderOverflow {
                restingHeight = maxOffscrenHeight//200
                targetHeight = maxOffscrenHeight//200
            } else {
                restingHeight = maxOffscrenHeight//200
                targetHeight = maxCurrentHeight  //300
            }

            restingWidth = restingHeight * aspectRatio
            targetWidth = targetHeight * aspectRatio
        }

        return (restingWidth: restingWidth, restingHeight: restingHeight, targetWidth: targetWidth, targetHeight: targetHeight)
    }

    /// Given computed target and at-rest metrics, and a desired position, this function calculates target and at-rest centerX values.
    func centersForPosition(_ position: CellPosition, metrics: LayoutMetrics) -> CenterXPositions {
        let restingCenterX: CGFloat
        let targetCenterX: CGFloat

        // Note that metrics in here need to be offset by the width of the collection view, since index 1 is the "current" lot.
        switch position {
        // Current is easy, the at-rest center is the middle of the collection view and the target depends on scroll direction
        case .current:
            restingCenterX = (collectionView?.frame.midX ?? 0) + collectionViewWidth
            if userScrollDirection == .next {
                let targetRightEdge = visiblePrevNextSliceSize
                let computedLeftEdge = targetRightEdge - metrics.targetWidth
                targetCenterX = (targetRightEdge + computedLeftEdge) / 2 + collectionViewWidth * 2
            } else {
                let targetLeftEdge = collectionViewWidth - visiblePrevNextSliceSize
                let computedRightEdge = targetLeftEdge + metrics.targetWidth
                targetCenterX = (targetLeftEdge + computedRightEdge) / 2
            }
        // Next is trickier, our resting centerX is to the right of the screen with a bit visible.
        // Our target centerX depends on our scroll direction, and on if we are overflowing, in which case our rest and target
        // centerX values are the same.
        case .next: fallthrough
        case .nextOverflow:
            // isUnderOverflow used here to account for pushing the center off another collection view's width.
            let targetLeftEdge = (position.isUnderOverflow ? 3 : 2) * collectionViewWidth - visiblePrevNextSliceSize
            let computedRightEdge = targetLeftEdge + metrics.restingWidth

            restingCenterX = (targetLeftEdge + computedRightEdge) / 2

            if position.isUnderOverflow || userScrollDirection == .previous {
                targetCenterX = restingCenterX
            } else {
                targetCenterX = (collectionView?.frame.midX ?? 0) + collectionViewWidth * 2
            }
        // Previous is like next, but in reverse. The resting centerX is just off the left side of the screen, and the target
        // centerX depends on the scroll direction and on if we are underflowing.
        case .previous: fallthrough
        case .previousUnderflow:
            // isUnderOverflow used here to account for pushing the center off another collection view's width.
            let targetRightEdge = visiblePrevNextSliceSize - CGFloat(position.isUnderOverflow ? collectionViewWidth : 0) + collectionViewWidth
            let computedLeftEdge = targetRightEdge - metrics.restingWidth

            restingCenterX = (targetRightEdge + computedLeftEdge) / 2

            if position.isUnderOverflow || userScrollDirection == .next {
                targetCenterX = restingCenterX
            } else {
                targetCenterX = collectionView?.frame.midX ?? 0
            }
        }

        return (restingCenterX: restingCenterX, targetCenterX: targetCenterX)
    }

    /// Applies the instance's repulsionConstant to the metrics, returning new metrics.
    /// Only affects the current item.
    func applyRepulsionToMetrics(_ metrics: LayoutMetrics, atPosition position: CellPosition, aspectRatio: CGFloat) -> LayoutMetrics {
        let isWide = aspectRatio > (maxCurrentWidth / maxCurrentHeight)
        switch position {
        case .current where isWide:
            // Modify height
            return (restingWidth: metrics.restingWidth, restingHeight: metrics.restingHeight - (repulsionConstant / aspectRatio), targetWidth: metrics.targetWidth, targetHeight: metrics.targetHeight - (repulsionConstant / aspectRatio))
        case .current: // isWide == false
            // Modify width
            return (restingWidth: metrics.restingWidth - (repulsionConstant * aspectRatio), restingHeight: metrics.restingHeight, targetWidth: metrics.targetWidth - (repulsionConstant * aspectRatio), targetHeight: metrics.targetHeight)
        default: return metrics
        }
    }

    /// Applies the instance's repulsionConstant to the center X positions, returning new positions.
    /// Only affects next/previous items.
    func applyRepulsionToCenters(_ centers: CenterXPositions, atPosition position: CellPosition) -> CenterXPositions {
        // TODO: There's a problem with next/previous cells dis/appearing without animation if they're in/visible at the beginning or end of animation.
        // This hack keeps them "close enough" to visible most of the time to work, but a better solution would be to implement initialLayoutAttributesForAppearingItemAtIndexPath and finalLayoutAttributesForDisappearingItemAtIndexPath

        // scaleDownConstant takes the repulsion constant given to us and scales it down. We anticipate large
        // repulsionConstant vaues, so we scale them down so the prev/next cells don't go too far too fast.
        let scaleDownConstant: CGFloat = 4
        let diff = min(repulsionConstant/scaleDownConstant, visiblePrevNextSliceSize)
        switch position {
        case .current:
            return centers
        case .next: fallthrough
        case .nextOverflow:
            return (restingCenterX: centers.restingCenterX + diff, targetCenterX: centers.targetCenterX + diff)
        case .previous: fallthrough
        case .previousUnderflow:
            return (restingCenterX: centers.restingCenterX - diff, targetCenterX: centers.targetCenterX - diff)
        }
    }

}
