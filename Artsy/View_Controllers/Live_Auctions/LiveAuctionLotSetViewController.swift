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

    var pageController: UIPageViewController!
    var hasBeenSetup = false

    init(salesPerson: LiveAuctionsSalesPersonType) {

        self.salesPerson = salesPerson
        super.init(nibName: nil, bundle: nil)
        self.title = salesPerson.liveSaleID;
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupKeyboardShortcuts()

        view.backgroundColor = .whiteColor()

        pageController = UIPageViewController(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: [:])
        ar_addModernChildViewController(pageController)
        pageController.delegate = salesPerson.pageControllerDelegate

        let pageControllerView = pageController.view
        pageControllerView.alignToView(view)

        // This is a bit of a shame, we need to also make 
        // sure the scrollview resizes on orientation changes
        
        if let scrollView = pageController.view.subviews.filter({ $0.isKindOfClass(UIScrollView.self) }).first as? UIScrollView {
            scrollView.alignToView(pageControllerView)
        }

        let progress = SimpleProgressView()
        progress.progress = 0.6
        progress.backgroundColor = .artsyGrayRegular()

        view.addSubview(progress)
        progress.constrainHeight("4")
        progress.alignLeading("0", trailing: "0", toView: view)
        progress.alignBottomEdgeWithView(view, predicate: "-165")

        salesPerson.updatedStateSignal.subscribe { [weak self] _ in
            self?.setupWithInitialData()
        }
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        setupToolbar()
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
        AuctionSaleNetworkModel().fetchSale(salesPerson.liveSaleID).subscribe { result in
            guard let saleInfo = result.value else { return }

            let saleVM = SaleViewModel(sale: saleInfo, saleArtworks: [])
            let saleInfoVC = AuctionInformationViewController(saleViewModel: saleVM)
            self.navigationController?.pushViewController(saleInfoVC, animated: true)
        }
    }

    func showLots() {
        let lotListController = LiveAuctionLotListViewController(lots: salesPerson.lots, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
        lotListController.delegate = self
        lotListController.selectedIndex = currentIndex()
        presentViewController(lotListController, animated: true, completion: nil)
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
        let focusedIndex = salesPerson.currentLotSignal.peek()?.lotIndex ?? 0
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

class LiveAuctionSaleLotsDataSource : NSObject, UIPageViewControllerDataSource {
    var salesPerson: LiveAuctionsSalesPersonType!

    func liveAuctionPreviewViewControllerForIndex(index: Int) -> LiveAuctionLotViewController? {
        guard let lotViewModel = salesPerson.lotViewModelForIndex(index) else { return nil }

        let auctionVC =  LiveAuctionLotViewController(index: index, auctionViewModel: salesPerson.auctionViewModel, lotViewModel: lotViewModel, currentLotSignal: salesPerson.currentLotSignal)
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
