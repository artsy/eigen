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
    private var lotStateSubscription: (ObserverToken, Observable<LotState>)?
    private var askingPriceSubscription: (ObserverToken, Observable<UInt64>)?
}

private typealias Overrides = LotListCollectionViewCell
extension Overrides {
    override func prepareForReuse() {
        super.prepareForReuse()
        defer {
            lotStateSubscription = nil
            askingPriceSubscription = nil
        }

        if let computedLotStateSubscription = lotStateSubscription {
            computedLotStateSubscription.1.unsubscribe(computedLotStateSubscription.0)
        }

        if let askingPriceSubscription = askingPriceSubscription {
            askingPriceSubscription.1.unsubscribe(askingPriceSubscription.0)
        }
    }
}

private typealias PublicFunctions = LotListCollectionViewCell
extension PublicFunctions {
    // TODO: auctionViewModel is not used in this function.
    func configureForViewModel(viewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType, indexPath: NSIndexPath) {

        if userInterfaceNeedsSetup {
            userInterfaceNeedsSetup = false
            contentView.translatesAutoresizingMaskIntoConstraints = false
            contentView.alignToView(self)
        }
        
        resetViewHierarchy()

        isNotTopCell = (indexPath.item > 0)

        // TODO: Pending https://github.com/JensRavens/Interstellar/issues/40 this might look less messy.
        let lotStateSignal = viewModel.lotStateSignal

        self.lotStateSubscription = (lotStateSignal.subscribe { [weak self] state in
                self?.setLotState(state)
            }, lotStateSignal)

        askingPriceSubscription = (viewModel
            .askingPriceSignal
            .subscribe { [weak self] askingPrice in
                self?.currentAskingPriceLabel.text = "$30,000"
            }, viewModel.askingPriceSignal)

        lotImageView.ar_setImageWithURL(viewModel.urlForThumbnail)
        lotNumberLabel.text = viewModel.lotIndexDisplayString
        artistsNamesLabel.text = viewModel.lotArtist
    }
}
