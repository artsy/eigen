import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import PBDCarouselCollectionViewLayout
import ORStackView
import Then

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

        let layout = PBDCarouselCollectionViewLayout()
        layout.itemSize = CGSizeMake(260, 240);
        layout.interItemSpace = 20;
        layout.headerSize = CGSizeMake(0, 0);

        let artworkSelectionView = UICollectionView(frame: CGRectZero, collectionViewLayout: layout)
        view.addSubview(artworkSelectionView)
        artworkSelectionView.constrainTopSpaceToView(navToolbar, predicate: "20")
        artworkSelectionView.constrainWidthToView(view, predicate: "0")

        artworkSelectionView.dataSource = auctionDataSource
        artworkSelectionView.delegate = auctionDelegate
        artworkSelectionView.registerClass(UICollectionViewCell.self, forCellWithReuseIdentifier:"cell")

        artworkSelectionView.showsHorizontalScrollIndicator = false
        artworkSelectionView.decelerationRate = UIScrollViewDecelerationRateFast;
        artworkSelectionView.backgroundColor = .debugColourRed()
        
        // TODO: Make dynamic, the rest of the layout should define how tall this is.
        artworkSelectionView.constrainHeight("300")


        let metadataStack = ORStackView()
        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.constrainTopSpaceToView(artworkSelectionView, predicate: "20")
        metadataStack.constrainWidthToView(view, predicate: "-40")
        metadataStack.alignCenterXWithView(view, predicate: "0")

        let artistNameLabel = UILabel().then {
            $0.text = "Damien Hirst"
            $0.font = UIFont.serifBoldFontWithSize(16)
        }
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

        let progress = SimpleProgressView()
        progress.progress = 0.6
        progress.backgroundColor = .artsyLightGrey()

        view.addSubview(progress)
        progress.constrainHeight("4")
        progress.alignLeading("0", trailing: "0", toView: view)
        progress.constrainTopSpaceToView(premiumLabel, predicate: "12")
    }

    // Support for ARMenuAwareViewController

    let hidesBackButton = true
    let hidesSearchButton = true
    let hidesStatusBarBackground = true
}

class LiveAuctionSaleLotsDelegate : NSObject, UICollectionViewDelegate {
    var salesPerson: LiveAuctionsSalesPerson!

    // Notes to self around imaging positions:
    //
    // [ ] [ ] [ ]
    // left one needs right aligned image, center needs centered, and right needs left aligned image
    // In Folio or Eidolon, I used a pod for this I think.

    func collectionView(collectionView: UICollectionView, willDisplayCell cell: UICollectionViewCell, forItemAtIndexPath indexPath: NSIndexPath) {
        cell.backgroundColor = .debugColourGreen()
        let imageView = UIImageView()
        imageView.contentMode = .ScaleAspectFit

        guard let lot = salesPerson.lotForIndexPath(indexPath) else { return }

        imageView.ar_setImageWithURL(lot.urlForThumbnail())
        cell.contentView.addSubview(imageView)
        imageView.frame = cell.contentView.bounds
    }
}

class LiveAuctionSaleLotsDataSource : NSObject, UICollectionViewDataSource {
    var salesPerson: LiveAuctionsSalesPerson!

    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return salesPerson.lotCount
    }

    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        return collectionView.dequeueReusableCellWithReuseIdentifier("cell", forIndexPath: indexPath)
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

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing rela networking

class LiveAuctionsSalesPerson : NSObject {
    private var lots : [LiveAuctionLot] = []
    private var sale : Sale!

    var lotCount: Int {
        return lots.count
    }

    func lotForIndexPath(index: NSIndexPath) -> LiveAuctionLot? {
        return lots[index.row]
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