import UIKit
import FLKAutoLayout

class LiveAuctionLotImageCollectionViewCell: UICollectionViewCell {
    private var userInterfaceNeedsSetup = true
    private let lotImageView = UIImageView()
    private var lastUpdatedIndex: Int?

    override func prepareForReuse() {
        lastUpdatedIndex = nil
    }

    override func applyLayoutAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        super.applyLayoutAttributes(layoutAttributes)

        // Continue only if we successfully cast the attributes, and if we extract a non-nil URL.
        guard let
            castLayoutAttributes = layoutAttributes as? LiveAuctionLotCollectionViewLayoutAttributes,
            url = castLayoutAttributes.url
            else { return }

        // To avoid superfluously re-setting the URL on the image view, check that we actually need to update it.
        if lastUpdatedIndex != layoutAttributes.indexPath.item {
            lastUpdatedIndex = layoutAttributes.indexPath.item

            lotImageView.ar_setImageWithURL(url)
        }
    }
}

private typealias PublicFunctions = LiveAuctionLotImageCollectionViewCell
extension PublicFunctions {

    func configureForLot(lot: LiveAuctionLotViewModelType, atIndex index: Int) {
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

        guard index != lastUpdatedIndex else { return }
        lastUpdatedIndex = index

        lotImageView.ar_setImageWithURL(lot.urlForThumbnail)
    }

}
