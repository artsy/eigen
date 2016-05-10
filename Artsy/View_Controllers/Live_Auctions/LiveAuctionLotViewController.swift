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
    let currentLotSignal: Observable<LiveAuctionLotViewModelType?>

    private let biddingViewModel: LiveAuctionBiddingViewModelType

    private var currentLotObserver: ObserverToken?
    private var saleAvailabilityObserver: ObserverToken?
    private var lotStateObserver: ObserverToken?

    init(index: Int, auctionViewModel: LiveAuctionViewModelType, lotViewModel: LiveAuctionLotViewModelType, currentLotSignal: Observable<LiveAuctionLotViewModelType?>) {
        self.index = index
        self.auctionViewModel = auctionViewModel
        self.lotViewModel = lotViewModel
        self.currentLotSignal = currentLotSignal
        self.biddingViewModel = LiveAuctionBiddingViewModel(lotViewModel: lotViewModel, auctionViewModel: auctionViewModel)

        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        if let currentLotObserver = currentLotObserver {
            currentLotSignal.unsubscribe(currentLotObserver)
        }
        if let saleAvailabilityObserver = saleAvailabilityObserver {
            auctionViewModel.saleAvailabilitySignal.unsubscribe(saleAvailabilityObserver)
        }
        if let lotStateObserver = lotStateObserver {
            lotViewModel.lotStateSignal.unsubscribe(lotStateObserver)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        /// Image Preview
        let lotImagePreviewView = UIImageView()
        lotImagePreviewView.contentMode = .ScaleAspectFit
        lotImagePreviewView.setContentHuggingPriority(UILayoutPriorityDefaultLow, forAxis: .Vertical)

        view.addSubview(lotImagePreviewView)
        lotImagePreviewView.alignTopEdgeWithView(view, predicate: "0")
        lotImagePreviewView.constrainWidthToView(view, predicate: "-80")
        lotImagePreviewView.alignCenterXWithView(view, predicate: "0")

        lotImagePreviewView.ar_setImageWithURL(lotViewModel.urlForThumbnail)

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

        let topMetadataStackConstraint = lotMetadataStack.alignTopEdgeWithView(self.view, predicate: "0")
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

        let bidButton = LiveAuctionBidButton(viewModel: biddingViewModel)
        bidButton.delegate = self
        metadataStack.addSubview(bidButton, withTopMargin: "14", sideMargin: "20")

        let bidHistoryViewController = LiveAuctionBidHistoryViewController(lotViewModel: lotViewModel)
        metadataStack.addViewController(bidHistoryViewController, toParent: self, withTopMargin: "10", sideMargin: "20")
        bidHistoryViewController.view.constrainHeight("70")

        let currentLotView = LiveAuctionCurrentLotView(viewModel: auctionViewModel.currentLotSignal)
        currentLotView.addTarget(nil, action: #selector(LiveAuctionLotSetViewController.jumpToLiveLot), forControlEvents: .TouchUpInside)
        view.addSubview(currentLotView)
        currentLotView.alignBottom("-5", trailing: "-5", toView: view)
        currentLotView.alignLeadingEdgeWithView(view, predicate: "5")
        currentLotView.hidden = true


        biddingViewModel.progressSignal.subscribe { [weak currentLotView, weak lotMetadataStack, weak bidHistoryViewController] bidState in

            let hideCurrentLotCTA: Bool
            let hideBidHistory: Bool

            switch bidState {
            case .Active:
                hideBidHistory = false
                hideCurrentLotCTA = true
            case .InActive(let lotState):
                print(lotState)
                hideBidHistory = true
                hideCurrentLotCTA = false
            }

            currentLotView?.hidden = hideCurrentLotCTA

            // Not sure this should stay this way, but things will have to change once we support dragging up the bid history anyway
            bidHistoryViewController?.view.hidden = hideBidHistory

            // We need to align the bottom of the lot image to the lot metadata
            lotMetadataStack?.layoutIfNeeded()
            let height = lotMetadataStack?.frame.height ?? 0
            imageBottomConstraint.constant = height + 20
        }

        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = auctionViewModel

        lotImagePreviewView.ar_setImageWithURL(lotViewModel.urlForThumbnail)

        lotMetadataStack.viewModel.update(lotViewModel)
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
