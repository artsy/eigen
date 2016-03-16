import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView
import Interstellar
import AVFoundation
import UICKeyChainStore

class LiveAuctionViewController: UIViewController {
    let saleID: String

    let auctionDataSource = LiveAuctionSaleLotsDataSource()
    let scrollManager = ScrollViewProgressObserver()

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
    }

    // Required by Swift compiler, for now.
    required init?(coder aDecoder: NSCoder) {
        self.saleID = ""
        super.init(coder: aDecoder)
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .whiteColor()

        let navToolbar = UIView()
        view.addSubview(navToolbar)

        // TODO: make a smaller ARCircularActionButton?
        // Also this entire thing should become a view
        let buttons:[UIView] = ["lots", "info", "close"].map { name in
            let button = ARCircularActionButton(imageName: "\(name)_icon")
            return button
        }

        buttons.forEach { button in
            navToolbar.addSubview(button)
            button.constrainHeight("40")
            button.constrainWidth("40")
            button.layer.cornerRadius = 20;
        }

        UIView.spaceOutViewsHorizontally(buttons, predicate: "8")
        buttons.last?.alignTopEdgeWithView(navToolbar, predicate: "0")
        buttons.last?.alignTrailingEdgeWithView(navToolbar, predicate:"0")
        buttons.first?.alignLeadingEdgeWithView(navToolbar, predicate: "0")
        UIView.alignTopAndBottomEdgesOfViews(buttons)

        // 30 because there's no statusbar
        navToolbar.alignTopEdgeWithView(view, predicate: "30")
        navToolbar.alignTrailingEdgeWithView(view, predicate: "-10")
        navToolbar.constrainHeight("40")

        // This sits _behind_ the PageViewController, which is transparent and shows it through
        // meaning interaction is handled by a ScrollViewProgressObserver

        let previewView = LiveAuctionImagePreviewView(progressSignal: scrollManager.progress, nextSignal: salesPerson.currentIndexSignal, salesPerson: salesPerson)
        view.addSubview(previewView)
        previewView.constrainHeight("300")
        previewView.constrainTopSpaceToView(navToolbar, predicate: "10")
        previewView.alignLeadingEdgeWithView(view, predicate: "0")
        previewView.alignTrailingEdgeWithView(view, predicate: "0")

        pageController = UIPageViewController(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: [:])
        ar_addModernChildViewController(pageController)

        if let scrollView = pageController.view.subviews.filter({ $0.isKindOfClass(UIScrollView.self) }).first as? UIScrollView {
            scrollView.delegate = scrollManager
        }

        if let salesPersonAsPageDelegate = salesPerson as? UIPageViewControllerDelegate {
            pageController.delegate = salesPersonAsPageDelegate
        }

        let pageControllerView = pageController.view
        pageControllerView.constrainTopSpaceToView(navToolbar, predicate: "0")
        pageControllerView.alignLeadingEdgeWithView(view, predicate: "0")
        pageControllerView.alignTrailingEdgeWithView(view, predicate: "0")
        pageControllerView.alignBottomEdgeWithView(view, predicate: "0")

        let progress = SimpleProgressView()
        progress.progress = 0.6
        progress.backgroundColor = .artsyLightGrey()

        view.addSubview(progress)
        progress.constrainHeight("4")
        progress.alignLeading("0", trailing: "0", toView: view)
        progress.alignBottomEdgeWithView(view, predicate: "-165")


        salesPerson.updatedState.next { [weak self] _ in
            self?.setupWithInitialData()
        }

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
        // TODO: Figoure how to update the auctionVC's auctionViewModel signal in a better way.
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

        let metadataStack = ORStackView()
        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.alignBottomEdgeWithView(view, predicate: "0")
        metadataStack.constrainWidthToView(view, predicate: "-40")
        metadataStack.alignCenterXWithView(view, predicate: "0")

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
        currentLotView.addTarget(nil, action: "jumpToLiveLot", forControlEvents: .TouchUpInside)
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
            bidButton.setTitle(vm.bidButtonTitle, forState: .Normal)

            switch vm.lotState {
            case .ClosedLot:
                bidButton.setEnabled(false, animated: false)
                bidHistoryViewController.lotViewModel = vm

            case .LiveLot:
                // We don't need this when it's the current lot
                currentLotView.removeFromSuperview()
                bidHistoryViewController.lotViewModel = vm

            case .UpcomingLot(_):
                // Not sure this should stay this way, but things will have to change once we support dragging up the bid history anyway
                bidHistoryViewController.view.hidden = true
            }
        }
    }
}


