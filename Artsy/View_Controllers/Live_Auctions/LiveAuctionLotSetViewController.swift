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
    let lotImageCollectionView: UICollectionView?
    let lotImageCollectionViewDataSource: LiveAuctionLotCollectionViewDataSource?
    let lotCollectionViewLayout: LiveAuctionFancyLotCollectionViewLayout?

    var hasBeenSetup = false
    var firstAppearance = true

    init(salesPerson: LiveAuctionsSalesPersonType, traitCollection: UITraitCollection) {
        self.salesPerson = salesPerson

        if traitCollection .horizontalSizeClass != .Regular {
            let dataSource = LiveAuctionLotCollectionViewDataSource(salesPerson: salesPerson)
            lotImageCollectionViewDataSource = dataSource
            let layout = LiveAuctionFancyLotCollectionViewLayout(delegate: dataSource)
            lotCollectionViewLayout = layout

            let collectionView = UICollectionView(frame: CGRect.zero, collectionViewLayout: layout).then {
                $0.registerClass(LiveAuctionLotCollectionViewDataSource.CellClass, forCellWithReuseIdentifier: LiveAuctionLotCollectionViewDataSource.CellIdentifier)
                $0.dataSource = dataSource
                $0.backgroundColor = .whiteColor()
            }
            lotImageCollectionView = collectionView
        } else {
            lotImageCollectionViewDataSource = nil
            lotCollectionViewLayout = nil
            lotImageCollectionView = nil
        }

        super.init(nibName: nil, bundle: nil)

        self.title = salesPerson.liveSaleID;
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
        lotImageCollectionView?.then {
            view.addSubview($0)
            $0.alignTop("0", leading: "0", bottom: "-288", trailing: "0", toView: view) // TODO: Figure this out huh?
        }

        // Page view controller setup.
        ar_addModernChildViewController(pageController)
        pageController.delegate = salesPerson.pageControllerDelegate

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
        progressBar.alignBottomEdgeWithView(view, predicate: "-165")

        salesPerson.currentFocusedLotIndex.subscribe { [weak self] _ in
            self?.lotImageCollectionView?.reloadData()
        }

        // Final setup for our (now constructed) view hierarchy.
        setupWithInitialData()
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        // TODO: hand changing trait collections.
        setupToolbar()
        lotCollectionViewLayout?.updateScreenWidth(CGRectGetWidth(view.frame))

        guard firstAppearance else { return }
        firstAppearance = true

        // The collection view "rests" at a non-zero index. We need to set it, but doing so immediately is too soon, so we dispatch to the next runloop invocation.
        ar_dispatch_main_queue {
            guard let lotImageCollectionView = self.lotImageCollectionView else { return }
            let initialRect = CGRect(
                x: CGRectGetWidth(self.view.frame),
                y: 0,
                width: CGRectGetWidth(lotImageCollectionView.frame),
                height: CGRectGetHeight(lotImageCollectionView.frame)
            )
            lotImageCollectionView.scrollRectToVisible(initialRect, animated: false)
            lotImageCollectionView.reloadData()
        }
    }

    func setupToolbar() {
        let close = ARSerifToolbarButtonItem(image: UIImage(asset: .Close_icon) )
        close.accessibilityLabel = "Exit Live Bidding"
        close.button.addTarget(self, action: #selector(LiveAuctionLotSetViewController.dismissModal), forControlEvents: .TouchUpInside)

        let info = ARSerifToolbarButtonItem(image: UIImage(asset: .Info_icon) )
        info.accessibilityLabel = "More Information"
        info.button.addTarget(self, action: #selector(LiveAuctionLotSetViewController.moreInfo), forControlEvents: .TouchUpInside)

        let lots = ARSerifToolbarButtonItem(image: UIImage(asset: .Lots_icon))
        lots.accessibilityLabel = "Show all Lots"
        lots.button.addTarget(self, action: #selector(LiveAuctionLotSetViewController.showLots), forControlEvents: .TouchUpInside)

        let phone = traitCollection.userInterfaceIdiom == .Phone
        let items:[UIBarButtonItem] = phone ? [close, lots, info] : [close, info]

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
        // TODO: The AuctionSaleNetworkModel probably has the Sale already fetched and cached, we should have a fetchSaleOrMostRecentSale() or something similar.
        AuctionSaleNetworkModel().fetchSale(salesPerson.liveSaleID).subscribe { result in
            guard let saleInfo = result.value else { return }

            let saleVM = SaleViewModel(sale: saleInfo, saleArtworks: [])
            let saleInfoVC = AuctionInformationViewController(saleViewModel: saleVM)
            saleInfoVC.titleViewDelegate = self
            saleInfoVC.registrationStatus = self.salesPerson.bidderStatus
            self.navigationController?.pushViewController(saleInfoVC, animated: true)
        }
    }

    func showLots() {
        let lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
        lotListController.delegate = self
        lotListController.selectedIndex = currentIndex()
        let navController = ARSerifNavigationViewController(rootViewController: lotListController)
        presentViewController(navController, animated: true, completion: nil)
    }

    func currentIndex() -> Int {
        guard let current = pageController.childViewControllers.first as? LiveAuctionLotViewController else { return -1 }
        return current.index
    }

    func setupWithInitialData() {
        // Make sure we only initialize with initial data once.
        guard hasBeenSetup == false else { return }
        defer { hasBeenSetup = true }

        auctionDataSource.salesPerson = salesPerson

        pageController.dataSource = auctionDataSource

        guard let startVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(0) else { return }
        pageController.setViewControllers([startVC], direction: .Forward, animated: false, completion: nil)


        salesPerson
            .currentLotSignal
            .merge(salesPerson.auctionViewModel.saleAvailabilitySignal)
            .subscribe { [weak self] (currentLot, saleAvailability) in
                guard let currentLot = currentLot else {
                    // We don't have a current lot, so set the progress to one if the sale is closed and zero otherwise.
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

        let direction = UIPageViewControllerNavigationDirection.Forward
        pageController.setViewControllers([currentLotVC!], direction: direction, animated: animated, completion: nil)
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
        lotImageCollectionView?.setContentOffset(scrollView.contentOffset, animated: false)
    }

    // When we scroll programmatically with/out animation.
    func scrollViewDidEndScrollingAnimation(scrollView: UIScrollView) {
        lotImageCollectionView?.setContentOffset(scrollView.contentOffset, animated: false)
    }

    // When the user has released their finger and the scroll view is sliding to a gentle stop.
    func scrollViewDidEndDecelerating(scrollView: UIScrollView) {
        lotImageCollectionView?.setContentOffset(scrollView.contentOffset, animated: false)
    }

}

class LiveAuctionSaleLotsDataSource : NSObject, UIPageViewControllerDataSource {
    var salesPerson: LiveAuctionsSalesPersonType!

    func liveAuctionPreviewViewControllerForIndex(index: Int) -> LiveAuctionLotViewController? {
        guard 0..<salesPerson.lotCount ~= index else { return nil }
        let lotViewModel = salesPerson.lotViewModelForIndex(index)

        let auctionVC =  LiveAuctionLotViewController(
            index: index,
            lotViewModel: lotViewModel,
            salesPerson: salesPerson
        )
        return auctionVC
    }

    func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionLotViewController else { return nil }
        var newIndex = viewController.index - 1
        if (newIndex < 0) { newIndex = salesPerson.lotCount - 1 }
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }

    func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionLotViewController else { return nil }
        let newIndex = (viewController.index + 1) % salesPerson.lotCount;
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }
}
