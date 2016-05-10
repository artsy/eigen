import UIKit
import Interstellar

enum LiveAuctionBiddingProgressState {
    case TrialUser
    case Biddable(askingPrice: UInt64)
    case BiddingInProgress
    case BidSuccess(isMaxBidder: Bool)
    case BidNetworkFail
    case LotWaitingToOpen
    case LotSold
}

class LiveAuctionBidViewModel: NSObject {
    let lotViewModel: LiveAuctionLotViewModelType
    let lotBidDetailsUpdateSignal = Observable<Int>()

    // This mutates as someone increments/decrements
    var currentBid: UInt64

    init(lotVM: LiveAuctionLotViewModelType) {
        self.lotViewModel = lotVM

        let startingPrice = lotViewModel.askingPriceSignal.peek() ?? UInt64(0)
        currentBid = LiveAuctionBidViewModel.nextBidCents(startingPrice)
    }

    var currentLotValue: UInt64 {
        return lotViewModel.currentLotValue
    }

    var currentLotValueString: String {
        return lotViewModel.currentLotValueString
    }

    var currentBidDollars: String {
        return currentBid.convertToDollarString()
    }

    var nextBidIncrementDollars: String {
        let bidIncrementCents = LiveAuctionBidViewModel.minimumNextBidCentsIncrement(currentBid)
        return bidIncrementCents.convertToDollarString()
    }

    var currentBidsAndReserve: String {
        let bids = lotViewModel.numberOfBids
        let bidString = bids == 1 ? "\(bids) bid" : "\(bids) bids"
        return "(\(bidString) \(lotViewModel.reserveStatusString))"
    }

    var canMakeLowerBids: Bool {
        return currentBid - LiveAuctionBidViewModel.minimumNextBidCentsIncrement(currentBid)  >= currentLotValue
    }

    // See: https://github.com/artsy/gravity/blob/master/app/models/bidding/increment_strategy/default.rb
    class func minimumNextBidCentsIncrement(bid: UInt64) -> UInt64 {
        switch bid {
        case 0...999_99: return 50_00
        case 100_000...199_999: return 100_00
        case 200_000...499_999: return 250_00
        case 500_000...999_999: return 500_00
        case 10_000_00...19_999_99: return 100_000
        case 20_000_00...49_999_99: return 200_000
        case 50_000_00...99_999_99: return 500_000
        case 100_000_00...1_000_000_000_00: return 10_000_00
        default: return bid
        }
    }

    class func nextBidCents(bid: UInt64) -> UInt64 {
        return bid + minimumNextBidCentsIncrement(bid)
    }

    class func previousBidCents(bid: UInt64) -> UInt64 {
        return bid - minimumNextBidCentsIncrement(bid)
    }
}

class LiveAuctionBidViewController: UIViewController {

    var bidViewModel: LiveAuctionBidViewModel!
    var bidButtonViewModel: LiveAuctionBiddingViewModelType!
    var biddingProgressSignal = Observable<LiveAuctionBiddingProgressState>()

    @IBOutlet weak var lowerBiddingSeparatorView: UIView!
    @IBOutlet weak var bidButton: LiveAuctionBidButton!

    override func viewDidLoad() {
        super.viewDidLoad()

        bidButtonViewModel = bidButton.viewModel

        updateLotInformation()
        updateCurrentBidInformation(NSDate())
        updateBiddingControls(bidViewModel.currentBid)

        bidViewModel.lotViewModel.endEventUpdatesSignal.subscribe(updateCurrentBidInformation)
        biddingProgressSignal.subscribe(biddingProgressUpdated)

        view.layoutIfNeeded()
        let bottomSeparatorOverlapsBidButton = bidButton.center.y < lowerBiddingSeparatorView.center.y
        lowerBiddingSeparatorView.hidden = bottomSeparatorOverlapsBidButton
    }

    @IBOutlet weak var lotNumberLabel: UILabel!
    @IBOutlet weak var lotArtistLabel: UILabel!
    @IBOutlet weak var lotNameLabel: UILabel!
    @IBOutlet weak var lotPreviewImageView: UIImageView!

    private func updateLotInformation() {
        let lotVM = bidViewModel.lotViewModel
        lotNumberLabel.text = lotVM.lotIndexDisplayString.uppercaseString
        lotArtistLabel.text = lotVM.lotArtist
        lotNameLabel.text = lotVM.lotName
        lotPreviewImageView.ar_setImageWithURL(lotVM.urlForProfile)
    }

    @IBOutlet weak var numberOfCurrentBidsLabel: UILabel!
    @IBOutlet weak var priceOfCurrentBidsLabel: UILabel!

    private func updateCurrentBidInformation(_: NSDate) {
        numberOfCurrentBidsLabel.text = bidViewModel.currentBidsAndReserve
        priceOfCurrentBidsLabel.text = bidViewModel.currentLotValueString

        // New bids can come in while we are on this screen
        bidViewModel.currentBid = max(bidViewModel.currentBid, bidViewModel.currentLotValue)
        updateBiddingControls(bidViewModel.currentBid)
    }

    @IBOutlet weak var decreaseBidButton: UIButton!
    @IBOutlet weak var increaseBidButton: UIButton!
    @IBOutlet weak var currentBidLabel: UILabel!
    @IBOutlet weak var currentIncrementLabel: UILabel!

    private func updateBiddingControls(bid: UInt64) {
        decreaseBidButton.enabled = bidViewModel.canMakeLowerBids

        currentIncrementLabel.text = "Increments of \(bidViewModel.nextBidIncrementDollars)"
        currentBidLabel.text = bidViewModel.currentBidDollars

        /// TODO: Determine if bidding before updating the button?
        let bidProgress = LiveAuctionBiddingProgressState.Biddable(askingPrice: bid)
        let bidState = LiveAuctionBidButtonState.Active(biddingState: bidProgress)
        bidButtonViewModel.progressSignal.update(bidState)
    }

    @IBAction func incrementBid(sender: AnyObject) {
        bidViewModel.currentBid = LiveAuctionBidViewModel.nextBidCents(bidViewModel.currentBid)
        updateBiddingControls(bidViewModel.currentBid)
    }

    @IBAction func decrementBid(sender: AnyObject) {
        bidViewModel.currentBid = LiveAuctionBidViewModel.previousBidCents(bidViewModel.currentBid)
        updateBiddingControls(bidViewModel.currentBid)
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
        let showingBidProgressView = bidProgressOverlayView.superview != nil
        let shouldShowBidProgressView: Bool

        switch state {
        case .Biddable, .TrialUser: shouldShowBidProgressView = false
        default: shouldShowBidProgressView = true
        }

        let addBidProgressView = !showingBidProgressView && shouldShowBidProgressView
        let removeBidProgressView = showingBidProgressView && !shouldShowBidProgressView

        if addBidProgressView {
            view.addSubview(bidProgressOverlayView)
            bidProgressOverlayView.alignTop("0", leading: "0", toView: view)
            bidProgressOverlayView.alignTrailingEdgeWithView(view, predicate: "0")
            bidProgressOverlayView.constrainBottomSpaceToView(bidButton, predicate: "-20")
        }

        if removeBidProgressView {
            bidProgressOverlayView.removeFromSuperview()
        }
    }
}
