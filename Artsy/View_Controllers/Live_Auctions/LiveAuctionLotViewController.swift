import UIKit
import Interstellar
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView

class LiveAuctionLotViewController: UIViewController {
    let index: Int

    let lotViewModel: LiveAuctionLotViewModelType
    let auctionViewModel: LiveAuctionViewModelType
    let currentLotSignal: Signal<LiveAuctionLotViewModelType>

    // Using lazy to hold a strong reference onto the returned signal
    lazy var computedLotStateSignal: Signal<LotState> = {
        return self.lotViewModel.computedLotStateSignal(self.auctionViewModel)
    }()

    init(index: Int, auctionViewModel: LiveAuctionViewModelType, lotViewModel: LiveAuctionLotViewModelType, currentLotSignal: Signal<LiveAuctionLotViewModelType>) {
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

        /// Image Preview
        let lotImagePreviewView = UIImageView()
        lotImagePreviewView.contentMode = .ScaleAspectFit

        lotImagePreviewView.setContentHuggingPriority(UILayoutPriorityDefaultLow, forAxis: .Horizontal)
        lotImagePreviewView.setContentCompressionResistancePriority(400, forAxis: .Vertical)

        view.addSubview(lotImagePreviewView)
        lotImagePreviewView.alignTopEdgeWithView(view, predicate: "20")
        lotImagePreviewView.constrainWidthToView(view, predicate: "-80")
        lotImagePreviewView.alignCenterXWithView(view, predicate: "0")

        /// The whole stack
        let metadataStack = ORStackView()

        /// The metadata that can jump over the artwork image
        let lotMetadataStack = AuctionLotMetadataStackScrollView()
        view.addSubview(lotMetadataStack)
        lotMetadataStack.constrainWidthToView(view, predicate: "0")
        lotMetadataStack.alignCenterXWithView(view, predicate: "0")

        /// We attach the bottom of the image preview to the bottom of the lot metadata,
        /// then later, when we have enough information about it's height the constant is set
        let imageBottomConstraint = lotMetadataStack.alignBottomEdgeWithView(lotImagePreviewView, predicate: "0")


        /// This is a constraint that says "stick to the top of the lot view"
        /// it's initially turned off, otherwise it uses it's own height constraint
        /// that is only as big as it's `aboveFoldStackWrapper`

        let topMetadataStackConstraint = lotMetadataStack.alignTopEdgeWithView(self.view, predicate: "20")
        topMetadataStackConstraint.active = false

        /// Toggles the top constraint, and tells the stack to re-layout
        lotMetadataStack.showAdditionalInformation = { button in
            topMetadataStackConstraint.active = true
            lotMetadataStack.showFullMetadata(true)
        }

        lotMetadataStack.hideAdditionalInformation = { button in
            topMetadataStackConstraint.active = false
            lotMetadataStack.hideFullMetadata(true)
        }

        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.alignBottomEdgeWithView(view, predicate: "0")
        metadataStack.constrainWidthToView(view, predicate: "-40")
        metadataStack.alignCenterXWithView(view, predicate: "0")

        lotMetadataStack.constrainBottomSpaceToView(metadataStack, predicate: "0")

        let infoToolbar = LiveAuctionToolbarView()
        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = auctionViewModel
        metadataStack.addSubview(infoToolbar, withTopMargin: "40", sideMargin: "20")
        infoToolbar.constrainHeight("14")

        let bidButton = LiveAuctionBidButton()
        bidButton.delegate = self
        metadataStack.addSubview(bidButton, withTopMargin: "14", sideMargin: "20")

        let bidHistoryViewController = LiveAuctionBidHistoryViewController(style: .Plain)
        metadataStack.addViewController(bidHistoryViewController, toParent: self, withTopMargin: "10", sideMargin: "20")
        bidHistoryViewController.view.constrainHeight("70")

        let currentLotView = LiveAuctionCurrentLotView()
        currentLotView.addTarget(nil, action: #selector(LiveAuctionViewController.jumpToLiveLot), forControlEvents: .TouchUpInside)
        view.addSubview(currentLotView)
        currentLotView.alignBottom("-5", trailing: "-5", toView: view)
        currentLotView.alignLeadingEdgeWithView(view, predicate: "5")

        // TODO impossible to unsubscribe from Interstellar signals, will adding all those callbacks ever hurt us performance-wise?
        currentLotSignal.next { [weak currentLotView, weak lotMetadataStack] currentLot in
            currentLotView?.viewModel.update(currentLot)
            lotMetadataStack?.viewModel.update(currentLot)

            // We need to align the bottom of the lot image to the lot metadata
            lotMetadataStack?.layoutIfNeeded()
            let height = lotMetadataStack?.frame.height ?? 0
            imageBottomConstraint.constant = height + 20
        }

        auctionViewModel.saleAvailabilitySignal.next { [weak currentLotView] saleAvailability in
            if saleAvailability == .Closed {
                currentLotView?.removeFromSuperview()
            }
        }

        computedLotStateSignal.next { [weak bidButton] lotState in
            // TODO: Hrm, should this go in the LotVM?
            let buttonState: LiveAuctionBidButtonState
            switch lotState {
            case .LiveLot: buttonState = .Active(biddingState: .Biddable(biddingAmount: "$45,000"))
            default: buttonState = .InActive(lotState: lotState)
            }
            bidButton?.progressSignal.update(buttonState)
        }
        lotImagePreviewView.ar_setImageWithURL(lotViewModel.urlForThumbnail)

        computedLotStateSignal.next { lotState in
            switch lotState {
            case .ClosedLot:
                bidButton.setEnabled(false, animated: false)
                bidHistoryViewController.lotViewModel = self.lotViewModel

            case .LiveLot:
                // We don't need this when it's the current lot
                currentLotView.removeFromSuperview()
                bidHistoryViewController.lotViewModel = self.lotViewModel

            case .UpcomingLot(_):
                // Not sure this should stay this way, but things will have to change once we support dragging up the bid history anyway
                bidHistoryViewController.view.hidden = true
            }
        }
    }
}

extension LiveAuctionLotViewController: LiveAuctionBidButtonDelegate {

    func bidButtonRequestedBid(button: LiveAuctionBidButton) {
        // TODO
    }

    func bidButtonRequestedRegisterToBid(button: LiveAuctionBidButton) {
        
    }

    func bidButtonRequestedSubmittingMaxBid(button: LiveAuctionBidButton) {
        let bidVC = StoryboardScene.LiveAuctions.instantiateBid()
        bidVC.bidViewModel = LiveAuctionBidViewModel(lotVM: lotViewModel)
        
        let nav = ARSerifNavigationViewController(rootViewController: bidVC)
        guard let pageVC = parentViewController else { return }
        guard let auctionVC = pageVC.parentViewController else { return }
        auctionVC.presentViewController(nav, animated: true) { button.enabled = true }
    }
}

class LiveAuctionCurrentLotView: UIButton {

    let viewModel = Signal<LiveAuctionLotViewModelType>()

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

        let hammerView = UIImageView(image: UIImage(asset: .Lot_bidder_hammer_white))
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
            biddingPriceLabel.text = vm.currentLotValueString
            thumbnailView.ar_setImageWithURL(vm.urlForThumbnail)
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
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