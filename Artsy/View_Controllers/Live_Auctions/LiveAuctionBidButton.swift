import QuartzCore
import Interstellar
import Artsy_UIButtons

enum LiveAuctionBidButtonState {
    case Active(biddingState: LiveAuctionBiddingProgressState)
    case InActive(lotState: LotState)
}

@objc protocol LiveAuctionBidButtonDelegate {
    func bidButtonRequestedRegisterToBid(button: LiveAuctionBidButton)
    func bidButtonRequestedBid(button: LiveAuctionBidButton)
    func bidButtonRequestedSubmittingMaxBid(button: LiveAuctionBidButton)
}

class LiveAuctionBidButton : ARFlatButton {
    var viewModel: LiveAuctionBiddingViewModelType
    
    @IBOutlet var delegate: LiveAuctionBidButtonDelegate?

    init(viewModel: LiveAuctionBiddingViewModelType) {
        self.viewModel = viewModel

        super.init(frame: CGRect.zero)
    }
    
    required init?(coder aDecoder: NSCoder) {
        // This is an acceptable default, it can be replaced before added to a view and setup() getting called.
        viewModel = LiveAuctionLeaveMaxBidButtonViewModel()
        super.init(coder: aDecoder)
    }

    override func setup() {
        super.setup()
        setContentCompressionResistancePriority(1000, forAxis: .Vertical)
        addTarget(self, action: #selector(tappedBidButton), forControlEvents: .TouchUpInside)
        viewModel.progressSignal.subscribe(setupWithState)
    }

    func tappedBidButton() {
        guard let state = viewModel.progressSignal.peek() else { return }
        switch state {
        case .Active(let bidState):
            switch bidState {

            case .TrialUser:
                delegate?.bidButtonRequestedRegisterToBid(self)
            case .Biddable:
                delegate?.bidButtonRequestedBid(self)

            default: break
            }

        case .InActive(let lotState):
            switch lotState {
            case .UpcomingLot:
                delegate?.bidButtonRequestedSubmittingMaxBid(self)

            default: break
            }
        }

        enabled = false
    }

    private func setupWithState(buttonState: LiveAuctionBidButtonState) {

        let white = UIColor.whiteColor()
        let purple = UIColor.artsyPurpleRegular()
        let green = UIColor.artsyGreenRegular()
        let red = UIColor.artsyRedRegular()
        let grey = UIColor.artsyGrayRegular()


        switch buttonState {
        // When the lot is live
        case .Active(let state):

            switch state {
            case .TrialUser:
                setupUI("Register To Bid")
                enabled = true
            case .LotSold:
                setupUI("Sold", background: .whiteColor(), border: purple, textColor: purple)
            case .LotWaitingToOpen:
                setupUI("Waiting for Auctioneer…", background: white, border: grey, textColor: grey)

            case .Biddable(let price, let currencySymbol):
                SaleArtwork.dollarsFromCents(NSNumber(unsignedLongLong: price), currencySymbol: currencySymbol)
                let formattedPrice = NSNumberFormatter.currencyStringForDollarCents(NSNumber(unsignedLongLong: price))
                setupUI("Bid \(formattedPrice)")
                enabled = true
            case .BiddingInProgress:
                setupUI("Bidding...", background: purple)
            case .BidSuccess(let outbid):
                if outbid {
                    setupUI("Outbid", background: red)
                } else {
                    setupUI("You're the highest bidder", background: .whiteColor(), border: green, textColor: green)
                }

            case .BidNetworkFail:
                setupUI("Network Failed", background: .whiteColor(), border: red, textColor: red)
            }


        // When the lot is not live
        case .InActive(let state):
            switch state {
            case .ClosedLot:
                setupUI("Bidding Closed")
                enabled = false
            case .LiveLot: break // Should never happen, as it'd be handled above
            case .UpcomingLot:
                enabled = true
                setupUI("Leave Max Bid")
            }
        }
    }

    private func setupUI(title: String, background: UIColor = .blackColor(), border: UIColor? = nil, textColor: UIColor = UIColor.whiteColor() ) {
        setTitle(title.uppercaseString, forState: .Normal)
        setTitleColor(textColor, forState: .Normal)

        let borderColor = border ?? background
        setBorderColor(borderColor, forState: .Normal, animated: false)
        setBackgroundColor(background, forState: .Normal)
    }

    override func intrinsicContentSize() -> CGSize {
        return CGSize(width: 48, height: 40);
    }
}
