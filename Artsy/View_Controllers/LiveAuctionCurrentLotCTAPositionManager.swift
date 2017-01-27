import UIKit

/// This class manages the position of the current lot call-to-action, based on a scrolling
/// scroll view and jumping directly to lots.
/// Bit of a leaky abstraction, using the CTA view as a supplementary view in the collection view of 
/// lot images would be better but won't work unfortunately.
class LiveAuctionCurrentLotCTAPositionManager: NSObject {
    let salesPerson: LiveAuctionsSalesPersonType
    let bottomPositionConstraint: NSLayoutConstraint

    fileprivate var currentLot: LiveAuctionLotViewModelType?

    fileprivate let hiddenConstraintConstant: CGFloat = 100
    fileprivate let visibleConstraintConstant: CGFloat = -5

    init(salesPerson: LiveAuctionsSalesPersonType, bottomPositionConstraint: NSLayoutConstraint) {
        self.salesPerson = salesPerson
        self.bottomPositionConstraint = bottomPositionConstraint

        super.init()

        salesPerson.currentLotSignal.subscribe { [weak self] currentLot in
            self?.currentLot = currentLot
        }

        salesPerson.currentFocusedLotIndex.subscribe { [weak self] focusedIndex in
            self?.didJump(to: focusedIndex)
        }
    }
}

private typealias PublicFunctions = LiveAuctionCurrentLotCTAPositionManager
extension PublicFunctions {

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let originLot = salesPerson.lotViewModelRelativeToShowingIndex(0)
        guard let currentLot = self.currentLot else {
            // If there is no current lot, hide the current lot CTA.
            bottomPositionConstraint.constant = hiddenConstraintConstant
            return
        }

        let atRestOffset = scrollView.contentSize.width / 3
        let offset = scrollView.contentOffset.x

        /*
         First determine if we're scrolling left or right, also determine the factor by
         which we have already scrolled in that direction.
         */
        let targetLot: LiveAuctionLotViewModelType
        let factor: CGFloat
        if offset > atRestOffset {
            // Scrolling to the right, target is next lot.
            targetLot = salesPerson.lotViewModelRelativeToShowingIndex(1)
            factor = 1 - (offset - atRestOffset) / atRestOffset
        } else  if offset < atRestOffset {
            // Scrolling to the left, target is previous lot.
            targetLot = salesPerson.lotViewModelRelativeToShowingIndex(-1)
            factor = offset / atRestOffset
        } else {
            // Here to satisfy the compiler.
            targetLot = originLot
            factor = 1
        }

        /*
         If the origin is current, interpolate from how far we've scrolled _towards_ the target
         If the target is current, interpolate from how far we've scrolled _away from_ the target
         If neither origin nor target sale artwork are current, fully display
         */
        switch currentLot.lotID {
        case originLot.lotID:
            // Moving away from current lot.
            bottomPositionConstraint.constant = lerp(from: visibleConstraintConstant, to: hiddenConstraintConstant, by: factor)
        case targetLot.lotID:
            // Moving towards current lot.
            bottomPositionConstraint.constant = lerp(from: hiddenConstraintConstant, to: visibleConstraintConstant, by: factor)
        default:
            // Neither origin nor target is the current lot.
            bottomPositionConstraint.constant = visibleConstraintConstant
        }
    }
}

private typealias PrivateFunctions = LiveAuctionCurrentLotCTAPositionManager
fileprivate extension PrivateFunctions {
    func didJump(to focusedLotIndex: Int) {
        let focusedLot = salesPerson.lotViewModelForIndex(focusedLotIndex)
        guard let currentLot = self.currentLot else {
            // If there is no current lot, hide the current lot CTA.
            bottomPositionConstraint.constant = hiddenConstraintConstant
            return
        }

        if currentLot.lotID == focusedLot.lotID {
            bottomPositionConstraint.constant = hiddenConstraintConstant
        } else {
            bottomPositionConstraint.constant = visibleConstraintConstant
        }
    }
}

// Provides a linear interpolation between a and b based on factor. Grabbed from Wikipedia.
fileprivate func lerp(from a: CGFloat, to b: CGFloat, by factor: CGFloat) -> CGFloat {
    return ((1-factor) * a) + (factor * b)
}
