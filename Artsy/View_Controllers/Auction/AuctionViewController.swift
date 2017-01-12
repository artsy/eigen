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

    fileprivate var showLiveInterfaceWhenAuctionOpensTimer: Timer?

    /// Variable for storing lazily-computed default refine settings.
    /// Should not be accessed directly, call defaultRefineSettings() instead.
    fileprivate var _defaultRefineSettings: AuctionRefineSettings?

    fileprivate var saleArtworksViewController: ARModelInfiniteScrollViewController!
    fileprivate var activeModule: ARSaleArtworkItemWidthDependentModule?

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
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.ARAuctionArtworkRegistrationUpdated, object: nil)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        guard appeared == false else { return }
        appeared = true

        self.ar_presentIndeterminateLoadingIndicator(animated: animated)

        self.networkModel.fetch().next { [weak self] saleViewModel in

            if saleViewModel.shouldShowLiveInterface {
                self?.setupLiveInterfaceAndPop()
            } else if saleViewModel.isUpcomingAndHasNoLots {
                self?.setupForUpcomingSale(saleViewModel)
            } else {
                self?.setupForSale(saleViewModel)
            }

            if let timeToLiveStart = saleViewModel.timeToLiveStart {
                self?.setupForUpcomingLiveInterface(timeToLiveStart)

            }

            saleViewModel.registerSaleAsActiveActivity(self)
            }.error { error in
                // TODO: Error-handling somehow
        }

        NotificationCenter.default.addObserver(self, selector: #selector(AuctionViewController.registrationUpdated(_:)), name: NSNotification.Name.ARAuctionArtworkRegistrationUpdated, object: nil)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        userActivity?.invalidate()
        showLiveInterfaceWhenAuctionOpensTimer?.invalidate()
    }

    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // titleView being nil indicates this is an upcoming sale with no lots, so we shouldn't displayCurrentItems()
        guard saleViewModel != nil && titleView != nil else {
            // We can't set up our current saleArtworksViewController if it has no models.
            return
        }

        displayCurrentItems()
    }

    override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransition(to: size, with: coordinator)

        activeModule?.setWidth(size.width - sideSpacing)
    }

    override var shouldAutorotate : Bool {
        return traitDependentAutorotateSupport
    }

    override var supportedInterfaceOrientations : UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations
    }

    enum ViewTags: Int {
        case banner = 0, title

        case whitespaceGobbler
    }

}

extension AuctionViewController {

    func setupForUpcomingSale(_ saleViewModel: SaleViewModel) {

        self.saleViewModel = saleViewModel
        let auctionInfoVC = AuctionInformationViewController(saleViewModel: saleViewModel)

        auctionInfoVC.titleViewDelegate = self
        ar_addAlignedModernChildViewController(auctionInfoVC)

        let bannerView = AuctionBannerView(viewModel: saleViewModel)
        bannerView.tag = ViewTags.banner.rawValue
        auctionInfoVC.scrollView.stackView.insertSubview(bannerView, at: 0, withTopMargin:"0", sideMargin: "0")
    }

