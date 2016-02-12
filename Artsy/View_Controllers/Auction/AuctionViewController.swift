import UIKit
import ORStackView
import Then

class AuctionViewController: UIViewController {
    let saleID: String
    var saleViewModel: SaleViewModel!
    var appeared = false

    var headerStack: ORStackView!
    var stickyHeader: ScrollingStickyHeaderView!

    var allowAnimations = true

    /// Variable for storing lazily-computed default refine settings. 
    /// Should not be accessed directly, call defaultRefineSettings() instead.
    private var _defaultRefineSettings: AuctionRefineSettings?
    private var saleArtworksViewController: ARModelInfiniteScrollViewController!

    /// Current refine settings.
    /// Our refine settings are (by default) the defaultRefineSettings().
    lazy var refineSettings: AuctionRefineSettings = {
        return self.defaultRefineSettings()
    }()

    lazy var networkModel: AuctionNetworkModelType = {
        return AuctionNetworkModel(saleID: self.saleID)
    }()

    init(saleID: String) {
        self.saleID = saleID
        super.init(nibName: nil, bundle: nil)
    }

    // Required by Swift compiler, sadly.
    required init?(coder aDecoder: NSCoder) {
        self.saleID = ""
        super.init(coder: aDecoder)
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        headerStack = ORTagBasedAutoStackView()
        saleArtworksViewController = ARModelInfiniteScrollViewController()

        ar_addAlignedModernChildViewController(saleArtworksViewController)

        saleArtworksViewController.headerStackView = headerStack
        saleArtworksViewController.modelViewController.delegate = self
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        guard appeared == false else { return }
        appeared = true

        self.ar_presentIndeterminateLoadingIndicatorAnimated(animated)
        
        self.networkModel.fetch().next { saleViewModel in
            self.setupForSale(saleViewModel)
        }.error { error in
            // TODO: Error-handling somehow
        }
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // TODO: Should switch based on refine settings
//        saleArtworksViewController.modelViewController.activeModule = ARSaleArtworkItemFlowModule(traitCollection: self.traitCollection)
    }

    enum ViewTags: Int {
        case Banner = 0, Title
        
        case WhitespaceGobbler
    }

}

extension AuctionViewController {
    func setupForSale(saleViewModel: SaleViewModel) {
        // TODO: Sale is currently private on the SaleViewModel, also Sale will need to be extended to conform to ARSpotlightMetadataProvider
        // artworksViewController.spotlightEntity = saleViewModel.sale

        self.saleViewModel = saleViewModel

        [ (AuctionBannerView(viewModel: saleViewModel), ViewTags.Banner),
          (AuctionTitleView(viewModel: saleViewModel, registrationStatus: networkModel.registrationStatus, delegate: self), .Title)
        ].forEach { (view, tag) in
            view.tag = tag.rawValue
            headerStack.addSubview(view, withTopMargin: "0", sideMargin: "0")
        }

        stickyHeader = ScrollingStickyHeaderView().then {
            $0.toggleAttatched(false, animated:false)
            $0.button.setTitle("Refine", forState: .Normal)
            $0.titleLabel.text = saleViewModel.displayName
            $0.button.addTarget(self, action: "showRefineTapped", forControlEvents: .TouchUpInside)
            $0.subtitleLabel.text = "\(saleViewModel.numberOfLots) works"
        }

        saleArtworksViewController.stickyHeaderView = stickyHeader
        saleArtworksViewController.invalidateHeaderHeight()

        displayCurrentItems()
        saleArtworksViewController.modelViewController.showTrailingLoadingIndicator = false

        self.ar_removeIndeterminateLoadingIndicatorAnimated(allowAnimations)
    }

    func defaultRefineSettings() -> AuctionRefineSettings {
        guard let defaultSettings = _defaultRefineSettings else {
            let defaultSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber, range: self.saleViewModel.lowEstimateRange)
            _defaultRefineSettings = defaultSettings
            return defaultSettings
        }
        return defaultSettings
    }

    func showRefineTapped() {
        let refineViewController = AuctionRefineViewController(defaultSettings: defaultRefineSettings(), initialSettings: refineSettings).then {
            $0.delegate = self
            $0.modalPresentationStyle = .FormSheet
            $0.changeStatusBar = self.traitCollection.horizontalSizeClass == .Compact
        }
        presentViewController(refineViewController, animated: true, completion: nil)
    }

    func displayCurrentItems() {
        let items = saleViewModel.refinedSaleArtworks(refineSettings)

        // TODO: Module depends on current refineSettings
        saleArtworksViewController.modelViewController.activeModule = ARSaleArtworkItemFlowModule(traitCollection: self.traitCollection, width: self.view.bounds.size.width - 40)

        saleArtworksViewController.modelViewController.resetItems()
        saleArtworksViewController.modelViewController.appendItems(items)
    }
}

private typealias TitleCallbacks = AuctionViewController
extension TitleCallbacks: AuctionTitleViewDelegate {
    func userDidPressInfo(titleView: AuctionTitleView) {
        // TODO:
    }

    func userDidPressRegister(titleView: AuctionTitleView) {
        // TODO: We've got to make sure the user is logged in before booting them out to martsy
    }
}

private typealias RefineSettings = AuctionViewController
extension RefineSettings: AuctionRefineViewControllerDelegate {
    func userDidCancel(controller: AuctionRefineViewController) {
        dismissViewControllerAnimated(true, completion: nil)
    }

    func userDidApply(settings: AuctionRefineSettings, controller: AuctionRefineViewController) {
        refineSettings = settings

        displayCurrentItems()
        dismissViewControllerAnimated(true, completion: nil)
    }
}

private typealias EmbeddedModelCallbacks = AuctionViewController
extension EmbeddedModelCallbacks: AREmbeddedModelsViewControllerDelegate {
    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, didTapItemAtIndex index: UInt) {
        // TODO
    }

    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, shouldPresentViewController viewController: UIViewController!) {
        navigationController?.pushViewController(viewController, animated: true)
    }

    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, stickyHeaderDidChangeStickyness isAttatchedToLeadingEdge: Bool) {
        stickyHeader.stickyHeaderHeight.constant = isAttatchedToLeadingEdge ? 120 : 60
        stickyHeader.toggleAttatched(isAttatchedToLeadingEdge, animated: true)
    }
}