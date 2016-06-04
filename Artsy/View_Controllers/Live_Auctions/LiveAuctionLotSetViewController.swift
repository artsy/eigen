import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView
import Interstellar
import UICKeyChainStore

class LiveAuctionLotSetViewController: UIViewController {
    let salesPerson: LiveAuctionsSalesPersonType

    let auctionDataSource = LiveAuctionSaleLotsDataSource()
    let progressBar = SimpleProgressView()
    let pageController = UIPageViewController(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: [:])
    let lotImageCollectionView: UICollectionView
    let lotImageCollectionViewDataSource: LiveAuctionLotCollectionViewDataSource
    let lotCollectionViewLayout: LiveAuctionLotCollectionViewLayoutType

    private var hasBeenSetup = false
    private var firstAppearance = true
    private var pageViewScrollView: UIScrollView?
    private let progressBarBottomConstraintAtRestConstant: CGFloat = -165
    private var progressBarBottomConstraint: NSLayoutConstraint?
    private var saleNetworkModel = AuctionSaleNetworkModel()

    init(salesPerson: LiveAuctionsSalesPersonType, traitCollection: UITraitCollection) {
        self.salesPerson = salesPerson

        let dataSource = LiveAuctionLotCollectionViewDataSource(salesPerson: salesPerson)
        lotImageCollectionViewDataSource = dataSource

        let collectionViewLayout: UICollectionViewLayout

        if traitCollection .horizontalSizeClass != .Regular {
            let screenWidthIsLarge = UIScreen.mainScreen().applicationFrame.width > 320
            let size: LiveAuctionFancyLotCollectionViewLayout.Size = screenWidthIsLarge ? .Normal : .Compact

            let layout = LiveAuctionFancyLotCollectionViewLayout(delegate: dataSource, size: size)
            collectionViewLayout = layout
            lotCollectionViewLayout = layout
        } else {
            let layout = LiveAuctionPlainLotCollectionViewLayout(delegate: dataSource)
            collectionViewLayout = layout
            lotCollectionViewLayout = layout
        }

        lotImageCollectionView = UICollectionView(frame: CGRect.zero, collectionViewLayout: collectionViewLayout).then {
            $0.registerClass(LiveAuctionLotCollectionViewDataSource.CellClass, forCellWithReuseIdentifier: LiveAuctionLotCollectionViewDataSource.CellIdentifier)
            $0.dataSource = dataSource
            $0.backgroundColor = .whiteColor()
        }

        super.init(nibName: nil, bundle: nil)
    }


    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // On iPhone, show the sale name, since we're taking up the full screen.
        // Otherwise, on iPad, show nothing (sale name is shown in the lot list).
        if UIScreen.mainScreen().traitCollection.horizontalSizeClass == .Compact {
            title = salesPerson.liveSaleName
        }
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupKeyboardShortcuts()

        // Our view setup.
        view.backgroundColor = .whiteColor()

        // Lot collection view setup.
        view.addSubview(lotImageCollectionView)
        lotImageCollectionView.alignTop("0", leading: "0", bottom: "-288", trailing: "0", toView: view)

        // Page view controller setup.
        ar_addModernChildViewController(pageController)
        pageController.delegate = self

        let pageControllerView = pageController.view
        pageControllerView.alignToView(view)

        // This is a bit of a shame, we need to also make.
        // sure the scrollview resizes on orientation changes.
        if let scrollView = pageController.view.subviews.flatMap({ $0 as? UIScrollView }).first {
            scrollView.alignToView(pageControllerView)
            scrollView.delegate = self
        }

        // Progress bar setup.
        view.addSubview(progressBar)
        progressBar.constrainHeight("4")
        progressBar.alignLeading("0", trailing: "0", toView: view)
        progressBarBottomConstraint = progressBar.alignBottomEdgeWithView(view, predicate: "\(progressBarBottomConstraintAtRestConstant)")

        salesPerson.currentFocusedLotIndex.subscribe { [weak self] _ in
            self?.lotImageCollectionView.reloadData()
        }

        // Final setup for our (now constructed) view hierarchy.
        setupWithInitialData()
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        // TODO: handle changing trait collections, need to re-set the collection view layout.
        setupToolbar()

        guard firstAppearance else { return }
        firstAppearance = true

