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

        // Disable the vertical offset for status bar.
        automaticallyAdjustsScrollViewInsets = false
        saleArtworksViewController.automaticallyAdjustsScrollViewInsets = false

        saleArtworksViewController.headerStackView = headerStack
        saleArtworksViewController.showTrailingLoadingIndicator = false
        saleArtworksViewController.delegate = self
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        guard appeared == false else { return }
        appeared = true

        self.ar_presentIndeterminateLoadingIndicatorAnimated(animated)
        
        self.networkModel.fetch().next { [weak self] saleViewModel in
            self?.setupForSale(saleViewModel)
        }.error { error in
            // TODO: Error-handling somehow
        }
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        guard saleViewModel != nil else {
            // We can't set up our current saleArtworksViewController if it has no models.
            return
        }

        displayCurrentItems()
    }

    override func viewWillTransitionToSize(size: CGSize, withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransitionToSize(size, withTransitionCoordinator: coordinator)

        displayCurrentItems(size.width)
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

        let bannerView = AuctionBannerView(viewModel: saleViewModel)
        bannerView.tag = ViewTags.Banner.rawValue
        headerStack.addSubview(bannerView, withTopMargin: "0", sideMargin: "0")

        let compactSize = traitCollection.horizontalSizeClass == .Compact
        let topSpacing = compactSize ? 20 : 30
        let sideSpacing = compactSize ? 40 : 80
        let titleView = AuctionTitleView(viewModel: saleViewModel, registrationStatus: networkModel.registrationStatus, delegate: self, fullWidth: compactSize, showAdditionalInformation: true)
        titleView.tag = ViewTags.Title.rawValue
        headerStack.addSubview(titleView, withTopMargin: "\(topSpacing)", sideMargin: "\(sideSpacing)")

        stickyHeader = ScrollingStickyHeaderView().then {
            $0.toggleAttatched(false, animated:false)
            $0.button.setTitle("Refine", forState: .Normal)
            $0.titleLabel.text = saleViewModel.displayName
            $0.button.addTarget(self, action: "showRefineTapped", forControlEvents: .TouchUpInside)
        }

        saleArtworksViewController.stickyHeaderView = stickyHeader
        saleArtworksViewController.invalidateHeaderHeight()

        displayCurrentItems()

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

    var sideSpacing: CGFloat {
        let compactSize = traitCollection.horizontalSizeClass == .Compact
        return compactSize ? 40 : 80
    }

    // viewWidth allows callers to define widths that our view _will_ become. Use nil to fallback to current view's width.
    func displayCurrentItems(viewWidth: CGFloat? = nil) {
        let items = saleViewModel.refinedSaleArtworks(refineSettings)

        let viewWidth = viewWidth ?? self.view.bounds.size.width

        // TODO: Module depends on current refineSettings
        saleArtworksViewController.activeModule = ARSaleArtworkItemFlowModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)

        saleArtworksViewController.items = items
        stickyHeader.subtitleLabel.text = saleViewModel.subtitleForRefineSettings(refineSettings, defaultRefineSettings: defaultRefineSettings())
    }
}

private typealias TitleCallbacks = AuctionViewController
extension TitleCallbacks: AuctionTitleViewDelegate {
    func userDidPressInfo(titleView: AuctionTitleView) {

        let auctionInformation = AuctionInformation(partnerName: "Sotheby’s", title: "Sotheby’s Boundless Contemporary", description: "On Thursday, November 12, Swiss Institute will host their Annual Benefit Dinner & Auction–the most important fundraising event of the year–with proceeds going directly towards supporting their innovative exhibitions and programs. Since 1986, Swiss Institute has been dedicated to promoting forward-thinking and experimental art.", startsAt: "January 26 6:00PM EST", contact: "TODO Markdown?", FAQEntries: [])

        let auctionInforVC = AuctionInformationViewController(auctionInformation: auctionInformation, saleViewModel: saleViewModel)

        auctionInforVC.titleViewDelegate = self

        let controller = ARSerifNavigationViewController(rootViewController: auctionInforVC)
        presentViewController(controller, animated: true, completion: nil)
    }

    func userDidPressRegister(titleView: AuctionTitleView) {
        let showRegister = {
            ARTrialController.presentTrialWithContext(.AuctionRegistration) { created in
                let registrationPath = "/auction-registration/\(self.saleID)"
                let viewController = ARSwitchBoard.sharedInstance().loadPath(registrationPath)
                self.navigationController?.pushViewController(viewController, animated: true)
            }
        }
        if let _ = presentedViewController {
            dismissViewControllerAnimated(true, completion: showRegister)
        } else {
            showRegister()
        }
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
extension EmbeddedModelCallbacks: ARModelInfiniteScrollViewControllerDelegate {
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