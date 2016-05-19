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
    let salesPerson: LiveAuctionsSalesPersonType

    private let biddingViewModel: LiveAuctionBiddingViewModelType

    private var imageBottomConstraint: NSLayoutConstraint?
    private var lotMetadataStack: AuctionLotMetadataStackScrollView?

    private var currentLotObserver: ObserverToken?
    private var saleAvailabilityObserver: ObserverToken?
    private var lotStateObserver: ObserverToken?

    init(index: Int, lotViewModel: LiveAuctionLotViewModelType, salesPerson: LiveAuctionsSalesPersonType) {
        self.index = index
        self.lotViewModel = lotViewModel
        self.salesPerson = salesPerson
        self.biddingViewModel = LiveAuctionBiddingViewModel(currencySymbol: lotViewModel.currencySymbol, lotViewModel: lotViewModel, auctionViewModel: salesPerson.auctionViewModel)

        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        if let currentLotObserver = currentLotObserver {
            salesPerson.currentLotSignal.unsubscribe(currentLotObserver)
        }
        if let saleAvailabilityObserver = saleAvailabilityObserver {
            salesPerson.auctionViewModel.saleAvailabilitySignal.unsubscribe(saleAvailabilityObserver)
        }
        if let lotStateObserver = lotStateObserver {
            lotViewModel.lotStateSignal.unsubscribe(lotStateObserver)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        /// Image Preview, only on iPad
        let lotImagePreviewView: UIImageView?
        if traitCollection.horizontalSizeClass == .Regular {
            lotImagePreviewView = UIImageView().then {
                $0.contentMode = .ScaleAspectFit
                $0.setContentHuggingPriority(UILayoutPriorityFittingSizeLevel, forAxis: .Vertical)
            }
        } else {
            lotImagePreviewView = nil
        }

        lotImagePreviewView?.then {
            view.addSubview($0)
            $0.alignTopEdgeWithView(view, predicate: "0")
            $0.constrainWidthToView(view, predicate: "-80")
            $0.alignCenterXWithView(view, predicate: "0")
        }

        /// The whole stack
        let metadataStack = ORStackView()

        /// The metadata that can jump over the artwork image
        let lotMetadataStack = AuctionLotMetadataStackScrollView()
        self.lotMetadataStack = lotMetadataStack
        view.addSubview(lotMetadataStack)
        lotMetadataStack.constrainWidthToView(view, predicate: "0")
        lotMetadataStack.alignCenterXWithView(view, predicate: "0")

        /// We attach the bottom of the image preview to the bottom of the lot metadata,
        /// then later, when we have enough information about it's height the constant is set
        lotImagePreviewView?.then {
            imageBottomConstraint = lotMetadataStack.alignBottomEdgeWithView($0, predicate: "0") // TODO: I dunno lol
        }


        /// This is a constraint that says "stick to the top of the lot view"
        /// it's initially turned off, otherwise it uses it's own height constraint
        /// that is only as big as it's `aboveFoldStackWrapper`

        let topMetadataStackConstraint = lotMetadataStack.alignTopEdgeWithView(view, predicate: "0")
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

        // Metadata stack setup
        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.alignBottomEdgeWithView(view, predicate: "0")
        metadataStack.constrainWidthToView(view, predicate: "-40")
        metadataStack.alignCenterXWithView(view, predicate: "0")

        lotMetadataStack.constrainBottomSpaceToView(metadataStack, predicate: "0")

        // Info toolbar setup
        let infoToolbar = LiveAuctionToolbarView()
        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = salesPerson.auctionViewModel
        metadataStack.addSubview(infoToolbar, withTopMargin: "40", sideMargin: "20")
        infoToolbar.constrainHeight("14")

        // Bid button setup.
        let bidButton = LiveAuctionBidButton(viewModel: biddingViewModel)
        bidButton.delegate = self
        metadataStack.addSubview(bidButton, withTopMargin: "14", sideMargin: "20")

        // Bid history setup.
        let bidHistoryViewController = LiveAuctionBidHistoryViewController(lotViewModel: lotViewModel)
        metadataStack.addViewController(bidHistoryViewController, toParent: self, withTopMargin: "10", sideMargin: "20")
        bidHistoryViewController.view.constrainHeight("70")

        // Setup for "current lot" purple view at the bottom of the view.
        let currentLotView = LiveAuctionCurrentLotView(viewModel: salesPerson.auctionViewModel.currentLotSignal)
        currentLotView.addTarget(nil, action: #selector(LiveAuctionLotSetViewController.jumpToLiveLot), forControlEvents: .TouchUpInside)
        view.addSubview(currentLotView)
        currentLotView.alignBottom("-5", trailing: "-5", toView: view)
        currentLotView.alignLeadingEdgeWithView(view, predicate: "5")
        currentLotView.hidden = true

        // Subscribe to updates from our bidding view model, telling us what state the lot's bid status is in.
        biddingViewModel.progressSignal.subscribe { [weak currentLotView, weak lotMetadataStack, weak bidHistoryViewController] bidState in

            let hideCurrentLotCTA: Bool
            let hideBidHistory: Bool

            switch bidState {
            case .Active:
                hideBidHistory = false
                hideCurrentLotCTA = true
            case .InActive:
                hideBidHistory = true
                hideCurrentLotCTA = false
            }

            currentLotView?.hidden = hideCurrentLotCTA

            // Not sure this should stay this way, but things will have to change once we support dragging up the bid history anyway
            bidHistoryViewController?.view.hidden = hideBidHistory

            // We need to align the bottom of the lot image to the lot metadata
            lotMetadataStack?.layoutIfNeeded()
        }

        // TODO: is this required? A closed sale would imply all lots are closed, and the currentLotView would be hidden in the above subscription ^
        saleAvailabilityObserver = salesPerson.auctionViewModel.saleAvailabilitySignal.subscribe { [weak currentLotView] saleAvailability in
            if saleAvailability == .Closed {
                currentLotView?.removeFromSuperview()
            }
        }

        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = salesPerson.auctionViewModel

        lotImagePreviewView?.ar_setImageWithURL(lotViewModel.urlForThumbnail)
        lotMetadataStack.viewModel.update(lotViewModel)
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        let height = lotMetadataStack?.frame.height ?? 0
        imageBottomConstraint?.constant = height + 20
        view.setNeedsUpdateConstraints()
    }
}

extension LiveAuctionLotViewController: LiveAuctionBidButtonDelegate {

    func bidButtonRequestedBid(button: LiveAuctionBidButton) {
        salesPerson.bidOnLot(lotViewModel, amountCents: lotViewModel.currentLotValue, biddingViewModel: biddingViewModel)
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
