import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView
import Interstellar


class LiveAuctionViewController: UIViewController {
    let auctionDataSource = LiveAuctionSaleLotsDataSource()
    let salesPerson = LiveAuctionsSalesPerson()
    let scrollManager = ScrollViewProgressObserver()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        salesPerson.setup()
        auctionDataSource.salesPerson = salesPerson

        view.backgroundColor = .whiteColor()

        let navToolbar = UIView()
        view.addSubview(navToolbar)

        // TODO: make a smaller ARCircularActionButton?
        // Also this entire thing should become a view
        let buttons:[UIView] = ["chat", "lots", "info", "close"].map { name in
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
        // meaning interaction is dealt with elsewhere
        let previewView = LiveAuctionImagePreviewView(signal: scrollManager.progress, salesPerson: salesPerson)
        view.addSubview(previewView)
        previewView.backgroundColor = .debugColourRed()
        previewView.constrainHeight("200")
        previewView.constrainTopSpaceToView(navToolbar, predicate: "10")
        previewView.alignLeadingEdgeWithView(view, predicate: "0")
        previewView.alignTrailingEdgeWithView(view, predicate: "0")

        let pageController = UIPageViewController(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: [:])
        pageController.dataSource = auctionDataSource
        ar_addModernChildViewController(pageController)

        let startVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(0)
        pageController.setViewControllers([startVC!], direction: .Forward, animated: false, completion: nil)

        if let scrollView = pageController.view.subviews.filter({ $0.isKindOfClass(UIScrollView.self) }).first as? UIScrollView {
            scrollView.delegate = scrollManager
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
    }

    // Support for ARMenuAwareViewController

    let hidesBackButton = true
    let hidesSearchButton = true
    let hidesStatusBarBackground = true
}

class LiveAuctionPreviewViewController : UIViewController {
    var index = 0
    let viewModel = Signal<LiveAuctionLotViewModel>()

    override func viewDidLoad() {
        super.viewDidLoad()

        let metadataStack = ORStackView()
        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.alignBottomEdgeWithView(view, predicate: "-72")
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

        let  infoToolbar = LiveAuctionToolbarView()
        metadataStack.addSubview(infoToolbar, withTopMargin: "40", sideMargin: "20")
        infoToolbar.constrainHeight("14")

        let bidButton = ARBlackFlatButton()
        metadataStack.addSubview(bidButton, withTopMargin: "14", sideMargin: "20")

        viewModel.next { vm in
            artistNameLabel.text = vm.lotArtist
            artworkNameLabel.setTitle(vm.lotName, date: "1985")
            estimateLabel.text = vm.estimateString
            infoToolbar.lotVM = vm
            bidButton.setTitle(vm.bidButtonTitle, forState: .Normal)
        }
    }
}

class LiveAuctionSaleLotsDataSource : NSObject, UIPageViewControllerDataSource {
    var salesPerson: LiveAuctionsSalesPerson!

    func liveAuctionPreviewViewControllerForIndex(index: Int) -> LiveAuctionPreviewViewController? {
        let auctionVC =  LiveAuctionPreviewViewController()
        guard let viewModel = salesPerson.lotViewModelForIndex(index) else { return nil }
        auctionVC.viewModel.update(viewModel)
        auctionVC.index = index
        return auctionVC
    }

    func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionPreviewViewController else { return nil }
        var newIndex = viewController.index - 1
        if (newIndex < 0) { newIndex = salesPerson.lotCount - 1 }
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }


    func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionPreviewViewController else { return nil }
        let newIndex = (viewController.index + 1) % salesPerson.lotCount;
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }
}

class LiveAuctionImagePreviewView : UIView {
    let salesPerson: LiveAuctionsSalesPerson
    let label: UILabel

