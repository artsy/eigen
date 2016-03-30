import UIKit
import Interstellar
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView

class LiveAuctionLotViewController: UIViewController {
    let index: Int
    let lotViewModel: LiveAuctionLotViewModel
    let auctionViewModel: LiveAuctionViewModel
    let currentLotSignal: Signal<LiveAuctionLotViewModel>

    init(index: Int, auctionViewModel: LiveAuctionViewModel, lotViewModel: LiveAuctionLotViewModel, currentLotSignal: Signal<LiveAuctionLotViewModel>) {
        self.index = index
        self.auctionViewModel = auctionViewModel
        self.lotViewModel = lotViewModel
        self.currentLotSignal = currentLotSignal

        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

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

        auctionViewModel.currentLotViewModel()

        currentLotSignal.next { [weak currentLotView] currentLot in
            currentLotView?.viewModel.update(currentLot)
        }

        // might be a way to "bind" these?
//        auctionViewModel.next { auctionViewModel in
            // TODO: React to these
//
//            if auctionViewModel.saleAvailability == .Closed {
//                currentLotView.removeFromSuperview()
//            }
//        }

//        lotViewModel.next { vm in
//            artistNameLabel.text = vm.lotArtist
//            artworkNameLabel.setTitle(vm.lotName, date: "1985")
//            estimateLabel.text = vm.estimateString
//            infoToolbar.lotVM = vm
//            // TODO: Finish this
////            infoToolbar.auctionViewModel = 
//            // TODO: Uncomment
////            bidButton.setTitle(vm.bidButtonTitle, forState: .Normal)
//            lotPreviewView.ar_setImageWithURL(vm.urlForThumbnail)
//
//            // TODO: Finish
////            switch vm.lotState {
////            case .ClosedLot:
////                bidButton.setEnabled(false, animated: false)
////                bidHistoryViewController.lotViewModel = vm
////
////            case .LiveLot:
////                // We don't need this when it's the current lot
////                currentLotView.removeFromSuperview()
////                bidHistoryViewController.lotViewModel = vm
////
////            case .UpcomingLot(_):
////                // Not sure this should stay this way, but things will have to change once we support dragging up the bid history anyway
////                bidHistoryViewController.view.hidden = true
////            }
//        }
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