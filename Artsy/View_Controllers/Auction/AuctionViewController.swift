import UIKit
import ORStackView
import Then

class AuctionViewController: UIViewController {
    let saleID: String
    var saleViewModel: SaleViewModel!
    var appeared = false

    var headerStack: ORStackView!
    var stickyHeader: ScrollingStickyHeaderView!
    var titleView: AuctionTitleView?

    var allowAnimations = true

    /// Variable for storing lazily-computed default refine settings.
    /// Should not be accessed directly, call defaultRefineSettings() instead.
    private var _defaultRefineSettings: AuctionRefineSettings?

    private var saleArtworksViewController: ARModelInfiniteScrollViewController!
    private var activeModule: ARSaleArtworkItemWidthDependentModule?

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

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        NSNotificationCenter.defaultCenter().removeObserver(self, name: ARAuctionArtworkRegistrationUpdatedNotification, object: nil)
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        guard appeared == false else { return }
        appeared = true

        self.ar_presentIndeterminateLoadingIndicatorAnimated(animated)

        self.networkModel.fetch().next { [weak self] saleViewModel in

            if saleViewModel.liveAuctionHasStarted {
                let liveCV = ARSwitchBoard.sharedInstance().loadLiveAuction(self?.saleID)
                ARTopMenuViewController.sharedController().pushViewController(liveCV, animated: true) {
                    self?.navigationController?.popViewControllerAnimated(false)
                }

            } else if saleViewModel.isUpcomingAndHasNoLots {
                self?.setupForUpcomingSale(saleViewModel)
            } else {
                self?.setupForSale(saleViewModel)
            }

            saleViewModel.registerSaleAsActiveActivity(self)
            }.error { error in
                // TODO: Error-handling somehow
        }

        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(AuctionViewController.registrationUpdated(_:)), name: ARAuctionArtworkRegistrationUpdatedNotification, object: nil)
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)
        userActivity?.invalidate()
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // titleView being nil indicates this is an upcoming sale with no lots, so we shouldn't displayCurrentItems()
        guard saleViewModel != nil && titleView != nil else {
            // We can't set up our current saleArtworksViewController if it has no models.
            return
        }

        displayCurrentItems()
    }

    override func viewWillTransitionToSize(size: CGSize, withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransitionToSize(size, withTransitionCoordinator: coordinator)

        activeModule?.setWidth(size.width - sideSpacing)
    }

    override func shouldAutorotate() -> Bool {
        return traitDependentAutorotateSupport
    }

    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations
    }

    enum ViewTags: Int {
        case Banner = 0, Title

        case WhitespaceGobbler
    }

}

extension AuctionViewController {

    func setupForUpcomingSale(saleViewModel: SaleViewModel) {

        self.saleViewModel = saleViewModel
        let auctionInfoVC = AuctionInformationViewController(saleViewModel: saleViewModel)

        auctionInfoVC.titleViewDelegate = self
        ar_addAlignedModernChildViewController(auctionInfoVC)

        let bannerView = AuctionBannerView(viewModel: saleViewModel)
        bannerView.tag = ViewTags.Banner.rawValue
        auctionInfoVC.scrollView.stackView.insertSubview(bannerView, atIndex: 0, withTopMargin:"0", sideMargin: "0")
    }

    func setupForSale(saleViewModel: SaleViewModel) {

        headerStack = ORTagBasedAutoStackView()
        saleArtworksViewController = ARModelInfiniteScrollViewController()

        ar_addAlignedModernChildViewController(saleArtworksViewController)

        // Disable the vertical offset for status bar.
        automaticallyAdjustsScrollViewInsets = false
        saleArtworksViewController.automaticallyAdjustsScrollViewInsets = false

        saleArtworksViewController.headerStackView = headerStack
        saleArtworksViewController.showTrailingLoadingIndicator = false
        saleArtworksViewController.delegate = self

        self.saleViewModel = saleViewModel

        let bannerView = AuctionBannerView(viewModel: saleViewModel)
        bannerView.tag = ViewTags.Banner.rawValue
        headerStack.addSubview(bannerView, withTopMargin: "0", sideMargin: "0")

        let compactSize = traitCollection.horizontalSizeClass == .Compact
        let topSpacing = compactSize ? 20 : 30
        let sideSpacing = compactSize ? 40 : 80
        let titleView = AuctionTitleView(viewModel: saleViewModel, delegate: self, fullWidth: compactSize, showAdditionalInformation: true)
        titleView.tag = ViewTags.Title.rawValue
        headerStack.addSubview(titleView, withTopMargin: "\(topSpacing)", sideMargin: "\(sideSpacing)")
        self.titleView = titleView

        stickyHeader = ScrollingStickyHeaderView().then {
            $0.toggleAttatched(false, animated:false)
            $0.button.setTitle("Refine", forState: .Normal)
            $0.titleLabel.text = saleViewModel.displayName
            $0.button.addTarget(self, action: #selector(AuctionViewController.showRefineTapped), forControlEvents: .TouchUpInside)
        }

        saleArtworksViewController.stickyHeaderView = stickyHeader
        saleArtworksViewController.invalidateHeaderHeight()

        displayCurrentItems()

        ar_removeIndeterminateLoadingIndicatorAnimated(allowAnimations)
    }

    func defaultRefineSettings() -> AuctionRefineSettings {
        guard let defaultSettings = _defaultRefineSettings else {
            let defaultSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber, priceRange:self.saleViewModel.lowEstimateRange, saleViewModel:saleViewModel)
            _defaultRefineSettings = defaultSettings
            return defaultSettings
        }
        return defaultSettings
    }

