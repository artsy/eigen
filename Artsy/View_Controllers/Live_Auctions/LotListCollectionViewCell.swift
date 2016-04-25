import UIKit
import Artsy_UIColors
import FLKAutoLayout
import Interstellar


class LotListCollectionViewCell: UICollectionViewCell {
    static let CellIdentifier = "LotCellIdentifier"
    static let Height: CGFloat = 80

    let lotImageView = UIImageView()
    let hammerImageView = UIImageView(image: UIImage(asset: .Lot_bidder_hammer_white))
    let labelContainerView = LotListCollectionViewCell._labelContainerView()
    let currentLotIndicatorImageView = UIImageView()
    let lotNumberLabel = LotListCollectionViewCell._lotNumberLabel()
    let artistsNamesLabel = LotListCollectionViewCell._artistNamesLabel()
    let currentAskingPriceLabel = LotListCollectionViewCell._currentAskingPriceLabel()
    let topSeparator = ARSeparatorView()
    let bottomSeparator = ARSeparatorView()
    var isNotTopCell = true

    private var userInterfaceNeedsSetup = true
}

private typealias PublicFunctions = LotListCollectionViewCell
extension PublicFunctions {
    func configureForViewModel(viewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType, indexPath: NSIndexPath) {

        if userInterfaceNeedsSetup {
            userInterfaceNeedsSetup = false
            setup()
        }

        isNotTopCell = (indexPath.item > 0)

        // TODO: These subscriptions require disposal in prepareForReuse().
        viewModel
            .computedLotStateSignal(auctionViewModel)
            .subscribe { [weak self] state in
                self?.setLotState(state)
            }

        viewModel
            .askingPriceSignal
            .subscribe { [weak self] askingPrice in
                self?.currentAskingPriceLabel.text = "$30,000"
            }

        lotImageView.ar_setImageWithURL(viewModel.urlForThumbnail)
        lotNumberLabel.text = "Lot \(viewModel.lotIndex)"
        artistsNamesLabel.text = viewModel.lotArtist
    }
}
