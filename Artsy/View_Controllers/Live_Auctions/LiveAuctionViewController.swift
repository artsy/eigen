import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView
import Interstellar
import UICKeyChainStore

class LiveAuctionViewController: UIViewController {
    let saleID: String

    let auctionDataSource = LiveAuctionSaleLotsDataSource()

    lazy var salesPerson: LiveAuctionsSalesPersonType = {
        // TODO: Very brittle! Assumes user is logged in. Prediction doesn't have guest support yet.
        let accessToken = UICKeyChainStore.stringForKey(AROAuthTokenDefault) ?? ""
        return LiveAuctionsSalesPerson(saleID: self.saleID, accessToken: accessToken)
    }()

    var pageController: UIPageViewController!
    var hasBeenSetup = false

    init(saleID: String) {
        self.saleID = saleID
        super.init(nibName: nil, bundle: nil)
        self.title = saleID;
    }

    // Required by Swift compiler, for now.
    required init?(coder aDecoder: NSCoder) {
        self.saleID = ""
        super.init(coder: aDecoder)
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupToolbar()
        setupKeyboardShortcuts()

        view.backgroundColor = .whiteColor()

        pageController = UIPageViewController(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: [:])
        ar_addModernChildViewController(pageController)
        pageController.delegate = salesPerson.pageControllerDelegate

        let pageControllerView = pageController.view
        pageControllerView.alignTopEdgeWithView(view, predicate: "0")
        pageControllerView.alignLeadingEdgeWithView(view, predicate: "0")
        pageControllerView.alignTrailingEdgeWithView(view, predicate: "0")
        pageControllerView.alignBottomEdgeWithView(view, predicate: "0")



        let progress = SimpleProgressView()
        progress.progress = 0.6
        progress.backgroundColor = .artsyGrayRegular()

        view.addSubview(progress)
        progress.constrainHeight("4")
        progress.alignLeading("0", trailing: "0", toView: view)
        progress.alignBottomEdgeWithView(view, predicate: "-165")

        salesPerson.updatedState.next { [weak self] _ in
            self?.setupWithInitialData()
        }
    }