    func showRefineTappedAnimated(animated: Bool) {
        let refineViewController = RefinementOptionsViewController(defaultSettings: defaultRefineSettings(),
            initialSettings: refineSettings,
            currencySymbol: saleViewModel.currencySymbol,
            userDidCancelClosure: { (refineVC) in
                self.dismissViewControllerAnimated(animated, completion: nil)},
            userDidApplyClosure: { (settings: AuctionRefineSettings) in
                self.refineSettings = settings

                self.displayCurrentItems()
                self.dismissViewControllerAnimated(animated, completion: nil)
        })

        refineViewController.modalPresentationStyle = .FormSheet
        refineViewController.applyButtonPressedAnalyticsOption = RefinementAnalyticsOption(name: ARAnalyticsTappedApplyRefine, properties: [
            "auction_slug": saleViewModel.saleID,
            "context_type": "sale",
            "slug": NSString(format:"/auction/%@/refine", saleViewModel.saleID)
        ])

        refineViewController.viewDidAppearAnalyticsOption = RefinementAnalyticsOption(name: "Sale Information", properties: [ "context": "auction", "slug": "/auction/\(saleViewModel.saleID)/refine"])
        refineViewController.changeStatusBar = self.traitCollection.horizontalSizeClass == .Compact
        presentViewController(refineViewController, animated: animated, completion: nil)
    }

    func showRefineTapped() {
        self.showRefineTappedAnimated(true)
    }

    var sideSpacing: CGFloat {
        let compactSize = traitCollection.horizontalSizeClass == .Compact
        return compactSize ? 40 : 80
    }

    /// Displays the current items, sorted/filtered through the current refine settings.
    func displayCurrentItems() {
        let items = saleViewModel.refinedSaleArtworks(refineSettings)

        let viewWidth = self.view.bounds.size.width

        let newModule: ARModelCollectionViewModule
        switch refineSettings.ordering.layoutType {
        case .Grid:
            newModule = ARSaleArtworkItemMasonryModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)
        case .List:
            newModule = ARSaleArtworkItemFlowModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)
        }

        saleArtworksViewController.activeModule = newModule
        activeModule = newModule as? ARSaleArtworkItemWidthDependentModule // Conditional cast always succeeds, but the compiler will complain otherwise.

        saleArtworksViewController.items = items
        stickyHeader.subtitleLabel.text = saleViewModel.subtitleForRefineSettings(refineSettings, defaultRefineSettings: defaultRefineSettings())
    }
}

private typealias NotificationCenterObservers = AuctionViewController
extension NotificationCenterObservers {
    func registrationUpdated(notification: NSNotification) {
        networkModel.fetchBidders().next { [weak self] bidders in
            self?.saleViewModel.bidders = bidders
            self?.titleView?.updateRegistrationStatus()
        }
    }
}

private typealias TitleCallbacks = AuctionViewController
extension TitleCallbacks: AuctionTitleViewDelegate {
    func userDidPressInfo(titleView: AuctionTitleView) {
        let auctionInforVC = AuctionInformationViewController(saleViewModel: saleViewModel)
        auctionInforVC.titleViewDelegate = self

        let controller = ARSerifNavigationViewController(rootViewController: auctionInforVC)
        presentViewController(controller, animated: true, completion: nil)
    }

    func userDidPressRegister(titleView: AuctionTitleView) {
        let showRegister = {
            ARTrialController.presentTrialIfNecessaryWithContext(.AuctionRegistration) { created in
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

private typealias EmbeddedModelCallbacks = AuctionViewController
extension EmbeddedModelCallbacks: ARModelInfiniteScrollViewControllerDelegate {
    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, didTapItemAtIndex index: UInt) {
        let artworks = saleArtworksViewController.items.map { Artwork(artworkID: $0.artworkID) }
        let viewController = ARArtworkSetViewController(artworkSet: artworks, atIndex: Int(index))
        navigationController?.pushViewController(viewController, animated: allowAnimations)
    }

    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, shouldPresentViewController viewController: UIViewController!) {
        navigationController?.pushViewController(viewController, animated: true)
    }

    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, stickyHeaderDidChangeStickyness isAttatchedToLeadingEdge: Bool) {
        stickyHeader.stickyHeaderHeight.constant = isAttatchedToLeadingEdge ? 120 : 60
        stickyHeader.toggleAttatched(isAttatchedToLeadingEdge, animated: true)
    }
}
