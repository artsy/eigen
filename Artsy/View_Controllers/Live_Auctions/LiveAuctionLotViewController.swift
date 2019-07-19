import UIKit
import Interstellar

class LiveAuctionLotViewController: UIViewController {
    let index: Int

    let lotViewModel: LiveAuctionLotViewModelType
    let salesPerson: LiveAuctionsSalesPersonType
    let bidHistoryState = Observable<BidHistoryState>(.closed)
    let biddingViewModel: LiveAuctionBiddingViewModelType

    fileprivate weak var bidHistoryViewController: LiveAuctionBidHistoryViewController?
    fileprivate var imageBottomConstraint: NSLayoutConstraint?
    fileprivate weak var lotMetadataStack: AuctionLotMetadataStackScrollView?
    fileprivate var bidHistoryGestureController: LiveAuctionLotBidHistoryGestureController?
    fileprivate var lotHistoryHeightConstraint: NSLayoutConstraint?
    fileprivate var alignMetadataToTopConstraint: NSLayoutConstraint?

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

    override func viewDidLoad() {
        super.viewDidLoad()

        setupStack()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        // If atRestMetadataPosition is not set, then we set it based on the lotMetadatStack's position in our view.
        // This should occur during the view's initial layout pass, before any user interaction.
        if atRestMetadataPosition == nil {
            atRestMetadataPosition = lotMetadataStack?.frame.origin.y
            print("Resetting atRestMetadataPosition to \(String(describing: atRestMetadataPosition))")
        }
    }

    // This is strictly iPad support, trait collections on iPhone won't chage as we don't support rotation.
    override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransition(to: size, with: coordinator)

        // This closes the bid history, typically on rotation. We animate alongside the rotation animation for a smooooth user experience.
        coordinator.animate(alongsideTransition: { context in
            self.shrinkBidHistory()
        }, completion: { _ in
            self.shrinkBidHistoryCompleted()
        })
    }

    fileprivate func shrinkBidHistory() {
        alignMetadataToTopConstraint?.constant = openedMetadataPosition ?? 0 // Reset this to stick to the top, we'll set its active status below.
        alignMetadataToTopConstraint?.isActive = false
        lotHistoryHeightConstraint?.isActive = true

        bidHistoryDelta.update((delta: 0, animating: true))
    }

    fileprivate func shrinkBidHistoryCompleted() {
        bidHistoryGestureController?.forceCloseBidHistory()
        lotMetadataStack?.setShowInfoButtonEnabled(true)
        atRestMetadataPosition = nil
        view.setNeedsLayout() // Triggers a re-set of atRestMetadataPosition
    }

    fileprivate var atRestMetadataPosition: CGFloat? {
        didSet {
            bidHistoryGestureController?.closedPosition = atRestMetadataPosition ?? 0
            bidHistoryGestureController?.openedPosition = openedMetadataPosition ?? 0
        }
    }
    fileprivate var openedMetadataPosition: CGFloat? {
        switch atRestMetadataPosition {
        case .some(let atRestMetadataPosition): return atRestMetadataPosition / 2
        case nil: return nil
        }
    }
}

