import UIKit
import Interstellar
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import ORStackView

class LiveAuctionLotViewController: UIViewController {

    enum BidHistoryState {
        case Closed, Open
    }

    let index: Int

    let lotViewModel: LiveAuctionLotViewModelType
    let salesPerson: LiveAuctionsSalesPersonType
    let bidHistoryState = Observable<BidHistoryState>(.Closed)
    let bidHistoryDelta = Observable<(delta: CGFloat, animating: Bool)>((delta: 0, animating: false))

    private let biddingViewModel: LiveAuctionBiddingViewModelType

    private var imageBottomConstraint: NSLayoutConstraint?
    private var lotMetadataStack: AuctionLotMetadataStackScrollView?

    private var saleAvailabilityObserver: ObserverToken<SaleAvailabilityState>?

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
        saleAvailabilityObserver?.unsubscribe()
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
        alignMetadataToTopConstraint = lotMetadataStack.alignTopEdgeWithView(view, predicate: "0")
        alignMetadataToTopConstraint?.active = false

        /// We attach the bottom of the image preview to the bottom of the lot metadata,
        /// then later, when we have enough information about it's height the constant is set
        lotImagePreviewView?.then {
            imageBottomConstraint = lotMetadataStack.alignBottomEdgeWithView($0, predicate: "0")
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
        metadataStack.constrainWidthToView(view, predicate: "0")
        metadataStack.alignCenterXWithView(view, predicate: "0")

        lotMetadataStack.constrainBottomSpaceToView(metadataStack, predicate: "0")

        // Info toolbar setup
        let infoToolbar = LiveAuctionToolbarView()
        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = salesPerson.auctionViewModel
        metadataStack.addSubview(infoToolbar, withTopMargin: "40", sideMargin: "60")
        infoToolbar.constrainHeight("38")

        let pan = PanDirectionGestureRecognizer(direction: .Vertical, target: self, action: #selector(dragToolbar))
        view.addGestureRecognizer(pan)

        // Bid button setup.
        let bidButton = LiveAuctionBidButton(viewModel: biddingViewModel)
        bidButton.delegate = self
        metadataStack.addSubview(bidButton, withTopMargin: "0", sideMargin: "60")

        // Bid history setup.
        let bidHistoryViewController = LiveAuctionBidHistoryViewController(lotViewModel: lotViewModel)
        metadataStack.addViewController(bidHistoryViewController, toParent: self, withTopMargin: "10", sideMargin: "40")
        lotHistoryHeightConstraint = bidHistoryViewController.view.constrainHeight("70")

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

        // Sets up height constraint based on the lot metadata stack's height.
        // TODO: lotMetadataStack needs a constant height.
        let height = lotMetadataStack?.frame.height ?? 0
        imageBottomConstraint?.constant = height + 20
        view.setNeedsUpdateConstraints()

        // If atRestMetadataPosition is not set, then we set it based on the lotMetadatStack's position in our view.
        // This should occur during the view's initial layout pass, before any user interaction.
        if atRestMetadataPosition == nil {
            atRestMetadataPosition = lotMetadataStack?.frame.origin.y
        }
    }

    private var lotHistoryHeightConstraint: NSLayoutConstraint?
    private var alignMetadataToTopConstraint: NSLayoutConstraint?
    private var _animating = false
    private var initialGestureMetadataPosition: CGFloat = 0
    private var atRestMetadataPosition: CGFloat!
    private var openedMetadataPosition: CGFloat! {
        return atRestMetadataPosition / 2
    }
    // Having an internal, non-Observable bidHistoryState helps us in our gesture recognizer by simplifying the code.
    private var _bidHistoryState: BidHistoryState = .Closed {
        willSet(newValue) {
            if newValue != _bidHistoryState {
                self.bidHistoryState.update(newValue)
            }
        }
    }
    private var _initialBidHistoryState: BidHistoryState = .Closed

    func dragToolbar(gesture: UIPanGestureRecognizer) {
        let translation = gesture.translationInView(view)
        let velocity = gesture.velocityInView(gesture.view)

        switch gesture.state {

        case .Began:
            _initialBidHistoryState = _bidHistoryState

            initialGestureMetadataPosition = lotMetadataStack?.frame.origin.y ?? 0
            alignMetadataToTopConstraint?.constant = initialGestureMetadataPosition

            alignMetadataToTopConstraint?.active = true
            lotHistoryHeightConstraint?.active = false

            // We'll be "open" for now, which is really shorthand for "opening", which will be set appropriately when the recognizer ends.
            _bidHistoryState = .Open
//
        case .Changed:
            // TODO: iPad support.
            // TODO: Disable lot info button when bit history is open.
            // TODO: Allow user to tap outside an open bid history to close it.
            // TODO: What happens when the current lot is closed, and a new one is opened?

            var candidateConstant = initialGestureMetadataPosition + translation.y
            candidateConstant.capAtMax(atRestMetadataPosition, min: openedMetadataPosition)
            alignMetadataToTopConstraint?.constant = candidateConstant

            var delta: CGFloat
            switch _initialBidHistoryState {
            case .Closed: // Opening
                delta = translation.y
            case .Open:   // Closing
                delta = initialGestureMetadataPosition - atRestMetadataPosition + translation.y
            }
            delta.capAtMax(0, min: openedMetadataPosition - atRestMetadataPosition)
            bidHistoryDelta.update((delta: delta, animating: false))

        case .Ended:
            // Depending on the direction of the velocity, close or open the lot history.
            let targetState: BidHistoryState = velocity.y >= 0 ? .Closed : .Open
            _animating = true

            // TODO: be clever about animation velocity
            UIView.animateWithDuration(0.3, animations: {
                self.alignMetadataToTopConstraint?.constant = self.openedMetadataPosition ?? 0 // Reset this to stick to the top, we'll set its active status below.
                self.alignMetadataToTopConstraint?.active = (targetState == .Open)
                self.lotHistoryHeightConstraint?.active = (targetState == .Closed)

                let delta = (targetState == .Open ? -self.openedMetadataPosition : 0)
                self.bidHistoryDelta.update((delta: delta, animating: true))

                self.view.layoutIfNeeded()
            }, completion: { _ in
                // Update our parent once the animation is complete, so it can change disable enabledness, etc.
                self._bidHistoryState = targetState
                self._animating = false
            })

        default: break
        }
    }
}

extension LiveAuctionLotViewController: LiveAuctionBidButtonDelegate {

    func bidButtonRequestedBid(button: LiveAuctionBidButton) {
        salesPerson.bidOnLot(lotViewModel, amountCents: lotViewModel.currentLotValue, biddingViewModel: biddingViewModel)
    }

    func bidButtonRequestedRegisterToBid(button: LiveAuctionBidButton) {
        ARTrialController.presentTrialIfNecessaryWithContext(.AuctionRegistration) { created in
            let registrationPath = "/auction-registration/\(self.salesPerson.liveSaleID)"
            let viewController = ARSwitchBoard.sharedInstance().loadPath(registrationPath)
            self.navigationController?.presentViewController(viewController, animated: true) {}
        }

    }

    func bidButtonRequestedSubmittingMaxBid(button: LiveAuctionBidButton) {
        let bidVC = StoryboardScene.LiveAuctions.instantiateBid()
        bidVC.bidViewModel = LiveAuctionBidViewModel(lotVM: lotViewModel, salesPerson: salesPerson)
        
        let nav = ARSerifNavigationViewController(rootViewController: bidVC)
        guard let pageVC = parentViewController else { return }
        guard let auctionVC = pageVC.parentViewController else { return }
        auctionVC.presentViewController(nav, animated: true) { button.enabled = true }
    }
}