/// This is a proof of concept, needs more work ( needs far left / far right views for example
/// and to deal with transforms/ opacity

class LiveAuctionImagePreviewView : UIView {
    let progress: Signal<CGFloat>
    let salesPerson: LiveAuctionsSalesPersonType
    
    var leftLeftImageView, leftImageView, rightRightImageView, rightImageView, centerImageView: UIImageView

    init(progressSignal: Signal<CGFloat>, nextSignal: Signal<Int>, salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson
        self.progress = progressSignal

        leftImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        leftLeftImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        centerImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        rightImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        rightRightImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))

        let imageViews = [leftLeftImageView, leftImageView, rightImageView, rightRightImageView, centerImageView]

        super.init(frame: CGRect.zero)

        for image in imageViews {
            addSubview(image)
        }

        progressSignal.next { progress in
            let width = Int(self.bounds.width)
            let half = Int(width / 2)

            self.leftLeftImageView.center = self.positionOnRange(-width...0, value: progress)
            self.leftImageView.center = self.positionOnRange((-half - 0)...half, value: progress)
            self.centerImageView.center = self.positionOnRange(0...width, value: progress)
            self.rightImageView.center = self.positionOnRange(half...width + half, value: progress)
            self.rightRightImageView.center = self.positionOnRange(width...width * 2, value: progress)
        }

        nextSignal.next { _ in
            let imageViews = [self.leftLeftImageView, self.leftImageView, self.centerImageView, self.rightImageView, self.rightRightImageView]
            let indexes = [-2, -1, 0, 1, 2]

            for index in indexes {
                if let vm = salesPerson.lotViewModelRelativeToShowingIndex(index) {
                    let imageViewIndex = indexes.indexOf { $0 == index }!

                    let imageView = imageViews[imageViewIndex]
                    imageView.ar_setImageWithURL(vm.urlForThumbnail)
                    let size = vm.imageProfileSize
                    let aspectRatio =  size.width / size.height

                    imageView.frame = AVMakeRectWithAspectRatioInsideRect(
                        CGSizeMake(aspectRatio, 1),
                        CGRect(x: 0, y: 0, width: 180, height: 300)
                    )
                }
            }
        }
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        progress.update(0)
    }

    func valueOnRange(range: Range<Int>, value: CGFloat) -> CGFloat {
        let min = CGFloat(range.minElement()!)
        let max = CGFloat(range.maxElement()!)

        let midpoint = (min + max) / 2
        let offset: CGFloat
        if value == 0 {
            offset = 0
        } else if value > 0 {
            offset = (max - midpoint) * value
        } else {
            offset = (midpoint - min) * value
        }
        return midpoint + offset
    }

    func positionOnRange(range: Range<Int>, value: CGFloat) -> CGPoint {
        let x = valueOnRange(range, value: value)
        return CGPoint(x: x, y: bounds.height / 2)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

class LiveAuctionCurrentLotView: UIButton {

    let viewModel = Signal<LiveAuctionLotViewModel>()

    override init(frame: CGRect) {
        super.init(frame: frame)

        backgroundColor = .artsyPurple()

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

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // Remove all subviews and call setupViews() again to start from scratch.
        subviews.forEach { $0.removeFromSuperview() }
        setupViews()
    }

    func lotCountString() -> NSAttributedString {
        return NSAttributedString(string: "\(lotVM.lotIndex)/\(lotVM.lotCount)")
    }

    func attributify(string: String) -> NSAttributedString {
        return NSAttributedString(string: string)
    }

    func setupViews() {
        let viewStructure: [[String: NSAttributedString]]
        let clockClosure: (UILabel) -> ()

        switch lotVM.lotState {
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

/// Handles passing out information about the scroll progress to others

class ScrollViewProgressObserver : NSObject, UIScrollViewDelegate {
    let progress = Signal<CGFloat>()

    func scrollViewDidScroll(scrollView: UIScrollView) {
        let point = scrollView.contentOffset

        // Creates a value from -1 to 0 to 1
        let index = (point.x - scrollView.frame.width) / scrollView.frame.width * -1;
        progress.update(index)
    }
}

class SimpleProgressView : UIView {
    var highlightColor = UIColor.artsyPurple() {
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