import UIKit
import Interstellar

class LiveAuctionPlaceMaxBidViewController: UIViewController {

    var bidViewModel: LiveAuctionBidViewModel!
    var bidButtonViewModel: LiveAuctionBiddingViewModelType!
    var biddingProgressSignal = Observable<LiveAuctionBiddingProgressState>()

    @IBOutlet weak var lowerBiddingSeparatorView: UIView!
    @IBOutlet weak var bidButton: LiveAuctionBidButton!
    @IBOutlet weak var bidPicker: UIPickerView!

    override func viewDidLoad() {
        super.viewDidLoad()

        bidButtonViewModel = bidButton.viewModel
        bidButton.delegate  = self
        bidButton.flashOutbidOnBiddableStateChanges = false

        updateLotInformation()
        updateCurrentBidInformation([])
        updateBiddingControls(bidViewModel.currentBid)

        bidViewModel.lotViewModel.newEventsSignal.subscribe(updateCurrentBidInformation)
        biddingProgressSignal.subscribe(biddingProgressUpdated)

        bidButtonViewModel.bidPendingSignal.subscribe(biddingProgressUpdated)

        view.layoutIfNeeded()

        let bottomSeparatorOverlapsBidButton = bidButton.center.y < lowerBiddingSeparatorView.center.y
        lowerBiddingSeparatorView.hidden = bottomSeparatorOverlapsBidButton

        // Remove the two bars that denote the selection
        bidPicker.subviews.forEach { $0.hidden = $0.frame.height == 0.5 }
    }

    @IBOutlet weak var setYourMaxBidLabel: UILabel!

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        let tinyScreen = view.bounds.height ?? 0 == 420
        if tinyScreen {
            setYourMaxBidLabel.font = UIFont.serifFontWithSize(16)
        }

