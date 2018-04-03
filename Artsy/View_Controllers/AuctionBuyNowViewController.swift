import UIKit


class AuctionBuyNowViewController: UIViewController {
    var isCompact: Bool
    var promotedSaleArtworks: [SaleArtwork]

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

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        setup()
    }
}

private typealias PrivateFunctions = AuctionBuyNowViewController
extension PrivateFunctions {

    func setup() {
        let titleView = AuctionBuyNowTitleView(isCompact: isCompact)
        self.view.addSubview(titleView)
        titleView.alignTopEdge(withView: self.view, predicate: "0")
        titleView.alignLeading("0", trailing: "0", toView: self.view)

        // It's hard to know the full width ahead of time, so we use the ARTopMenuViewController
        // which is consistent across orientations, etc
        let viewWidth = ARTopMenuViewController.shared().view.bounds.size.width
        let sideSpacing: CGFloat = isCompact ? 40 : 80
        let module = ARSaleArtworkItemMasonryModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)
        let items = promotedSaleArtworks.map { SaleArtworkViewModel(saleArtwork: $0 ) }
        let viewController = AREmbeddedModelsViewController()

        ar_addModernChildViewController(viewController)

        viewController.view.constrainTopSpace(toView: titleView, predicate: "0")
        viewController.view.alignLeading("0", trailing: "0", toView: self.view)
        viewController.activeModule = module
        viewController.constrainHeightAutomatically = true
        viewController.appendItems(items)

        let bottomBorder = UIView()
        bottomBorder.backgroundColor = .artsyGrayRegular()
        bottomBorder.constrainHeight("1")
        self.view.addSubview(bottomBorder)

        bottomBorder.constrainTopSpace(toView: viewController.view, predicate: "0")
        bottomBorder.alignLeading("0", trailing: "0", toView: self.view)
        bottomBorder.alignBottomEdge(withView: self.view, predicate: "0")
    }
}
