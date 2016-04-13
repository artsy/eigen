import UIKit
import Artsy_UIColors
import FLKAutoLayout


class LotListCollectionViewCell: UICollectionViewCell {
    static let CellIdentifier = "LotCellIdentifier"
    static let Height: CGFloat = 80

    private var needsSetup = true

    override func didMoveToSuperview() {
        super.didMoveToSuperview()
        setup()
    }
}

private typealias PublicFunctions = LotListCollectionViewCell
extension PublicFunctions {
    func configureForViewModel(viewModel: LiveAuctionLotViewModelType) {

    }
}

private typealias PrivateFunctions = LotListCollectionViewCell
extension PrivateFunctions {
    func setup() {
        guard needsSetup else { return }
        needsSetup = false

        // TODO: Layout user interface
    }
}

private typealias Overrides = LotListCollectionViewCell
extension Overrides {

    override func applyLayoutAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        super.applyLayoutAttributes(layoutAttributes)
        guard let layoutAttributes = layoutAttributes as? LotListLayoutAttributes else { return }

        if layoutAttributes.selected {
            backgroundColor = .artsyPurpleRegular()
        } else {
            backgroundColor = .grayColor()
        }
    }
}