fileprivate typealias PrivateFunctions = LiveAuctionLotViewController
extension PrivateFunctions {
    func setupStack() {

        // We need to obscure the content behind our view, so the first thing we do is create
        // this background view and give it a mostly-opaque background color. We'll
        let backgroundView = UIView().then {
            $0.backgroundColor = UIColor(white: 1, alpha: 0.85)
        }
        view.addSubview(backgroundView)

        let sideMargin: String
        if traitCollection.horizontalSizeClass == .regular {
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
        lotMetadataStack.constrainWidth(toView: view, predicate: "0")
        lotMetadataStack.alignCenterX(withView: view, predicate: "0")

        /// This is a constraint that says "stick to the top of the lot view."
        /// We use it for both showing lot info and for expanding the bid history.
        alignMetadataToTopConstraint = lotMetadataStack.alignTopEdge(withView: view, predicate: "0")
        alignMetadataToTopConstraint?.isActive = false


        // Metadata stack setup
        metadataStack.bottomMarginHeight = 0
        view.addSubview(metadataStack)
        metadataStack.alignBottomEdge(withView: view, predicate: "0")
        metadataStack.constrainWidth(toView: view, predicate: "0")
        metadataStack.alignCenterX(withView: view, predicate: "0")

        lotMetadataStack.constrainBottomSpace(toView: metadataStack, predicate: "0")

        // Info toolbar setup
        let infoToolbar = LiveAuctionToolbarView()
        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = salesPerson.auctionViewModel

        metadataStack.addSubview(infoToolbar, withTopMargin: "28", sideMargin: sideMargin)
        infoToolbar.constrainHeight("38")

        /// Toggles the top constraint, and tells the stack to re-layout
        lotMetadataStack.showAdditionalInformation = { [weak lotMetadataStack, weak alignMetadataToTopConstraint, weak metadataStack, weak infoToolbar] in
            alignMetadataToTopConstraint?.isActive = true
            alignMetadataToTopConstraint?.constant = 0 // Stick to the _very_ top of our view.
            metadataStack?.updateTopMargin("10", for: infoToolbar)
            lotMetadataStack?.showFullMetadata(true)
        }

        lotMetadataStack.hideAdditionalInformation = { [weak lotMetadataStack, weak alignMetadataToTopConstraint, weak metadataStack, weak infoToolbar] in
            alignMetadataToTopConstraint?.isActive = false
            metadataStack?.updateTopMargin("28", for: infoToolbar)
            lotMetadataStack?.hideFullMetadata(true)
        }

        let pan = PanDirectionGestureRecognizer(direction: .vertical)
        view.addGestureRecognizer(pan)

        bidHistoryGestureController = LiveAuctionLotBidHistoryGestureController(gestureRecognizer: pan,
            begining: { [weak self] originalState in
                if originalState == .closed {
                    // We're opening.
                    // Close the lot metadata, in case its open.
                    self?.lotMetadataStack?.hideAdditionalInformation?()
                    self?.lotMetadataStack?.setShowInfoButtonEnabled(false)

                    // Set up our constraint to take over from lotHistoryHeightConstraint. One of them needs to be active at all times.
                    self?.alignMetadataToTopConstraint?.constant = self?.atRestMetadataPosition ?? 0
                    self?.alignMetadataToTopConstraint?.isActive = true
                    self?.lotHistoryHeightConstraint?.isActive = false
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
                self?.bidHistoryViewController?.tableView.isScrollEnabled = (targetState == .open)

                UIView.animate(withDuration: ARAnimationDuration, animations: {
                    if targetState == .open {
                        self?.alignMetadataToTopConstraint?.constant = self?.openedMetadataPosition ?? 0 // Reset this to stick to the top
                        self?.alignMetadataToTopConstraint?.isActive = true
                        self?.lotHistoryHeightConstraint?.isActive = false
                    } else {
                        self?.alignMetadataToTopConstraint?.isActive = false
                        self?.lotHistoryHeightConstraint?.isActive = true
                    }

                    let delta = (targetState == .open ? -(self?.openedMetadataPosition ?? 0) : 0)
                    self?.bidHistoryDelta.update((delta: delta, animating: true))

                    self?.view.layoutIfNeeded()
                    }, completion: { _ in
                        // Update our parent once the animation is complete, so it can change disable enabledness, etc.
                        self?.bidHistoryState.update(targetState)
                        self?.lotMetadataStack?.setShowInfoButtonEnabled(targetState == .closed)
                })
        })

        // Bid button setup.
        let bidButton = LiveAuctionBidButton(viewModel: biddingViewModel)
        bidButton.setContentHuggingPriority(UILayoutPriority.defaultHigh, for: .vertical)
        bidButton.delegate = self
        metadataStack.addSubview(bidButton, withTopMargin: "0", sideMargin: sideMargin)

        // Bid history setup.
        let historyViewController = LiveAuctionBidHistoryViewController(lotViewModel: lotViewModel)
        bidHistoryViewController = historyViewController
        metadataStack.add(historyViewController, toParent: self, withTopMargin: "10", sideMargin: sideMargin)

        let screenWidthIsLarge = UIScreen.main.bounds.width > 320
        lotHistoryHeightConstraint = historyViewController.view.constrainHeight(screenWidthIsLarge ? "110" : "70")

        // Finally, align the background view.
        backgroundView.alignLeading("0", trailing: "0", toView: view)
        backgroundView.alignBottomEdge(withView: view, predicate: "0")
        backgroundView.alignTopEdge(withView: lotMetadataStack, predicate: "0")


        // Subscribe to updates from our bidding view model, telling us what state the lot's bid status is in.
        biddingViewModel.progressSignal.subscribe { [weak self] bidState in
            let hideBidHistory: Bool

            switch self?.salesPerson.auctionViewModel.currentLotSignal.peek() {
            case .some(let .some(lot)):
                let myLotID = self?.lotViewModel.lotID
                hideBidHistory = (lot.lotID != myLotID)
            default: // a nil anywhere
                hideBidHistory = true
            }

            self?.bidHistoryViewController?.view.isHidden = hideBidHistory
            self?.bidHistoryViewController?.tableView.isScrollEnabled = hideBidHistory
            self?.bidHistoryGestureController?.enabled = !hideBidHistory

            if hideBidHistory && self?.bidHistoryGestureController?.bidHistoryState == .open {
                UIView.animate(withDuration: ARAnimationQuickDuration, animations: {
                    self?.shrinkBidHistory()
                }, completion: { _ in
                    self?.shrinkBidHistoryCompleted()
                })
            }

            // We need to align the bottom of the lot image to the lot metadata
            self?.lotMetadataStack?.layoutIfNeeded()
        }

        infoToolbar.lotViewModel = lotViewModel
        infoToolbar.auctionViewModel = salesPerson.auctionViewModel
    }
}

extension LiveAuctionLotViewController: LiveAuctionBidButtonDelegate {

    func bidButtonRequestedBid(_ button: LiveAuctionBidButton) {
        salesPerson.bidOnLot(lotViewModel, amountCents: lotViewModel.askingPrice, biddingViewModel: biddingViewModel)
    }

    func bidButtonRequestedRegisterToBid(_ button: LiveAuctionBidButton) {
        let registrationPath = "/auction-registration/\(self.salesPerson.liveSaleID)?skip_bid_flow=true"
        let viewController = ARSwitchBoard.sharedInstance().loadPath(registrationPath)
        let serifNav = SerifModalWebNavigationController(rootViewController: viewController)
        self.navigationController?.present(serifNav, animated: true) {}
    }

    func bidButtonRequestedSubmittingMaxBid(_ button: LiveAuctionBidButton) {
        let bidVC = StoryboardScene.LiveAuctions.instantiateBid()
        bidVC.bidViewModel = LiveAuctionBidViewModel(lotVM: lotViewModel, salesPerson: salesPerson)

        let nav = ARSerifNavigationViewController(rootViewController: bidVC)
        guard let pageVC = parent else { return }
        guard let auctionVC = pageVC.parent else { return }
        auctionVC.present(nav, animated: true) { button.isEnabled = true }
    }
}
