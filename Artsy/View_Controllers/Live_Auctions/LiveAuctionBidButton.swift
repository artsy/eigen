import QuartzCore
import Interstellar
import Artsy_UIButtons

enum LiveAuctionBidButtonState {
    case Active(biddingState: LiveAuctionBiddingProgressState)
    case InActive(lotState: LotState)
}

@objc protocol LiveAuctionBidButtonDelegate {
    optional func bidButtonRequestedRegisterToBid(button: LiveAuctionBidButton)
    optional func bidButtonRequestedBid(button: LiveAuctionBidButton)
    optional func bidButtonRequestedSubmittingMaxBid(button: LiveAuctionBidButton)
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
                delegate?.bidButtonRequestedRegisterToBid?(self)
            case .Biddable:
                delegate?.bidButtonRequestedBid?(self)

            default: break
            }

        case .InActive(let lotState):
            switch lotState {
            case .UpcomingLot:
                delegate?.bidButtonRequestedSubmittingMaxBid?(self)

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
                let formattedPrice = price.convertToDollarString(currencySymbol)
                setupUI("Bid \(formattedPrice)")
                enabled = true
            case .BiddingInProgress:
                setupUI("Bidding...", background: purple)
            case .BidSuccess(let isMaxBidder):
                if isMaxBidder {
                    setupUI("You're the highest bidder", background: .whiteColor(), border: green, textColor: green)
                } else {
                    setupUI("Outbid", background: red)
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
                setupUI("Set Max Bid")
            }
        }
    }

    private func setupUI(title: String, background: UIColor = .blackColor(), border: UIColor? = nil, textColor: UIColor = UIColor.whiteColor() ) {
        [UIControlState.Normal, .Disabled].forEach { state in
            setTitle(title.uppercaseString, forState: state)
            setTitleColor(textColor, forState: state)

            let borderColor = border ?? background
            setBorderColor(borderColor, forState: state, animated: false)
            setBackgroundColor(background, forState: state)
        }

    }

    override func intrinsicContentSize() -> CGSize {
        return CGSize(width: 48, height: 40);
    }
}
