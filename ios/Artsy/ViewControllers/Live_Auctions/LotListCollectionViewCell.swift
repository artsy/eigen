import UIKit
import Interstellar


class LotListCollectionViewCell: UICollectionViewCell {
    static let CellIdentifier = "LotCellIdentifier"
    static let Height: CGFloat = 80

    let lotImageView = UIImageView()
    let hammerImageView = UIImageView(image: UIImage(asset: .Lot_bidder_hammer_white))
    let labelContainerView = LotListCollectionViewCell._labelContainerView()
    let closedLabel = LotListCollectionViewCell._closedLabel()
    let currentLotIndicatorImageView = UIImageView()
    let lotNumberLabel = LotListCollectionViewCell._lotNumberLabel()
    let artistsNamesLabel = LotListCollectionViewCell._artistNamesLabel()
    let currentAskingPriceLabel = LotListCollectionViewCell._currentAskingPriceLabel()
    let topSeparator = ARSeparatorView()
    let bottomSeparator = ARSeparatorView()
    var isNotTopCell = true

    fileprivate var userInterfaceNeedsSetup = true
    fileprivate var lotStateSubscription: ObserverToken<LotState>?
    fileprivate var askingPriceSubscription: ObserverToken<UInt64>?

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
    func configureForViewModel(_ viewModel: LiveAuctionLotViewModelType, indexPath: IndexPath) {

        let currencySymbol = viewModel.currencySymbol

        if userInterfaceNeedsSetup {
            userInterfaceNeedsSetup = false
            contentView.translatesAutoresizingMaskIntoConstraints = false
            contentView.align(toView: self)
            lotImageView.contentMode = .scaleAspectFill
            lotImageView.clipsToBounds = true
        }

        resetViewHierarchy()

        isNotTopCell = (indexPath.item > 0)

        self.lotStateSubscription = viewModel.lotStateSignal.subscribe { [weak self] state in
                self?.setLotState(state)
            }

        askingPriceSubscription = viewModel
            .askingPriceSignal
            .subscribe { [weak self] askingPrice in
                self?.currentAskingPriceLabel.text = askingPrice.convertToDollarString(currencySymbol)
                return
            }

        lotImageView.ar_setImage(with: viewModel.urlForThumbnail)
        lotNumberLabel.text = viewModel.formattedLotIndexDisplayString
        artistsNamesLabel.text = viewModel.lotArtist
    }
}