    init(signal: Signal<CGFloat>, salesPerson: LiveAuctionsSalesPerson) {
        self.salesPerson = salesPerson

        label = UILabel()
        super.init(frame: CGRect.zero)

        addSubview(label)
        label.alignToView(self)

        /// Ask the salesPerson for the VMs for current, next, prev

        signal.next { progress in
            self.label.text = "\(progress)"
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
        return NSAttributedString(string: "\(lotVM.index)/\(lotVM.lotCount)")
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


/// Represents the whole auction, all the live biz, timings, watchers

class LiveAuctionViewModel : NSObject {
    private let sale: LiveSale

    init(sale: LiveSale) {
        self.sale = sale
    }

    func dateForLotAtIndex(index: Int) -> NSDate {
        return NSDate().dateByAddingTimeInterval( Double(index * 60 * 2) )
    }

    var startDate: NSDate {
        return NSDate()
    }

    var numberOfWatchers: Int {
        return 87
    }

    var nextBidForLot : Int {
        return 25_000
    }

    var lotCount: Int {
        return sale.lotIDs.count
    }

    /// A distance relative to the current lot, -x being that it precedded the current
    /// 0 being it is current and a positive number meaning it upcoming.
    func distanceFromCurrentLot(lot: LiveAuctionLot) -> Int {
        let currentIndex = sale.lotIDs.indexOf(sale.currentLotId)
        let lotIndex = sale.lotIDs.indexOf(lot.liveAuctionLotID)
        guard let current = currentIndex, lot = lotIndex else { return NSNotFound }
        return (current - lot) * -1
    }
}

// Represents a singlelot view

class LiveAuctionLotViewModel : NSObject {

    enum LotState {
        case ClosedLot
        case LiveLot
        case UpcomingLot(distanceFromLive: Int)
    }

    private let auctionVM: LiveAuctionViewModel
    private let lot: LiveAuctionLot
    private let index: Int

    init(lot: LiveAuctionLot, auctionVM: LiveAuctionViewModel, index: Int) {
        self.lot = lot
        self.auctionVM = auctionVM
        self.index = index
    }

    var lotState : LotState {
        let distance = auctionVM.distanceFromCurrentLot(lot)
        print(distance)
        if distance == 0 { return .LiveLot }
        if distance < 0 { return .ClosedLot }
        return .UpcomingLot(distanceFromLive: distance)
    }

    var urlForThumbnail: NSURL {
        return lot.urlForThumbnail()
    }

    var lotName: String {
        return lot.artworkTitle
    }

    var lotArtist: String {
        return lot.artistName
    }

    var lotIndex: Int {
        return index + 1
    }

    var lotCount: Int {
        return auctionVM.lotCount
    }

    var bidButtonTitle: String {
        switch lotState {
        case .ClosedLot:   return "BIDDING CLOSED"
        case .LiveLot:  return "BID 20,000"
        case .UpcomingLot(_):  return "LEAVE MAX BID"
        }
    }

    var estimateString: String {
        return SaleArtwork.estimateStringForLowEstimate(lot.lowEstimateCents, highEstimateCents: lot.highEstimateCents, currencySymbol: lot.currencySymbol, currency: lot.currency)
    }
}

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

class LiveAuctionsSalesPerson : NSObject {
    private var currentIndex = 0
    private var lots : [LiveAuctionLot] = []
    private var sale : LiveSale!

    var lotCount: Int {
        return lots.count
    }

    var currentAuctionLotViewModel: LiveAuctionLotViewModel? {
        return lotViewModelForIndex(currentIndex)
    }

    var previousAuctionLotViewModel: LiveAuctionLotViewModel? {
        return lotViewModelForIndex(currentIndex - 1)
    }

    var nextAuctionLotViewModel: LiveAuctionLotViewModel? {
        return lotViewModelForIndex(currentIndex + 1)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel? {
        if (0..<lotCount ~= index) {
            let auctionVM =  LiveAuctionViewModel(sale: sale)
            return LiveAuctionLotViewModel(lot: lots[index], auctionVM:auctionVM , index: index)
        }
        return nil
    }

    func setup() {
        let jsonPath = NSBundle.mainBundle().pathForResource("live_auctions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

        guard let lots = json["lots"] as? [String: [String: AnyObject]] else { return }
        guard let sale = json["sale"] as? [String: AnyObject] else { return }

        self.sale = LiveSale(JSON: sale)
        let unordered_lots: [LiveAuctionLot] = lots.values.map { LiveAuctionLot(JSON: $0) }
        self.lots = unordered_lots.sort { return $0.position < $1.position }
    }
}