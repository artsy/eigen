import UIKit
import Artsy_UIColors
import FLKAutoLayout
import Interstellar


class LotListCollectionViewCell: UICollectionViewCell {
    static let CellIdentifier = "LotCellIdentifier"
    static let Height: CGFloat = 80

    let imageView = UIImageView()
    let labelContainerView = UIView()
    let currentLotIndicatorImageView = UIImageView()
    let lotNumberLabel = LotListCollectionViewCell._lotNumberLabel()
    let artistsNamesLabel = LotListCollectionViewCell._artistNamesLabel()
    let currentAskingPriceLabel = LotListCollectionViewCell._currentAskingPriceLabel()

    private var needsSetup = true

    override func didMoveToSuperview() {
        super.didMoveToSuperview()

        guard needsSetup else { return }
        needsSetup = false
        setup()
    }
}

private typealias PublicFunctions = LotListCollectionViewCell
extension PublicFunctions {
    func configureForViewModel(viewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType) {

        viewModel
            .computedLotStateSignal(auctionViewModel)
            .next { [weak self] state in
                self?.setLotState(state)
            }

        viewModel
            .askingPriceSignal
            .next { [weak self] askingPrice in
                self?.currentAskingPriceLabel.text = "$DOLLARS"
            }

        imageView.ar_setImageWithURL(viewModel.urlForThumbnail)

        lotNumberLabel.text = "Lot \(viewModel.lotIndex)"
        artistsNamesLabel.text = viewModel.lotArtist
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