    func setupToolbar() {
        func image(name: String) -> UIImage {
            let bundle = NSBundle(forClass: self.dynamicType)
            return UIImage(named: name, inBundle: bundle, compatibleWithTraitCollection: nil)!
        }

        let close = ARSerifToolbarButtonItem(image: image("Close_Icon"))
        close.accessibilityLabel = "Exit Live Bidding"
        close.button.addTarget(self, action: #selector(LiveAuctionViewController.dismissModal), forControlEvents: .TouchUpInside)

        let info = ARSerifToolbarButtonItem(image: image("info_icon"))
        info.accessibilityLabel = "More Information"
        info.button.addTarget(self, action: #selector(LiveAuctionViewController.moreInfo), forControlEvents: .TouchUpInside)

        let lots = ARSerifToolbarButtonItem(image: image("lots_icon"))
        lots.accessibilityLabel = "Show all Lots"
        lots.button.addTarget(self, action: #selector(LiveAuctionViewController.showLots), forControlEvents: .TouchUpInside)

        navigationItem.rightBarButtonItems = [close, lots, info]
    }

    func setupKeyboardShortcuts() {
        if ARAppStatus.isOSNineOrGreater() {
            if #available(iOS 9.0, *) {

                let previous = UIKeyCommand(input: UIKeyInputLeftArrow, modifierFlags: [], action: #selector(LiveAuctionViewController.previousLot), discoverabilityTitle: "Previous Lot")
                addKeyCommand(previous)

                let next = UIKeyCommand(input: UIKeyInputRightArrow, modifierFlags: [], action: #selector(LiveAuctionViewController.nextLot), discoverabilityTitle: "Next Lot")
                addKeyCommand(next)
            }
        }
    }

    func dismissModal() {
        guard let presentor = navigationController?.presentingViewController else { return }
        presentor.dismissViewControllerAnimated(true, completion: nil)
    }

    func moreInfo() {
        AuctionSaleNetworkModel().fetchSale(saleID) { result in
            guard let saleInfo = result.value else { return }

            let saleVM = SaleViewModel(sale: saleInfo, saleArtworks: [])
            let saleInfoVC = AuctionInformationViewController(saleViewModel: saleVM)
            self.navigationController?.pushViewController(saleInfoVC, animated: true)
        }
    }

    func showLots() {
        
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

    func jumpToLiveLot() {
        let index = salesPerson.currentIndexSignal.peek()!
        let currentLotVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(index)

        // This logic won't do, lot at index 10 is not classed as being -1 from current index
        // perhaps it needs to see within a wrapping range of 0 to 10, which direction is it less steps
        // to get to my index

//        guard let viewController = pageController.viewControllers?.first as? LiveAuctionLotViewController else { return }
//        let direction: UIPageViewControllerNavigationDirection = viewController.index > index ? .Forward : .Reverse

        let direction = UIPageViewControllerNavigationDirection.Forward
        pageController.setViewControllers([currentLotVC!], direction: direction, animated: true, completion: nil)
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


    // Support for ARMenuAwareViewController

    let hidesBackButton = true
    let hidesSearchButton = true
    let hidesStatusBarBackground = true
}

class LiveAuctionSaleLotsDataSource : NSObject, UIPageViewControllerDataSource {
    var salesPerson: LiveAuctionsSalesPersonType!

    func liveAuctionPreviewViewControllerForIndex(index: Int) -> LiveAuctionLotViewController? {
        let auctionVC =  LiveAuctionLotViewController()
        guard let viewModel = salesPerson.lotViewModelForIndex(index) else { return nil }
        auctionVC.lotViewModel.update(viewModel)
        // TODO: Figure how to update the auctionVC's auctionViewModel signal in a better way.
        if let auctionViewModel = salesPerson.auctionViewModel {
            auctionVC.auctionViewModel.update(auctionViewModel)
        }
        auctionVC.index = index
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

class LiveAuctionHistoryCell: UITableViewCell {

    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: .Value1, reuseIdentifier: reuseIdentifier)
        backgroundColor = .whiteColor()
        drawBottomDottedBorder()

        textLabel?.font = .sansSerifFontWithSize(14)
        detailTextLabel?.font = .sansSerifFontWithSize(14)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func updateWithEventViewModel(event: LiveAuctionEventViewModel) {
        self.textLabel?.attributedText = event.eventTitle
        self.detailTextLabel?.attributedText = event.eventSubtitle
    }
}

class LiveAuctionBidHistoryViewController: UITableViewController {

    var lotViewModel: LiveAuctionLotViewModel? {
        didSet {
            tableView.reloadData()
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.registerClass(LiveAuctionHistoryCell.self, forCellReuseIdentifier: "live")
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return lotViewModel?.events.count ?? 0
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        return tableView.dequeueReusableCellWithIdentifier("live")!
    }

    override func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        guard let lotViewModel = lotViewModel else { return }
        guard let cell = cell as? LiveAuctionHistoryCell else { return }

        let event = lotViewModel.events[indexPath.row]
        cell.updateWithEventViewModel(event)
    }
}

class LiveAuctionLotViewController: UIViewController {
    var index = 0
    let lotViewModel = Signal<LiveAuctionLotViewModel>()
    let auctionViewModel = Signal<LiveAuctionViewModel>()

    override func viewDidLoad() {
        super.viewDidLoad()

        let lotPreviewView = UIImageView()
        lotPreviewView.contentMode = .ScaleAspectFit
        view.addSubview(lotPreviewView)
        lotPreviewView.alignTopEdgeWithView(view, predicate: "20")
        lotPreviewView.constrainWidthToView(view, predicate: "-80")
        lotPreviewView.alignCenterXWithView(view, predicate: "0")

        let metadataStack = ORStackView()
        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.alignBottomEdgeWithView(view, predicate: "0")
        metadataStack.constrainWidthToView(view, predicate: "-40")
        metadataStack.alignCenterXWithView(view, predicate: "0")
        lotPreviewView.constrainBottomSpaceToView(metadataStack, predicate: "-20")

        let artistNameLabel = UILabel()
        artistNameLabel.font = UIFont.serifSemiBoldFontWithSize(16)
        metadataStack.addSubview(artistNameLabel, withTopMargin: "0", sideMargin: "20")

        let artworkNameLabel = ARArtworkTitleLabel()
        artworkNameLabel.setTitle("That work", date: "2006")
        metadataStack.addSubview(artworkNameLabel, withTopMargin: "0", sideMargin: "20")

        let estimateLabel = ARSerifLabel()
        estimateLabel.font = UIFont.serifFontWithSize(14)
        estimateLabel.text = "Estimate: $100,000–120,000 USD"
        metadataStack.addSubview(estimateLabel, withTopMargin: "2", sideMargin: "20")

        let premiumLabel = ARSerifLabel()
        premiumLabel.font = UIFont.serifFontWithSize(14)
        premiumLabel.text = "Buyer’s Premium 25%"
        premiumLabel.alpha = 0.3
        metadataStack.addSubview(premiumLabel, withTopMargin: "2", sideMargin: "20")

        let infoToolbar = LiveAuctionToolbarView()
        metadataStack.addSubview(infoToolbar, withTopMargin: "40", sideMargin: "20")
        infoToolbar.constrainHeight("14")

        let bidButton = ARBlackFlatButton()
        metadataStack.addSubview(bidButton, withTopMargin: "14", sideMargin: "20")

        let bidHistoryViewController =  LiveAuctionBidHistoryViewController(style: .Plain)
        metadataStack.addViewController(bidHistoryViewController, toParent: self, withTopMargin: "10", sideMargin: "20")
        bidHistoryViewController.view.constrainHeight("70")

        let currentLotView = LiveAuctionCurrentLotView()
        currentLotView.addTarget(nil, action: #selector(LiveAuctionViewController.jumpToLiveLot), forControlEvents: .TouchUpInside)
        view.addSubview(currentLotView)
        currentLotView.alignBottom("-5", trailing: "-5", toView: view)
        currentLotView.alignLeadingEdgeWithView(view, predicate: "5")

        // might be a way to "bind" these?
        auctionViewModel.next { auctionViewModel in
            if let currentLot = auctionViewModel.currentLotViewModel {
                currentLotView.viewModel.update(currentLot)
            }

            if auctionViewModel.saleAvailability == .Closed {
                currentLotView.removeFromSuperview()
            }
        }

        lotViewModel.next { vm in
            artistNameLabel.text = vm.lotArtist
            artworkNameLabel.setTitle(vm.lotName, date: "1985")
            estimateLabel.text = vm.estimateString
            infoToolbar.lotVM = vm
            // TODO: Finish this
//            infoToolbar.auctionViewModel = 
            // TODO: Uncomment
//            bidButton.setTitle(vm.bidButtonTitle, forState: .Normal)
            lotPreviewView.ar_setImageWithURL(vm.urlForThumbnail)

            // TODO: Finish
//            switch vm.lotState {
//            case .ClosedLot:
//                bidButton.setEnabled(false, animated: false)
//                bidHistoryViewController.lotViewModel = vm
//
//            case .LiveLot:
//                // We don't need this when it's the current lot
//                currentLotView.removeFromSuperview()
//                bidHistoryViewController.lotViewModel = vm
//
//            case .UpcomingLot(_):
//                // Not sure this should stay this way, but things will have to change once we support dragging up the bid history anyway
//                bidHistoryViewController.view.hidden = true
//            }
        }
    }
}

class LiveAuctionCurrentLotView: UIButton {

    let viewModel = Signal<LiveAuctionLotViewModel>()

    override init(frame: CGRect) {
        super.init(frame: frame)

        backgroundColor = .artsyPurpleRegular()

        let liveLotLabel = ARSansSerifLabel()
        liveLotLabel.font = .sansSerifFontWithSize(12)
        liveLotLabel.text = "Live Lot"

        let artistNameLabel = UILabel()
        artistNameLabel.font = .serifSemiBoldFontWithSize(16)

        let biddingPriceLabel = ARSansSerifLabel()
        biddingPriceLabel.font = .sansSerifFontWithSize(16)

        let hammerView = UIImageView(image: UIImage(named:"lot_bidder_hammer_white"))
        let thumbnailView = UIImageView(frame: CGRect(x: 0, y: 0, width: 40, height: 40))

        [liveLotLabel, artistNameLabel, biddingPriceLabel, thumbnailView, hammerView].forEach { addSubview($0) }
        [liveLotLabel, artistNameLabel, biddingPriceLabel].forEach {
            $0.backgroundColor = backgroundColor
            $0.textColor = .whiteColor()
        }

        constrainHeight("54")

        // Left Side

        thumbnailView.alignLeadingEdgeWithView(self, predicate: "10")
        thumbnailView.constrainWidth("38", height: "38")
        thumbnailView.alignCenterYWithView(self, predicate: "0")

        liveLotLabel.constrainLeadingSpaceToView(thumbnailView, predicate: "10")
        liveLotLabel.alignTopEdgeWithView(self, predicate: "10")

        artistNameLabel.constrainLeadingSpaceToView(thumbnailView, predicate: "10")
        artistNameLabel.alignBottomEdgeWithView(self, predicate: "-10")

        // Right side

        hammerView.alignTrailingEdgeWithView(self, predicate: "-10")
        hammerView.constrainWidth("32", height: "32")
        hammerView.alignCenterYWithView(self, predicate: "0")

        biddingPriceLabel.alignAttribute(.Trailing, toAttribute: .Leading, ofView: hammerView, predicate: "-12")
        biddingPriceLabel.alignCenterYWithView(self, predicate: "0")

        viewModel.next { vm in
            artistNameLabel.text = vm.lotArtist
            biddingPriceLabel.text = vm.currentLotValue
            thumbnailView.ar_setImageWithURL(vm.urlForThumbnail)
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

class LiveAuctionToolbarView : UIView {
    // eh, not sold on this yet
    var lotVM: LiveAuctionLotViewModel!
    var auctionViewModel: LiveAuctionViewModel!

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // Remove all subviews and call setupViews() again to start from scratch.
        subviews.forEach { $0.removeFromSuperview() }
        setupViews()
    }

    func lotCountString() -> NSAttributedString {
        return NSAttributedString(string: "\(lotVM.lotIndex)/\(auctionViewModel.lotCount)")
    }

    func attributify(string: String) -> NSAttributedString {
        return NSAttributedString(string: string)
    }

    func setupViews() {
        let viewStructure: [[String: NSAttributedString]]
        let clockClosure: (UILabel) -> ()

        switch lotVM.lotStateWithViewModel(auctionViewModel) {
        case .ClosedLot:
            viewStructure = [
                ["lot": lotCountString()],
                ["time": attributify("Closed")],
                ["bidders": attributify("11")],
                ["watchers": attributify("09")]
            ]
            clockClosure = { label in
                // do timer
                label.text = "00:12"
            }

        case .LiveLot:
            viewStructure = [
                ["lot": lotCountString()],
                ["time": attributify("00:12")],
                ["bidders": attributify("11")],
                ["watchers": attributify("09")]
            ]
            clockClosure = { label in
                // do timer
                label.text = "00:12"
            }

        case let .UpcomingLot(distance):
            viewStructure = [
                ["lot": lotCountString()],
                ["time": attributify("")],
                ["watchers": attributify("09")]
            ]

            clockClosure = { label in
                label.text = "\(distance) lots away"
            }
        }

        let views:[UIView] = viewStructure.map { dict in
            let key = dict.keys.first!
            let thumbnail = UIImage(named: "lot_\(key)_info")

            let view = UIView()
            let thumbnailView = UIImageView(image: thumbnail)
            view.addSubview(thumbnailView)

            let label = ARSansSerifLabel()
            label.font = UIFont.sansSerifFontWithSize(12)
            view.addSubview(label)
            if key == "time" {
                clockClosure(label)
            } else {
                label.attributedText = dict.values.first!
            }

            view.constrainHeight("14")
            thumbnailView.alignTop("0", leading: "0", toView: view)
            label.alignBottom("0", trailing: "0", toView: view)
            thumbnailView.constrainTrailingSpaceToView(label, predicate:"-6")
            return view
        }

        views.forEach { button in
            self.addSubview(button)
            button.alignTopEdgeWithView(self, predicate: "0")
        }

        let first = views.first!
        let last = views.last!

        first.alignLeadingEdgeWithView(self, predicate: "0")
        last.alignTrailingEdgeWithView(self, predicate: "0")

        // TODO do right via http://stackoverflow.com/questions/18042034/equally-distribute-spacing-using-auto-layout-visual-format-string

        if views.count == 3 {
            let middle = views[1]
            middle.alignCenterXWithView(self, predicate: "0")
        }

        if views.count == 4 {
            let middleLeft = views[1]
            let middleRight = views[2]
            middleLeft.alignAttribute(.Leading, toAttribute: .Trailing, ofView: first, predicate: "12")
            middleRight.alignAttribute(.Trailing, toAttribute: .Leading, ofView: last, predicate: "-12")
        }
    }
}

class SimpleProgressView : UIView {
    var highlightColor = UIColor.artsyPurpleRegular() {
        didSet {
            setNeedsDisplay()
        }
    }

    var progress: CGFloat = 0 {
        didSet {
            setNeedsDisplay()
        }
    }

    override func drawRect(rect: CGRect) {
        let bg = UIBezierPath(rect: bounds)
        backgroundColor!.set()
        bg.fill()

        let progressRect = CGRect(x: 0, y: 0, width: Int(bounds.width * progress), height: Int(bounds.height))
        let fg = UIBezierPath(rect: progressRect)
        highlightColor.set()
        fg.fill()
    }
}