        // The collection view "rests" at a non-zero index. We need to set it, but doing so immediately is too soon, so we dispatch to the next runloop invocation.
        ar_dispatch_main_queue {
            let initialRect = CGRect(
                x: self.view.frame.width,
                y: 0,
                width: self.lotImageCollectionView.frame.width,
                height: self.lotImageCollectionView.frame.height
            )
            self.lotImageCollectionView.scrollRectToVisible(initialRect, animated: false)
            self.lotImageCollectionView.reloadData()
        }
    }

    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        // Disable page view scrolling on iPad.
        pageViewScrollView?.scrollEnabled = (view.window?.traitCollection.horizontalSizeClass == .Compact)
    }

    func setupToolbar() {
        let close = ARSerifToolbarButtonItem(image: UIImage(named: "serif_modal_close"))
        close.accessibilityLabel = "Exit Live Bidding"
        close.button.addTarget(self, action: #selector(LiveAuctionLotSetViewController.dismissModal), forControlEvents: .TouchUpInside)

        let info = ARSerifToolbarButtonItem(image: UIImage(asset: .Info_icon) )
        info.accessibilityLabel = "More Information"
        info.button.addTarget(self, action: #selector(LiveAuctionLotSetViewController.moreInfo), forControlEvents: .TouchUpInside)
        info.enabled = false
        saleNetworkModel.fetchSale(salesPerson.liveSaleID).subscribe { _ in info.enabled = true }

        let lots = ARSerifToolbarButtonItem(image: UIImage(asset: .Lots_icon))
        lots.accessibilityLabel = "Show all Lots"
        lots.button.addTarget(self, action: #selector(LiveAuctionLotSetViewController.showLots), forControlEvents: .TouchUpInside)

        let phone = traitCollection.userInterfaceIdiom == .Phone
        let items: [UIBarButtonItem] = phone ? [close, lots, info] : [close, info]

        navigationItem.rightBarButtonItems = items
    }

    func setupKeyboardShortcuts() {
        if ARAppStatus.isOSNineOrGreater() {
            if #available(iOS 9.0, *) {

                let previous = UIKeyCommand(input: UIKeyInputLeftArrow, modifierFlags: [], action: #selector(LiveAuctionLotSetViewController.previousLot), discoverabilityTitle: "Previous Lot")
                addKeyCommand(previous)

                let next = UIKeyCommand(input: UIKeyInputRightArrow, modifierFlags: [], action: #selector(LiveAuctionLotSetViewController.nextLot), discoverabilityTitle: "Next Lot")
                addKeyCommand(next)
            }
        }
    }

    func dismissModal() {
        guard let presentor = splitViewController?.presentingViewController else { return }
        presentor.dismissViewControllerAnimated(true, completion: nil)
    }

    func moreInfo() {
        guard let sale = saleNetworkModel.sale else { return }
        let saleVM = SaleViewModel(sale: sale, saleArtworks: [])

        let saleInfoVC = AuctionInformationViewController(saleViewModel: saleVM)
        saleInfoVC.titleViewDelegate = self
        saleInfoVC.registrationStatus = self.salesPerson.bidderStatus
        let nav = ARSerifNavigationViewController(rootViewController: saleInfoVC)
        self.navigationController?.presentViewController(nav, animated: true, completion: nil)
    }

    func showLots() {
        let lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
        lotListController.delegate = self
        lotListController.selectedIndex = salesPerson.currentLotSignal.peek()??.lotIndex

        let navController = ARSerifNavigationViewController(rootViewController: lotListController)
        presentViewController(navController, animated: true, completion: nil)
    }

    func setupWithInitialData() {
        // Make sure we only initialize with initial data once.
        guard hasBeenSetup == false else { return }
        defer { hasBeenSetup = true }

        auctionDataSource.salesPerson = salesPerson
        auctionDataSource.scrollingDelegate = self

        pageController.dataSource = auctionDataSource

        guard let startVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(0) else { return }
        pageController.setViewControllers([startVC], direction: .Forward, animated: false, completion: nil)

        pageViewScrollView = pageController.view.subviews.flatMap({ $0 as? UIScrollView }).first

        salesPerson
            .currentLotSignal
            .merge(salesPerson.auctionViewModel.saleAvailabilitySignal)
            .subscribe { [weak self] (currentLot, saleAvailability) in
                guard let currentLot = currentLot else {
                    self?.progressBar.progress = saleAvailability == .Closed ? 1 : 0
                    return
                }

                let total = self?.salesPerson.auctionViewModel.lotCount ?? 1 // We're dividing by the total, it should not be zero 😬
                self?.progressBar.progress = CGFloat(currentLot.lotIndex) / CGFloat(total)
        }
    }

    func jumpToLotAtIndex(index: Int, animated: Bool) {
        let currentLotVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(index)

        // This logic won't do, lot at index 10 is not classed as being -1 from current index
        // perhaps it needs to see within a wrapping range of 0 to 10, which direction is it less steps
        // to get to my index

//        guard let viewController = pageController.viewControllers?.first as? LiveAuctionLotViewController else { return }
//        let direction: UIPageViewControllerNavigationDirection = viewController.index > index ? .Forward : .Reverse

        salesPerson.currentFocusedLotIndex.update(index)
        lotImageCollectionView.reloadData()
        // TODO: Animations are disabled for now because it's unclear how to reload the collection view. Unlike the UIPVC,
        //       the collection view shows previous and next images, and can't be scrolled to the current lot image without flickering.
        pageController.setViewControllers([currentLotVC!], direction: .Forward, animated: false, completion: nil)
    }

    func jumpToLiveLot() {
        guard let currentLot = salesPerson.currentLotSignal.peek() else { return }
        guard let focusedIndex = currentLot?.lotIndex else { return }

        jumpToLotAtIndex(focusedIndex, animated: true)
    }

    func nextLot() {
        guard let current = pageController.childViewControllers.first else { return }
        guard let nextLotVC = auctionDataSource.pageViewController(pageController, viewControllerAfterViewController: current) else { return }
        pageController.setViewControllers([nextLotVC], direction: .Forward, animated: true, completion: nil)    }

    func previousLot() {
        guard let current = pageController.childViewControllers.first else { return }
        guard let previousLotVC = auctionDataSource.pageViewController(pageController, viewControllerBeforeViewController: current) else { return }
        pageController.setViewControllers([previousLotVC], direction: .Reverse, animated: true, completion: nil)
    }
}

private typealias LotListDelegate = LiveAuctionLotSetViewController
extension LotListDelegate: LiveAuctionLotListViewControllerDelegate {

    func didSelectLotAtIndex(index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController) {
        jumpToLotAtIndex(index, animated: false)
        dismissViewControllerAnimated(true, completion: nil)
    }

}

extension LiveAuctionLotSetViewController: AuctionTitleViewDelegate {
    func userDidPressInfo(titleView: AuctionTitleView) {
        // NO-OP, button for this cannot be seen in this context
    }

    func userDidPressRegister(titleView: AuctionTitleView) {
        ARTrialController.presentTrialIfNecessaryWithContext(.AuctionRegistration) { created in
            let registrationPath = "/auction-registration/\(self.salesPerson.liveSaleID)"
            let viewController = ARSwitchBoard.sharedInstance().loadPath(registrationPath)
            self.presentViewController(viewController, animated: true) {}
        }
    }
}

private typealias HostScrollViewDelegate = LiveAuctionLotSetViewController
extension HostScrollViewDelegate: UIScrollViewDelegate {

    // The idea is to match the page view controller's scrollview's content offset to that of our collection view.
    // The collection view data source mimics the page view controller's three-at-a-time display strategy.
    // Our job here is to keep the two in sync, using their contentOffset.
    // The SalesPerson needs to update the currentFocuedLotIndex to match a change in the page view controller's internal layout.

    // When the user scrolls.
    func scrollViewDidScroll(scrollView: UIScrollView) {
        lotImageCollectionView.setContentOffset(scrollView.contentOffset, animated: false)
    }

    // When we scroll programmatically with/out animation.
    func scrollViewDidEndScrollingAnimation(scrollView: UIScrollView) {
        lotImageCollectionView.setContentOffset(scrollView.contentOffset, animated: false)
    }

    // When the user has released their finger and the scroll view is sliding to a gentle stop.
    func scrollViewDidEndDecelerating(scrollView: UIScrollView) {
        lotImageCollectionView.setContentOffset(scrollView.contentOffset, animated: false)
    }

}

private typealias PageViewDelegate = LiveAuctionLotSetViewController
extension PageViewDelegate: UIPageViewControllerDelegate, LiveAuctionSaleLotsDataSourceScrollableDelgate {
    func pageViewController(pageViewController: UIPageViewController, didFinishAnimating finished: Bool, previousViewControllers: [UIViewController], transitionCompleted completed: Bool) {
        guard let viewController = pageViewController.viewControllers?.first as? LiveAuctionLotViewController else { return }

        // The completed parameter specifies if the user has completed the swipe from one page to the next. We want to
        // ignore when they don't, since it is effectively a cancelled transition.
        if completed {
            print("Updating current focused index to:", viewController.index)
            salesPerson.currentFocusedLotIndex.update(viewController.index)
        }
    }

    func registerForScrollingState(viewController: LiveAuctionLotViewController) {

        viewController.bidHistoryDelta.subscribe { [weak self] update in

            self?.progressBarBottomConstraint?.constant = (self?.progressBarBottomConstraintAtRestConstant ?? 0) + update.delta

            if update.animating {
                self?.lotImageCollectionView.performBatchUpdates({
                    self?.lotCollectionViewLayout.repulsionConstant = abs(update.delta)
                    }, completion: nil)
            } else {
                self?.lotCollectionViewLayout.repulsionConstant = abs(update.delta)
            }

            if update.animating {
                self?.view.layoutIfNeeded()
            }
        }
    }
}
