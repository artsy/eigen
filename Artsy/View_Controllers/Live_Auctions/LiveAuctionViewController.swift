import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView
import Then
import Interstellar

class LiveAuctionViewController: UIViewController {
    let auctionDataSource = LiveAuctionSaleLotsDataSource()
    let auctionDelegate = LiveAuctionSaleLotsDelegate()
    let salesPerson = LiveAuctionsSalesPerson()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        salesPerson.setup()
        auctionDataSource.salesPerson = salesPerson
        auctionDelegate.salesPerson = salesPerson

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

        let pageController = UIPageViewController(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: [:])
        pageController.dataSource = auctionDataSource
        ar_addModernChildViewController(pageController)

        let startVC = auctionDataSource.liveAuctionPreviewViewControllerForIndex(0)
        pageController.setViewControllers([startVC], direction: .Forward, animated: false, completion: nil)

        let pager = pageController.view
        pager.constrainTopSpaceToView(navToolbar, predicate: "0")
        pager.alignLeadingEdgeWithView(view, predicate: "0")
        pager.alignTrailingEdgeWithView(view, predicate: "0")
        pager.alignBottomEdgeWithView(view, predicate: "0")


        let progress = SimpleProgressView()
        progress.progress = 0.6
        progress.backgroundColor = .artsyLightGrey()

        view.addSubview(progress)
        progress.constrainHeight("4")
        progress.alignLeading("0", trailing: "0", toView: view)
        progress.alignBottomEdgeWithView(view, predicate: "-120")

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

        let imageView = UIImageView()
        imageView.contentMode = .ScaleAspectFit

        view.addSubview(imageView)
        imageView.constrainHeight("300")
        imageView.alignTop("0", leading: "0", toView: view)
        imageView.alignTrailingEdgeWithView(view, predicate: "0")

        let metadataStack = ORStackView()
        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.constrainTopSpaceToView(imageView, predicate: "20")
        metadataStack.constrainWidthToView(view, predicate: "-40")
        metadataStack.alignCenterXWithView(view, predicate: "0")

        let artistNameLabel = UILabel()
        artistNameLabel.font = UIFont.serifBoldFontWithSize(16)
        metadataStack.addSubview(artistNameLabel, withTopMargin: "0", sideMargin: "0")

        let artworkNameLabel = ARArtworkTitleLabel()
        artworkNameLabel.setTitle("That work", date: "2006")
        metadataStack.addSubview(artworkNameLabel, withTopMargin: "0", sideMargin: "0")

        let estimateLabel = ARSerifLabel()
        estimateLabel.font = UIFont.serifFontWithSize(14)
        estimateLabel.text = "Estimate: $100,000–120,000 USD"
        metadataStack.addSubview(estimateLabel, withTopMargin: "2", sideMargin: "0")

        let premiumLabel = ARSerifLabel()
        premiumLabel.font = UIFont.serifFontWithSize(14)
        premiumLabel.text = "Buyer’s Premium 25%"
        premiumLabel.alpha = 0.3
        metadataStack.addSubview(premiumLabel, withTopMargin: "2", sideMargin: "0")

        viewModel.next { vm in
            artistNameLabel.text = vm.lotName
            estimateLabel.text = ""
        }
    }
}

class LiveAuctionSaleLotsDataSource : NSObject, UIPageViewControllerDataSource {
    var salesPerson: LiveAuctionsSalesPerson!

    func liveAuctionPreviewViewControllerForIndex(index: Int) -> LiveAuctionPreviewViewController {
        let auctionVC =  LiveAuctionPreviewViewController()
        let viewModel = salesPerson.lotViewModelForIndex(index)
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


class LiveAuctionLotViewModel : NSObject {
    private let lot: LiveAuctionLot

    init(lot: LiveAuctionLot) {
        self.lot = lot
    }

    var urlForThumbnail: NSURL {
        return lot.urlForThumbnail()
    }

    var lotName: String {
        return lot.artworkTitle
    }
}

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing rela networking


class LiveAuctionsSalesPerson : NSObject {
    private var lots : [LiveAuctionLot] = []
    private var sale : Sale!

    var lotCount: Int {
        return lots.count
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel {
        return LiveAuctionLotViewModel(lot: lots[index])
    }

    func setup() {
        let jsonPath = NSBundle.mainBundle().pathForResource("live_actions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

        guard let lots = json["lots"] as? [String: [String: AnyObject]] else { return }
        guard let sale = json["sale"] as? [String: AnyObject] else { return }

        self.sale = Sale(JSON: sale)
        self.lots = lots.values.map { LiveAuctionLot(JSON: $0) }
    }
}