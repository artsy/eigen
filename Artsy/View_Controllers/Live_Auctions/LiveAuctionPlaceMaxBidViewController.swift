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
        bidButton.hideOnError = true

        updateLotInformation()
        updateCurrentBidInformation([])
        updateBiddingControls(bidViewModel.currentBid)

        bidViewModel.lotViewModel.newEventsSignal.subscribe(updateCurrentBidInformation)


        biddingProgressSignal.subscribe(biddingProgressUpdated)

        bidButtonViewModel.bidPendingSignal.subscribe(biddingProgressUpdated)

        view.layoutIfNeeded()

        let bottomSeparatorOverlapsBidButton = bidButton.center.y < lowerBiddingSeparatorView.center.y
        lowerBiddingSeparatorView.isHidden = bottomSeparatorOverlapsBidButton

        // Remove the two bars that denote the selection
        bidPicker.subviews.forEach { $0.isHidden = $0.frame.height == 0.5 }
    }

    @IBOutlet weak var setYourMaxBidLabel: UILabel!

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        let tinyScreen = view.bounds.height == 420
        if tinyScreen {
            setYourMaxBidLabel.font = UIFont.serifFont(withSize: 16)
        }
    }

    @IBOutlet weak var lotNumberLabel: UILabel!
    @IBOutlet weak var lotArtistLabel: UILabel!
    @IBOutlet weak var lotNameLabel: UILabel!
    @IBOutlet weak var lotPreviewImageView: UIImageView!

    fileprivate func updateLotInformation() {
        let lotVM = bidViewModel.lotViewModel
        lotNumberLabel.text = lotVM.formattedLotIndexDisplayString.uppercased()
        lotArtistLabel.text = lotVM.lotArtist
        lotNameLabel.text = lotVM.lotName
        if let url = lotVM.urlForProfile {
            lotPreviewImageView.ar_setImage(with: url)
        }
    }

    @IBOutlet weak var numberOfCurrentBidsLabel: UILabel!
    @IBOutlet weak var priceOfCurrentBidsLabel: UILabel!

    fileprivate func updateCurrentBidInformation(_: [LiveAuctionEventViewModel]) {
        numberOfCurrentBidsLabel.text = bidViewModel.currentBidsAndReserve
        priceOfCurrentBidsLabel.text = bidViewModel.currentLotAskingPriceString

        // New bids can come in while we are on this screen
        bidViewModel.currentBid = max(bidViewModel.currentBid, bidViewModel.currentAskingPrice)
        updateBiddingControls(bidViewModel.currentBid)

        shouldShowBiddingOverlay(false, maxBidder: bidViewModel.lotViewModel.userIsBeingSoldTo)
    }

    fileprivate func updateBiddingControls(_ bid: UInt64) {
        // TODO: Determine if bidding before updating the button?
        let bidProgress = LiveAuctionBiddingProgressState.biddable(askingPrice: bid, currencySymbol: bidViewModel.lotViewModel.currencySymbol)
        let bidState = LiveAuctionBidButtonState.active(biddingState: bidProgress)
        bidButtonViewModel.progressSignal.update(bidState)
    }

    // Incase you're new to storyboards, these views are on an associated
    // view ( its on the top bar for the scene. ) which can be hidden
    // https://blog.curtisherbert.com/secondary-views/ for info

    @IBOutlet var bidProgressOverlayView: LiveBidProgressOverlayView!

    fileprivate func biddingProgressUpdated(_ state: LiveAuctionBiddingProgressState) {
        let buttonState = LiveAuctionBidButtonState.active(biddingState: state)
        bidButtonViewModel.progressSignal.update(buttonState)

        bidProgressOverlayView.biddingProgressSignal.update(state)
        handleProgressViewVisibility(state)
    }

    fileprivate func handleProgressViewVisibility(_ state: LiveAuctionBiddingProgressState) {
        let shouldShowBidProgressView: Bool
        switch state {
        case .bidAcknowledged, .biddingInProgress, .bidFailed(_): shouldShowBidProgressView = true
        default: shouldShowBidProgressView = false
        }

        shouldShowBiddingOverlay(shouldShowBidProgressView)
    }

    fileprivate func shouldShowBiddingOverlay(_ show: Bool, maxBidder: Bool = false) {
        let showingBidProgressView = bidProgressOverlayView.superview != nil

        let addBidProgressView = !showingBidProgressView && show
        let removeBidProgressView = showingBidProgressView && !show

        if addBidProgressView {
            view.addSubview(bidProgressOverlayView)
            bidProgressOverlayView.alignTop("0", leading: "0", toView: view)
            bidProgressOverlayView.alignTrailingEdge(withView: view, predicate: "0")
            bidProgressOverlayView.constrainBottomSpace(toView: bidButton, predicate: "-20")
        }

        if removeBidProgressView {
            // We get a normal event for the outbid notification
            // which we can use to infer whether we won or not.

            let score: LiveAuctionBiddingProgressState =  maxBidder ? .bidBecameMaxBidder : .bidOutbid
            bidProgressOverlayView.biddingProgressSignal.update(score)
            bidButtonViewModel.progressSignal.update(.active(biddingState: score))

            ar_dispatch_after(2) {
                // maxBidder case handled independently, below.
                if maxBidder {
                    self.presentingViewController?.dismiss(animated: true, completion: nil)
                } else {
                    self.bidProgressOverlayView.removeFromSuperview()
                }
            }
        }
    }
}

extension LiveAuctionPlaceMaxBidViewController: UIPickerViewDataSource {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }

    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return self.bidViewModel.availableIncrements
    }
}

extension LiveAuctionPlaceMaxBidViewController: UIPickerViewDelegate {

    func pickerView(_ pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusing view: UIView?) -> UIView {
        let title = bidViewModel.bidIncrementStringAtIndex(row)
        if let titleLabel = view as? UILabel {
            titleLabel.text = title
            return titleLabel
        } else {
            let titleLabel = UILabel()
            titleLabel.font = .sansSerifFont(withSize: 30)
            titleLabel.textColor = .black
            titleLabel.text = title
            titleLabel.textAlignment = .center
            return titleLabel
        }
    }

    func pickerView(_ pickerView: UIPickerView, rowHeightForComponent component: Int) -> CGFloat {
        return 40
    }

    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        let bidAmount = bidViewModel.bidIncrementValueAtIndex(row)
        bidViewModel.currentBid = bidAmount
        updateBiddingControls(bidAmount)
    }
}


extension LiveAuctionPlaceMaxBidViewController: LiveAuctionBidButtonDelegate {

    func bidButtonRequestedBid(_ button: LiveAuctionBidButton) {
        bidViewModel.salesPerson.leaveMaxBidOnLot(bidViewModel.lotViewModel, amountCents: bidViewModel.currentBid, biddingViewModel:  bidButtonViewModel)
    }
}
