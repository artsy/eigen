import UIKit

class LiveAuctionLotImageCollectionViewCell: UICollectionViewCell {
    fileprivate var userInterfaceNeedsSetup = true
    fileprivate let lotImageView = UIImageView()
    fileprivate var lastUpdatedIndex: Int?

    override func prepareForReuse() {
        lastUpdatedIndex = nil
    }

    override func apply(_ layoutAttributes: UICollectionViewLayoutAttributes) {
        super.apply(layoutAttributes)

        // Continue only if we successfully cast the attributes, and if we extract a non-nil URL.
        guard let
            castLayoutAttributes = layoutAttributes as? LiveAuctionLotCollectionViewLayoutAttributes,
            let url = castLayoutAttributes.url
            else { return }

        // To avoid superfluously re-setting the URL on the image view, check that we actually need to update it.
        if lastUpdatedIndex != (layoutAttributes.indexPath as IndexPath).item {
            lastUpdatedIndex = (layoutAttributes.indexPath as IndexPath).item

            lotImageView.ar_setImage(with: url)
        }
    }
}

private typealias PublicFunctions = LiveAuctionLotImageCollectionViewCell
extension PublicFunctions {

    func configureForLot(_ lot: LiveAuctionLotViewModelType, atIndex index: Int) {
        if userInterfaceNeedsSetup {
            userInterfaceNeedsSetup = false

            // Set up our content view.
            contentView.translatesAutoresizingMaskIntoConstraints = false
            contentView.align(toView: self)

            // Set up our image view.
            contentView.addSubview(lotImageView)
            lotImageView.align(toView: contentView)
            lotImageView.contentMode = .scaleAspectFit
        }

        guard index != lastUpdatedIndex else { return }
        lastUpdatedIndex = index

        lotImageView.ar_setImage(with: lot.urlForThumbnail)
    }

}
