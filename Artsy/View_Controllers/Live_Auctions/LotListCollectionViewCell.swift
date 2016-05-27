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
    private var lotStateSubscription: ObserverToken<LotState>?
    private var askingPriceSubscription: ObserverToken<UInt64>?

    deinit {
        lotStateSubscription?.unsubscribe()
        askingPriceSubscription?.unsubscribe()
    }
}

private typealias Overrides = LotListCollectionViewCell
extension Overrides {
    override func prepareForReuse() {
        super.prepareForReuse()
        defer {
            lotStateSubscription = nil
            askingPriceSubscription = nil
        }

        lotStateSubscription?.unsubscribe()
        askingPriceSubscription?.unsubscribe()
    }
}

private typealias PublicFunctions = LotListCollectionViewCell
extension PublicFunctions {
    func configureForViewModel(viewModel: LiveAuctionLotViewModelType, indexPath: NSIndexPath) {

        let currencySymbol = viewModel.currencySymbol

        if userInterfaceNeedsSetup {
            userInterfaceNeedsSetup = false
            contentView.translatesAutoresizingMaskIntoConstraints = false
            contentView.alignToView(self)
        }
        
        resetViewHierarchy()

        isNotTopCell = (indexPath.item > 0)

        // TODO: Pending https://github.com/JensRavens/Interstellar/issues/40 this might look less messy.
        let lotStateSignal = viewModel.lotStateSignal

        self.lotStateSubscription = lotStateSignal.subscribe { [weak self] state in
                self?.setLotState(state)
            }

        askingPriceSubscription = viewModel
            .askingPriceSignal
            .subscribe { [weak self] askingPrice in
                self?.currentAskingPriceLabel.text = askingPrice.convertToDollarString(currencySymbol)
                return
            }

        lotImageView.ar_setImageWithURL(viewModel.urlForThumbnail)
        lotNumberLabel.text = viewModel.lotIndexDisplayString
        artistsNamesLabel.text = viewModel.lotArtist
    }
}
