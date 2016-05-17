import UIKit
import FLKAutoLayout

class LiveAuctionLotImageCollectionViewCell: UICollectionViewCell {
    private var userInterfaceNeedsSetup = true
    private let lotImageView = UIImageView()
}

private typealias PublicFunctions = LiveAuctionLotImageCollectionViewCell
extension PublicFunctions {

    func configureForLot(lot: LiveAuctionLotViewModelType) {
        if userInterfaceNeedsSetup {
            userInterfaceNeedsSetup = false

            // Set up our content view.
            contentView.translatesAutoresizingMaskIntoConstraints = false
            contentView.alignToView(self)

            // Set up our image view.
            contentView.addSubview(lotImageView)
            lotImageView.alignToView(contentView)
            lotImageView.contentMode = .ScaleAspectFit
        }

        lotImageView.ar_setImageWithURL(lot.urlForThumbnail)
    }
    
}
