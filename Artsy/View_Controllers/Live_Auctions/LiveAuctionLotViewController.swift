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
    let bidHistoryState = Observable<BidHistoryState>(.Closed)

    private weak var bidHistoryViewController: LiveAuctionBidHistoryViewController?
    private let biddingViewModel: LiveAuctionBiddingViewModelType
    private var imageBottomConstraint: NSLayoutConstraint?
    private weak var lotMetadataStack: AuctionLotMetadataStackScrollView?
    private var saleAvailabilityObserver: ObserverToken<SaleAvailabilityState>?
    private var bidHistoryGestureController: LiveAuctionLotBidHistoryGestureController?
    private var lotHistoryHeightConstraint: NSLayoutConstraint?
    private var alignMetadataToTopConstraint: NSLayoutConstraint?

    /// Changes in the bid history frame.origin.y from its original, at rest position.
    let bidHistoryDelta = Observable<(delta: CGFloat, animating: Bool)>((delta: 0, animating: false))

    var biddingHistoryHeightOffset = 0

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

        // We need to obscure the content behind our view, so the first thing we do is create
        // this background view and give it a mostly-opaque background color. We'll
        let backgroundView = UIView().then {
            $0.backgroundColor = UIColor(white: 1, alpha: 0.85)
        }
        view.addSubview(backgroundView)

        let sideMargin: String

        if traitCollection.horizontalSizeClass == .Regular {
            sideMargin = "80"
        } else {
            sideMargin = "40"
        }

        /// The whole stack
        let metadataStack = ORStackView()

        /// The metadata that can jump over the artwork image
        let lotMetadataStack = AuctionLotMetadataStackScrollView(viewModel: lotViewModel, salesPerson: salesPerson, sideMargin: sideMargin)
        self.lotMetadataStack = lotMetadataStack
        view.addSubview(lotMetadataStack)
        lotMetadataStack.constrainWidthToView(view, predicate: "0")
        lotMetadataStack.alignCenterXWithView(view, predicate: "0")

        /// This is a constraint that says "stick to the top of the lot view."
        /// We use it for both showing lot info and for expanding the bid history.
        alignMetadataToTopConstraint = lotMetadataStack.alignTopEdgeWithView(view, predicate: "0")
        alignMetadataToTopConstraint?.active = false


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

        metadataStack.addSubview(infoToolbar, withTopMargin: "28", sideMargin: sideMargin)
        infoToolbar.constrainHeight("38")

        /// Toggles the top constraint, and tells the stack to re-layout
        lotMetadataStack.showAdditionalInformation = { [weak lotMetadataStack, weak alignMetadataToTopConstraint, weak metadataStack, weak infoToolbar] in
            alignMetadataToTopConstraint?.active = true
            alignMetadataToTopConstraint?.constant = 0 // Stick to the _very_ top of our view.
            metadataStack?.updateTopMargin("10", forView: infoToolbar)
            lotMetadataStack?.showFullMetadata(true)
        }

        lotMetadataStack.hideAdditionalInformation = { [weak lotMetadataStack, weak alignMetadataToTopConstraint, weak metadataStack, weak infoToolbar] in
            alignMetadataToTopConstraint?.active = false
            metadataStack?.updateTopMargin("28", forView: infoToolbar)
            lotMetadataStack?.hideFullMetadata(true)
        }

        let pan = PanDirectionGestureRecognizer(direction: .Vertical)
        view.addGestureRecognizer(pan)
        bidHistoryGestureController = LiveAuctionLotBidHistoryGestureController(gestureRecognizer: pan,
            begining: { [weak self] originalState in
                if originalState == .Closed {
                    // We're opening.
                    // Close the lot metadata, in case its open.
                    self?.lotMetadataStack?.hideAdditionalInformation?()
                    self?.lotMetadataStack?.setShowInfoButtonEnabled(false)

                    // Set up our constraint to take over from lotHistoryHeightConstraint. One of them needs to be active at all times.
                    self?.alignMetadataToTopConstraint?.constant = self?.atRestMetadataPosition ?? 0
                    self?.alignMetadataToTopConstraint?.active = true
                    self?.lotHistoryHeightConstraint?.active = false
                }
            },
            update: { [weak self] delta in
                // Updates sale progress bar.
                self?.bidHistoryDelta.update((delta: delta, animating: false))
                print(delta)

                // Updates our view hierarchy's position.
                var distanceFromTop = (self?.atRestMetadataPosition ?? 0) + delta
                distanceFromTop.capAtMax(self?.atRestMetadataPosition ?? 0, min: self?.openedMetadataPosition ?? 0)
                self?.alignMetadataToTopConstraint?.constant = distanceFromTop
            },
            completion: { [weak self] targetState in
                self?.bidHistoryViewController?.tableView.scrollEnabled = (targetState == .Open)

                UIView.animateWithDuration(ARAnimationDuration, animations: {
                    if targetState == .Open {
                        self?.alignMetadataToTopConstraint?.constant = self?.openedMetadataPosition ?? 0 // Reset this to stick to the top
                        self?.alignMetadataToTopConstraint?.active = true
                        self?.lotHistoryHeightConstraint?.active = false
                    } else {
                        self?.alignMetadataToTopConstraint?.active = false
                        self?.lotHistoryHeightConstraint?.active = true
                    }

                    let delta = (targetState == .Open ? -(self?.openedMetadataPosition ?? 0) : 0)
                    self?.bidHistoryDelta.update((delta: delta, animating: true))

                    self?.view.layoutIfNeeded()
                    }, completion: { _ in
                        // Update our parent once the animation is complete, so it can change disable enabledness, etc.
                        self?.bidHistoryState.update(targetState)
                        self?.lotMetadataStack?.setShowInfoButtonEnabled(targetState == .Closed)
                })
        })




        // Bid button setup.
        let bidButton = LiveAuctionBidButton(viewModel: biddingViewModel)
        bidButton.setContentHuggingPriority(UILayoutPriorityDefaultHigh, forAxis: .Vertical)
        bidButton.delegate = self
        metadataStack.addSubview(bidButton, withTopMargin: "0", sideMargin: sideMargin)

        // Bid history setup.
        let historyViewController = LiveAuctionBidHistoryViewController(lotViewModel: lotViewModel)
        bidHistoryViewController = historyViewController
        metadataStack.addViewController(historyViewController, toParent: self, withTopMargin: "10", sideMargin: sideMargin)

        let screenWidthIsLarge = UIScreen.mainScreen().applicationFrame.width > 320
        lotHistoryHeightConstraint = historyViewController.view.constrainHeight(screenWidthIsLarge ? "110" : "70")

        // Setup for "current lot" purple view at the bottom of the view.
        let currentLotView = LiveAuctionCurrentLotView(viewModel: salesPerson.auctionViewModel.currentLotSignal, salesPerson: salesPerson)
        currentLotView.addTarget(nil, action: #selector(LiveAuctionLotSetViewController.jumpToLiveLot), forControlEvents: .TouchUpInside)
        view.addSubview(currentLotView)
        currentLotView.alignBottom("-5", trailing: "-5", toView: view)
        currentLotView.alignLeadingEdgeWithView(view, predicate: "5")
        currentLotView.hidden = true

        // Finally, align the background view.
        backgroundView.alignLeading("0", trailing: "0", toView: view)
        backgroundView.alignBottomEdgeWithView(view, predicate: "0")
        backgroundView.alignTopEdgeWithView(lotMetadataStack, predicate: "0")


        // Subscribe to updates from our bidding view model, telling us what state the lot's bid status is in.
        biddingViewModel.progressSignal.subscribe { [weak currentLotView, weak self] bidState in

            let hideCurrentLotCTA: Bool
            let hideBidHistory: Bool

            switch self?.salesPerson.auctionViewModel.currentLotSignal.peek() {
            case .Some(let .Some(lot)):
                let myLotID = self?.lotViewModel.lotID
                hideCurrentLotCTA = (lot.lotID == myLotID)
                hideBidHistory = !hideCurrentLotCTA

            default: // a nil anywhere
                hideCurrentLotCTA = true
                hideBidHistory = true
            }

            currentLotView?.hidden = hideCurrentLotCTA

            self?.bidHistoryViewController?.view.hidden = hideBidHistory
            self?.bidHistoryViewController?.tableView.scrollEnabled = hideBidHistory
            self?.bidHistoryGestureController?.enabled = !hideBidHistory

            if hideBidHistory && self?.bidHistoryGestureController?.bidHistoryState == .Open {
                UIView.animateWithDuration(ARAnimationQuickDuration, animations: {
                    self?.shrinkBidHistory()
                }, completion: { _ in
                    self?.shrinkBidHistoryCompleted()
                })
            }

            // We need to align the bottom of the lot image to the lot metadata
            self?.lotMetadataStack?.layoutIfNeeded()
        }

        // TODO: is this required? A closed sale would imply all lots are closed, and the currentLotView would be hidden in the above subscription ^
        saleAvailabilityObserver = salesPerson.auctionViewModel.saleAvailabilitySignal.subscribe { [weak currentLotView] saleAvailability in
            if saleAvailability == .Closed {
                currentLotView?.removeFromSuperview()
            }
        }

        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = salesPerson.auctionViewModel
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        // If atRestMetadataPosition is not set, then we set it based on the lotMetadatStack's position in our view.
        // This should occur during the view's initial layout pass, before any user interaction.
        if atRestMetadataPosition == nil {
            atRestMetadataPosition = lotMetadataStack?.frame.origin.y
            print("Resetting atRestMetadataPosition to \(atRestMetadataPosition)")
        }
    }

    // This is strictly iPad support, trait collections on iPhone won't chage as we don't support rotation.
    override func viewWillTransitionToSize(size: CGSize, withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransitionToSize(size, withTransitionCoordinator: coordinator)

        // This closes the bid history, typically on rotation. We animate alongside the rotation animation for a smooooth user experience.
        coordinator.animateAlongsideTransition({ context in
            self.shrinkBidHistory()
        }, completion: { _ in
            self.shrinkBidHistoryCompleted()
        })
    }

    private func shrinkBidHistory() {
        alignMetadataToTopConstraint?.constant = openedMetadataPosition ?? 0 // Reset this to stick to the top, we'll set its active status below.
        alignMetadataToTopConstraint?.active = false
        lotHistoryHeightConstraint?.active = true

        bidHistoryDelta.update((delta: 0, animating: true))
    }

    private func shrinkBidHistoryCompleted() {
        bidHistoryGestureController?.forceCloseBidHistory()
        lotMetadataStack?.setShowInfoButtonEnabled(true)
        atRestMetadataPosition = nil
        view.setNeedsLayout() // Triggers a re-set of atRestMetadataPosition
    }

    private var atRestMetadataPosition: CGFloat? {
        didSet {
            bidHistoryGestureController?.closedPosition = atRestMetadataPosition ?? 0
            bidHistoryGestureController?.openedPosition = openedMetadataPosition ?? 0
        }
    }
    private var openedMetadataPosition: CGFloat? {
        switch atRestMetadataPosition {
        case .Some(let atRestMetadataPosition): return atRestMetadataPosition / 2
        case nil: return nil
        }
    }
}

extension LiveAuctionLotViewController: LiveAuctionBidButtonDelegate {

    func bidButtonRequestedBid(button: LiveAuctionBidButton) {
        salesPerson.bidOnLot(lotViewModel, amountCents: salesPerson.currentLotValue(lotViewModel), biddingViewModel: biddingViewModel)
    }

    func bidButtonRequestedRegisterToBid(button: LiveAuctionBidButton) {
        ARTrialController.presentTrialIfNecessaryWithContext(.AuctionRegistration) { created in
            let registrationPath = "/auction-registration/\(self.salesPerson.liveSaleID)"
            let viewController = ARSwitchBoard.sharedInstance().loadPath(registrationPath)
            let serifNav = SerifModalWebNavigationController(rootViewController: viewController)
            self.navigationController?.presentViewController(serifNav, animated: true) {}
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