    func setupForSale(_ saleViewModel: SaleViewModel) {

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
        bannerView.tag = ViewTags.banner.rawValue
        headerStack.addSubview(bannerView, withTopMargin: "0", sideMargin: "0")

        let compactSize = traitCollection.horizontalSizeClass == .compact
        let topSpacing = compactSize ? 20 : 30
        let sideSpacing = compactSize ? 40 : 80
        let titleView = AuctionTitleView(viewModel: saleViewModel, delegate: self, fullWidth: compactSize, showAdditionalInformation: true)
        titleView.tag = ViewTags.title.rawValue
        headerStack.addSubview(titleView, withTopMargin: "\(topSpacing)", sideMargin: "\(sideSpacing)")
        self.titleView = titleView

        stickyHeader = ScrollingStickyHeaderView().then {
            $0.toggleAttatched(false, animated: false)
            $0.button.setTitle("Refine", for: .normal)
            $0.titleLabel.text = saleViewModel.displayName
            $0.button.addTarget(self, action: #selector(AuctionViewController.showRefineTapped), for: .touchUpInside)
        }

        saleArtworksViewController.stickyHeaderView = stickyHeader
        saleArtworksViewController.invalidateHeaderHeight()

        displayCurrentItems()

        ar_removeIndeterminateLoadingIndicator(animated: allowAnimations)
    }

    func setupForUpcomingLiveInterface(_ timeToLiveStart: TimeInterval) {
        self.showLiveInterfaceWhenAuctionOpensTimer = Timer.scheduledTimer(timeInterval: timeToLiveStart, target: self, selector: #selector(AuctionViewController.setupLiveInterfaceAndPop), userInfo: nil, repeats: false)
    }

    func setupLiveInterfaceAndPop() {
        let liveCV = ARSwitchBoard.sharedInstance().loadLiveAuction(saleID)

        ARTopMenuViewController.shared().push(liveCV!, animated: true) {
            self.navigationController?.popViewController(animated: false)
        }
    }

    func defaultRefineSettings() -> AuctionRefineSettings {
        guard let defaultSettings = _defaultRefineSettings else {
            let defaultSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber, priceRange:self.saleViewModel.lowEstimateRange, saleViewModel:saleViewModel)
            _defaultRefineSettings = defaultSettings
            return defaultSettings
        }
        return defaultSettings
    }

    func showRefineTappedAnimated(_ animated: Bool) {
        let refineViewController = RefinementOptionsViewController(defaultSettings: defaultRefineSettings(),
            initialSettings: refineSettings,
            currencySymbol: saleViewModel.currencySymbol,
            userDidCancelClosure: { (refineVC) in
                self.dismiss(animated: animated, completion: nil)},
            userDidApplyClosure: { (settings: AuctionRefineSettings) in
                self.refineSettings = settings

                self.displayCurrentItems()
                self.dismiss(animated: animated, completion: nil)
        })

        refineViewController.modalPresentationStyle = .formSheet
        refineViewController.applyButtonPressedAnalyticsOption = RefinementAnalyticsOption(name: ARAnalyticsTappedApplyRefine, properties: [
            "auction_slug" as NSObject: saleViewModel.saleID,
            "context_type" as NSObject: "sale" as AnyObject,
            "slug" as NSObject: NSString(format:"/auction/%@/refine", saleViewModel.saleID)
        ])

        refineViewController.viewDidAppearAnalyticsOption = RefinementAnalyticsOption(name: "Sale Information", properties: [ "context" as NSObject: "auction" as AnyObject, "slug" as NSObject: "/auction/\(saleViewModel.saleID)/refine" as AnyObject])
        refineViewController.changeStatusBar = self.traitCollection.horizontalSizeClass == .compact
        present(refineViewController, animated: animated, completion: nil)
    }

    func showRefineTapped() {
        self.showRefineTappedAnimated(true)
    }

    var sideSpacing: CGFloat {
        let compactSize = traitCollection.horizontalSizeClass == .compact
        return compactSize ? 40 : 80
    }

    /// Displays the current items, sorted/filtered through the current refine settings.
    func displayCurrentItems() {
        let items = saleViewModel.refinedSaleArtworks(refineSettings)

        let viewWidth = self.view.bounds.size.width

        let newModule: ARModelCollectionViewModule
        switch refineSettings.ordering.layoutType {
        case .grid:
            newModule = ARSaleArtworkItemMasonryModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)
        case .list:
            newModule = ARSaleArtworkItemFlowModule(traitCollection: traitCollection, width: viewWidth - sideSpacing)
        }

        saleArtworksViewController.activeModule = newModule
        activeModule = newModule as? ARSaleArtworkItemWidthDependentModule // Conditional cast always succeeds, but the compiler will complain otherwise.

        saleArtworksViewController.items = items
        stickyHeader.subtitleLabel.text = saleViewModel.subtitleForRefineSettings(refineSettings, defaultRefineSettings: defaultRefineSettings())
    }
}

fileprivate typealias NotificationCenterObservers = AuctionViewController
extension NotificationCenterObservers {
    func registrationUpdated(_ notification: Notification) {
        networkModel.fetchBidders().next { [weak self] bidders in
            self?.saleViewModel.bidders = bidders
            self?.titleView?.updateRegistrationStatus()
        }
    }
}

fileprivate typealias TitleCallbacks = AuctionViewController
extension TitleCallbacks: AuctionTitleViewDelegate {
    func userDidPressInfo(_ titleView: AuctionTitleView) {
        let auctionInforVC = AuctionInformationViewController(saleViewModel: saleViewModel)
        auctionInforVC.titleViewDelegate = self

        let controller = ARSerifNavigationViewController(rootViewController: auctionInforVC)
        present(controller, animated: true, completion: nil)
    }

    func userDidPressRegister(_ titleView: AuctionTitleView) {
        let showRegister = {
            let registrationPath = "/auction-registration/\(self.saleID)"
            let viewController = ARSwitchBoard.sharedInstance().loadPath(registrationPath)
            self.navigationController?.pushViewController(viewController, animated: true)
        }
        if let _ = presentedViewController {
            dismiss(animated: true, completion: showRegister)
        } else {
            showRegister()
        }
    }
}

fileprivate typealias EmbeddedModelCallbacks = AuctionViewController
extension EmbeddedModelCallbacks: ARModelInfiniteScrollViewControllerDelegate {
    func embeddedModelsViewController(_ controller: AREmbeddedModelsViewController!, didTapItemAt index: UInt) {
        let artworks = saleArtworksViewController.items.map { Artwork(artworkID: $0.artworkID) }
        let viewController = ARArtworkSetViewController(artworkSet: artworks, at: Int(index))
        navigationController?.pushViewController(viewController!, animated: allowAnimations)
    }

    func embeddedModelsViewController(_ controller: AREmbeddedModelsViewController!, shouldPresent viewController: UIViewController!) {
        navigationController?.pushViewController(viewController, animated: true)
    }

    func embeddedModelsViewController(_ controller: AREmbeddedModelsViewController!, stickyHeaderDidChangeStickyness isAttatchedToLeadingEdge: Bool) {
        stickyHeader.stickyHeaderHeight.constant = isAttatchedToLeadingEdge ? 120 : 60
        stickyHeader.toggleAttatched(isAttatchedToLeadingEdge, animated: true)
    }
}
