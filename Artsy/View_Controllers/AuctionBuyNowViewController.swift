import UIKit


class AuctionBuyNowViewController: UIViewController {
    var isCompact: Bool
    var promotedSaleArtworks: [SaleArtwork]
//    var saleArtworksViewController: ARModelInfiniteScrollViewController

    init(isCompact: Bool, promotedSaleArtworks: [SaleArtwork]) {
        self.isCompact = isCompact
        self.promotedSaleArtworks = promotedSaleArtworks

        super.init(
            nibName: nil,
            bundle: nil
        )
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setup()
    }

    func setup() {
//        let viewController = ARArtworkSetViewController(artworkSet: promotedSaleArtworks, at: Int(index))
        displaySaleArtworks()
    }

    var sideSpacing: CGFloat {
        let compactSize = traitCollection.horizontalSizeClass == .compact
        return compactSize ? 40 : 80
    }

    func displaySaleArtworks() {
        let viewWidth = self.view.bounds.size.width

        let masonryModule: ARModelCollectionViewModule = ARSaleArtworkItemMasonryModule(
            traitCollection: traitCollection,
            width: viewWidth - sideSpacing
        )

//        saleArtworksViewController.activeModule = masonryModule
//        saleArtworksViewController.items = promotedSaleArtworks
    }
}
