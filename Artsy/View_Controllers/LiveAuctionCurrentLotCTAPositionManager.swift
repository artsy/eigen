import UIKit

class LiveAuctionCurrentLotCTAPositionManager: NSObject {
    let salesPerson: LiveAuctionsSalesPersonType
    let bottomPositionConstraint: NSLayoutConstraint

    fileprivate var currentLot: LiveAuctionLotViewModelType?

    fileprivate let hiddenConstraintConstant: CGFloat = 100
    fileprivate let visibleConstraintConstant: CGFloat = 5

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
        guard let currentLot = self.currentLot else { return }

        let atRestOffset = scrollView.contentSize.width / 3
        let offset = scrollView.contentOffset.x

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
        let z: CGFloat
        switch currentLot.lotID {
        case originLot.lotID:
            z = lerp(from: 1, to: 0, by: factor)
        case targetLot.lotID:
            z = lerp(from: 0, to: 1, by: factor)
        default:
            z = 1
        }

        bottomPositionConstraint.constant = lerp(from: hiddenConstraintConstant, to: -visibleConstraintConstant, by: z)
    }
}

private typealias PrivateFunctions = LiveAuctionCurrentLotCTAPositionManager
fileprivate extension PrivateFunctions {
    func didJump(to focusedLotIndex: Int) {
        let focusedLot = salesPerson.lotViewModelForIndex(focusedLotIndex)
        guard let currentLot = self.currentLot else { return }

        if currentLot.lotID == focusedLot.lotID {
            bottomPositionConstraint.constant = hiddenConstraintConstant
        } else {
            bottomPositionConstraint.constant = visibleConstraintConstant
        }
    }
}

// Provides a linear interpolation between a and b based on factor. Grabed from Wikipedia.
fileprivate func lerp(from a: CGFloat, to b: CGFloat, by factor: CGFloat) -> CGFloat {
    return ((1-factor) * a) + (factor * b)
}
