import UIKit
import Artsy_UIColors
import FLKAutoLayout
import Interstellar


class LotListCollectionViewCell: UICollectionViewCell {
    static let CellIdentifier = "LotCellIdentifier"
    static let Height: CGFloat = 80

    let imageView = UIImageView()
    let labelContainerView = LotListCollectionViewCell._labelContainerView()
    let currentLotIndicatorImageView = UIImageView()
    let lotNumberLabel = LotListCollectionViewCell._lotNumberLabel()
    let artistsNamesLabel = LotListCollectionViewCell._artistNamesLabel()
    let currentAskingPriceLabel = LotListCollectionViewCell._currentAskingPriceLabel()

    private var needsSetup = true

//    override func layoutSubviews() {
//        super.layoutSubviews()
//
//    }
}

private typealias PublicFunctions = LotListCollectionViewCell
extension PublicFunctions {
    func configureForViewModel(viewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType) {

        if needsSetup {
            needsSetup = false
            setup()
        }

        // TODO: These subscriptions require disposal.
        viewModel
            .computedLotStateSignal(auctionViewModel)
            .next { [weak self] state in
                self?.setLotState(state)
            }

        viewModel
            .askingPriceSignal
            .next { [weak self] askingPrice in
                self?.currentAskingPriceLabel.text = "$30,000"
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
            backgroundColor = .whiteColor()
        }
    }
}
