import UIKit
import Interstellar

enum LiveAuctionBiddingProgressState {
    case Idle(biddingAmount: String)
    case InProgress
    case Success(isMaxBidder: Bool)
    case NetworkFail
}

class LiveAuctionBidViewModel: NSObject {
    let lotViewModel: LiveAuctionLotViewModelType
    let lotBidDetailsUpdateSignal = Signal<Int>()

    var currentBid: Int

    init(lotVM: LiveAuctionLotViewModelType) {
        self.lotViewModel = lotVM

        let startingPrice = lotViewModel.askingPriceSignal.peek() ?? 0
        currentBid = LiveAuctionBidViewModel.nextBidCents(startingPrice)
    }

    var currentLotValue: String {
        return lotViewModel.currentLotValue
    }

    var nextBidIncrementDollars: String {
        let bidIncrementCents = LiveAuctionBidViewModel.minimumNextBidCentsIncrement(lotViewModel.askingPriceSignal.peek() ?? 0 )
        return bidIncrementCents.roundCentsToNearestThousandAndFormat()
    }

    var currentBidsAndReserve: String {
        let bids = lotViewModel.numberOfBids
        let bidString = bids == 1 ? "\(bids) bid" : "\(bids) bids"
        return "(\(bidString) \(lotViewModel.reserveStatusString))"
    }

    // See: https://github.com/artsy/gravity/blob/master/app/models/bidding/increment_strategy/default.rb
    class func minimumNextBidCentsIncrement(bid: Int) -> Int {
        switch bid {
        case 0...999_99: return 50_00
        case 100_000...199_999: return 100_00
        case 200_000...499_999: return 250_00
        case 500_000...999_999: return 500_00
        case 10_000_00...19_999_99: return 100_000
        case 20_000_00...49_999_99: return 200_000
        case 50_000_00...99_999_99: return 500_000
        case 100_000_00...100_000_000_000_00: return 10_000_00
        default: return bid
        }
    }

    class func nextBidCents(bid: Int) -> Int {
        return bid + minimumNextBidCentsIncrement(bid)
    }
}

class LiveAuctionBidViewController: UIViewController {

    var bidViewModel: LiveAuctionBidViewModel!

    @IBOutlet weak var lowerBiddingSeparatorView: UIView!
    @IBOutlet weak var bidButton: LiveAuctionBidButton!

    override func viewDidLoad() {
        super.viewDidLoad()

        updateLotInformation()

        bidViewModel.lotViewModel.endEventUpdatesSignal.next(updateCurrentBidInformation)

        // TODO: Handle lot bidding ending
        // bidViewModel.lotViewModel.endEventUpdatesSignal

        view.layoutIfNeeded()
        let bottomSeparatorOverlapsBidButton = bidButton.center.y < lowerBiddingSeparatorView.center.y
        lowerBiddingSeparatorView.hidden = bottomSeparatorOverlapsBidButton
    }

    @IBOutlet weak var lotNumberLabel: UILabel!
    @IBOutlet weak var lotArtistLabel: UILabel!
    @IBOutlet weak var lotNameLabel: UILabel!
    @IBOutlet weak var lotPreviewImageView: UIImageView!

    func updateLotInformation() {
        let lotVM = bidViewModel.lotViewModel
        lotNumberLabel.text = "LOT \(lotVM.lotIndex)"
        lotArtistLabel.text = lotVM.lotArtist
        lotNameLabel.text = lotVM.lotName
        lotPreviewImageView.ar_setImageWithURL(lotVM.urlForProfile)
    }

    @IBOutlet weak var numberOfCurrentBidsLabel: UILabel!
    @IBOutlet weak var priceOfCurrentBidsLabel: UILabel!

    func updateCurrentBidInformation(_: NSDate) {
        numberOfCurrentBidsLabel.text = bidViewModel.currentBidsAndReserve
        priceOfCurrentBidsLabel.text = bidViewModel.currentLotValue
    }

    @IBOutlet weak var decreaseBidButton: UIButton!
    @IBOutlet weak var increaseBidButton: UIButton!
    @IBOutlet weak var currentBidLabel: UILabel!
    @IBOutlet weak var currentIncrementLabel: UILabel!

    func updateBiddingControls() {
        let lotVM = bidViewModel.lotViewModel

        currentIncrementLabel.text = "Increments of \(bidViewModel.nextBidIncrementDollars)"

        /// TODO: Determine if bidding before updating the button?

        let currentBidDollars = lotVM.currentLotValue
        currentBidLabel.text = currentBidDollars

//        let buttonProgress = LiveAuctionBiddingProgressState.Idle(biddingAmount: currentBidDollars)
//        bidButton.progressSignal.update(buttonProgress)

        

    }
}
