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
}

private typealias PrivateFunctions = AuctionBuyNowViewController
extension PrivateFunctions {
    func setup() {
        addTitle()
        addSaleArtworks()
        addBottomBorder()
    }

    func addTitle() {
        let titleView = AuctionBuyNowTitleView(isCompact: isCompact)
        self.view.addSubview(titleView)
        titleView.alignTopEdge(withView: self.view, predicate: "0")
        titleView.alignLeading("0", trailing: "0", toView: self.view)
        titleView.alignBottomEdge(withView: self.view, predicate: "0")
    }

    var sideSpacing: CGFloat {
        let compactSize = traitCollection.horizontalSizeClass == .compact
        return compactSize ? 40 : 80
    }

    func addSaleArtworks() {
        let viewWidth = self.view.bounds.size.width
        let module = ARSaleArtworkItemMasonryModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)
        let items = promotedSaleArtworks.map { SaleArtworkViewModel(saleArtwork: $0 ) }
        let viewController = AREmbeddedModelsViewController()
        viewController.activeModule = module
        viewController.showTrailingLoadingIndicator = true
        viewController.appendItems(items)

        ar_addAlignedModernChildViewController(viewController)
    }

    func addBottomBorder() {
        let bottomBorder = UIView().then {
            $0.backgroundColor = UIColor.artsyGrayRegular()
            $0.constrainHeight("1")
        }

        self.view.addSubview(bottomBorder)

        bottomBorder.alignBottomEdge(withView: self.view, predicate: "0")
        bottomBorder.alignLeading("0", trailing: "0", toView: self.view)
    }
}
