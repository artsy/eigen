import UIKit

class AuctionBuyNowView: ORStackView {
    var embeddedVC: AREmbeddedModelsViewController?
    var actionDelegate: UIViewController?

    var saleArtworks: [SaleArtwork]?
    var isCompact = true

    func setup(isCompact: Bool, promotedSaleArtworks: [SaleArtwork], viewController: UIViewController, delegate: UIViewController) {

        let titleView = AuctionBuyNowTitleView(isCompact: isCompact)
        let viewWidth = superview!.bounds.width
        let sideSpacing: CGFloat = isCompact ? 40 : 80

        addSubview(titleView, withTopMargin: "0", sideMargin:"0")
        let module = ARSaleArtworkItemMasonryModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)
        
        let items = promotedSaleArtworks.map { SaleArtworkViewModel(saleArtwork: $0 ) }
        let buyNowWorksVC = AREmbeddedModelsViewController()

        add(buyNowWorksVC, toParent: viewController, withTopMargin: "0", sideMargin: "0")

        buyNowWorksVC.activeModule = module
        buyNowWorksVC.constrainHeightAutomatically = true
        buyNowWorksVC.appendItems(items)
        buyNowWorksVC.delegate = self

        let bottomBorder = UIView()
        bottomBorder.backgroundColor = .artsyGrayRegular()
        bottomBorder.constrainHeight("1")
        addSubview(bottomBorder, withTopMargin: "2")

        bottomMarginHeight = 0

        self.embeddedVC = buyNowWorksVC
        self.isCompact = isCompact
        self.saleArtworks = promotedSaleArtworks
        self.actionDelegate = delegate
    }

    override func updateConstraints() {
        self.embeddedVC?.activeModule = self.embeddedVC?.activeModule
        self.embeddedVC?.collectionView.reloadData()
        self.embeddedVC?.updateViewConstraints()
        super.updateConstraints()
    }
}


fileprivate typealias EmbeddedModelCallbacks = AuctionBuyNowView
extension EmbeddedModelCallbacks: AREmbeddedModelsViewControllerDelegate {
    func embeddedModelsViewController(_ controller: AREmbeddedModelsViewController!, didTapItemAt index: UInt) {
        let viewController = ARArtworkSetViewController(artworkSet: saleArtworks?.map { $0.artwork }, at: Int(index))
        self.actionDelegate?.navigationController?.pushViewController(viewController!, animated: true)
    }

    func embeddedModelsViewController(_ controller: AREmbeddedModelsViewController!, shouldPresent viewController: UIViewController!) {
        self.actionDelegate?.navigationController?.pushViewController(viewController, animated: true)
    }
}