        if bidViewModel.lotViewModel.userIsBeingSoldTo {
            // User is already the highest bidder, tell them so and Dismiss.
            showHighestBidderStatusAndDismiss()
        }
    }

    @IBOutlet weak var lotNumberLabel: UILabel!
    @IBOutlet weak var lotArtistLabel: UILabel!
    @IBOutlet weak var lotNameLabel: UILabel!
    @IBOutlet weak var lotPreviewImageView: UIImageView!

    private func updateLotInformation() {
        let lotVM = bidViewModel.lotViewModel
        lotNumberLabel.text = lotVM.formattedLotIndexDisplayString.uppercaseString
        lotArtistLabel.text = lotVM.lotArtist
        lotNameLabel.text = lotVM.lotName
        lotPreviewImageView.ar_setImageWithURL(lotVM.urlForProfile)
    }

    @IBOutlet weak var numberOfCurrentBidsLabel: UILabel!
    @IBOutlet weak var priceOfCurrentBidsLabel: UILabel!

    private func updateCurrentBidInformation(_: [LiveAuctionEventViewModel]) {
        numberOfCurrentBidsLabel.text = bidViewModel.currentBidsAndReserve
        priceOfCurrentBidsLabel.text = bidViewModel.currentLotValueString

        // New bids can come in while we are on this screen
        bidViewModel.currentBid = max(bidViewModel.currentBid, bidViewModel.currentLotValue)
        updateBiddingControls(bidViewModel.currentBid)

        shouldShowBiddingOverlay(false, maxBidder: bidViewModel.lotViewModel.userIsBeingSoldTo)
    }

    private func updateBiddingControls(bid: UInt64) {
        // TODO: Determine if bidding before updating the button?
        let bidProgress = LiveAuctionBiddingProgressState.Biddable(askingPrice: bid, currencySymbol: bidViewModel.lotViewModel.currencySymbol)
        let bidState = LiveAuctionBidButtonState.Active(biddingState: bidProgress)
        bidButtonViewModel.progressSignal.update(bidState)
    }

    // Incase you're new to storyboards, these views are on an associated
    // view ( its on the top bar for the scene. ) which can be hidden
    // https://blog.curtisherbert.com/secondary-views/ for info

    @IBOutlet var bidProgressOverlayView: LiveBidProgressOverlayView!

    private func biddingProgressUpdated(state: LiveAuctionBiddingProgressState) {
        let buttonState = LiveAuctionBidButtonState.Active(biddingState: state)
        bidButtonViewModel.progressSignal.update(buttonState)

        bidProgressOverlayView.biddingProgressSignal.update(state)
        handleProgressViewVisibility(state)
    }

    private func handleProgressViewVisibility(state: LiveAuctionBiddingProgressState) {
        let shouldShowBidProgressView: Bool
        switch state {
        case .BidAcknowledged, .BiddingInProgress: shouldShowBidProgressView = true
        default: shouldShowBidProgressView = false
        }

        shouldShowBiddingOverlay(shouldShowBidProgressView)
    }

    private func shouldShowBiddingOverlay(show: Bool, maxBidder: Bool = false) {
        let showingBidProgressView = bidProgressOverlayView.superview != nil

        let addBidProgressView = !showingBidProgressView && show
        let removeBidProgressView = showingBidProgressView && !show

        if addBidProgressView {
            view.addSubview(bidProgressOverlayView)
            bidProgressOverlayView.alignTop("0", leading: "0", toView: view)
            bidProgressOverlayView.alignTrailingEdgeWithView(view, predicate: "0")
            bidProgressOverlayView.constrainBottomSpaceToView(bidButton, predicate: "-20")
        }

        if removeBidProgressView {
            // We get a normal event for the outbid notification
            // which we can use to infer whether we won or not.

            let score: LiveAuctionBiddingProgressState =  maxBidder ? .BidBecameMaxBidder : .BidOutbid
            bidProgressOverlayView.biddingProgressSignal.update(score)
            bidButtonViewModel.progressSignal.update(.Active(biddingState: score))

            ar_dispatch_after(2) {
                // maxBidder case handled independently, below.
                if maxBidder {
                    self.presentingViewController?.dismissViewControllerAnimated(true, completion: nil)
                } else {
                    self.bidProgressOverlayView.removeFromSuperview()
                }
            }
        }
    }

    private func showHighestBidderStatusAndDismiss() {
        bidProgressOverlayView.biddingProgressSignal.update(.BidBecameMaxBidder)
        bidButtonViewModel.progressSignal.update(.Active(biddingState: .BidBecameMaxBidder))
        shouldShowBiddingOverlay(true, maxBidder: true)

        let exitButton = self.navigationItem.rightBarButtonItem?.customView as? UIButton
        exitButton?.enabled = false

        ar_dispatch_after(2) {
            self.presentingViewController?.dismissViewControllerAnimated(true, completion: nil)
        }
    }
}

extension LiveAuctionPlaceMaxBidViewController: UIPickerViewDataSource {
    func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
        return 1
    }

    func pickerView(pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return self.bidViewModel.availableIncrements
    }
}

extension LiveAuctionPlaceMaxBidViewController: UIPickerViewDelegate {

    func pickerView(pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusingView view: UIView?) -> UIView {
        let title = bidViewModel.bidIncrementStringAtIndex(row)
        if let titleLabel = view as? UILabel {
            titleLabel.text = title
            return titleLabel
        } else {
            let titleLabel = UILabel()
            titleLabel.font = .sansSerifFontWithSize(30)
            titleLabel.textColor = .blackColor()
            titleLabel.text = title
            titleLabel.textAlignment = .Center
            return titleLabel
        }
    }

    func pickerView(pickerView: UIPickerView, rowHeightForComponent component: Int) -> CGFloat {
        return 40
    }

    func pickerView(pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        let bidAmount = bidViewModel.bidIncrementValueAtIndex(row)
        bidViewModel.currentBid = bidAmount
        updateBiddingControls(bidAmount)
    }
}


extension LiveAuctionPlaceMaxBidViewController: LiveAuctionBidButtonDelegate {

    func bidButtonRequestedBid(button: LiveAuctionBidButton) {
        bidViewModel.salesPerson.leaveMaxBidOnLot(bidViewModel.lotViewModel, amountCents: bidViewModel.currentBid, biddingViewModel:  bidButtonViewModel)
    }
}
