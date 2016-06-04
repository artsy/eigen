import QuartzCore
import Interstellar
import Artsy_UIButtons

enum LiveAuctionBidButtonState: Equatable {
    case Active(biddingState: LiveAuctionBiddingProgressState)
    case InActive(lotState: LotState)
}

func == (lhs: LiveAuctionBidButtonState, rhs: LiveAuctionBidButtonState) -> Bool {
    switch (lhs, rhs) {
    case (.Active(let lhsBiddingState), .Active(let rhsBiddingState)) where lhsBiddingState == rhsBiddingState: return true
    case (.InActive(let lhsLotState), .InActive(let rhsLotState)) where lhsLotState == rhsLotState: return true
    default: return false
    }
}

@objc protocol LiveAuctionBidButtonDelegate {
    optional func bidButtonRequestedRegisterToBid(button: LiveAuctionBidButton)
    optional func bidButtonRequestedBid(button: LiveAuctionBidButton)
    optional func bidButtonRequestedSubmittingMaxBid(button: LiveAuctionBidButton)
}

class LiveAuctionBidButton: ARFlatButton {
    var viewModel: LiveAuctionBiddingViewModelType
    var outbidNoticeDuration: NSTimeInterval = 1

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

    override func intrinsicContentSize() -> CGSize {
        return CGSize(width: 48, height: 40)
    }

    override func setup() {
        super.setup()
        shouldDimWhenDisabled = false
        setContentCompressionResistancePriority(1000, forAxis: .Vertical)
        addTarget(self, action: #selector(tappedBidButton), forControlEvents: .TouchUpInside)
        viewModel.progressSignal.subscribe(attemptSetupWithState)
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


    private var _previousButtonState: LiveAuctionBidButtonState?
    private var _outbidAnimationIsInProgress = false
    private var _mostRecentlyReceivedButtonStateDuringAnimation: LiveAuctionBidButtonState?

    private func attemptSetupWithState(buttonState: LiveAuctionBidButtonState) {
        // We want to update our _previousButtonState if it is distinct from our new buttonState.
        defer {
            switch _previousButtonState {
            case .None:
                _previousButtonState = buttonState
            case .Some(let previousButtonState) where previousButtonState != buttonState:
                _previousButtonState = buttonState
            default: break
            }
        }

        // If our outbid animation is in progress, we want to skip the new update, but keep track
        // of the button state so we can use it after the animation completes.
        guard _outbidAnimationIsInProgress == false else {
            _mostRecentlyReceivedButtonStateDuringAnimation = buttonState
            return
        }

        // If, during our outbid animation, we received a buttonState, we're going to use _that_ state
        // instead of the state we had when we started the animation.
        // Example: User is highest bidder, then gets sniped. During the outbid animation, the lot closes (improbable, but possible!).
        //          This would keep track of the .InActive button state and use that when the animation is completed.
        if let mostRecentlyReceivedButtonStateDuringAnimation = _mostRecentlyReceivedButtonStateDuringAnimation {
            _mostRecentlyReceivedButtonStateDuringAnimation = nil
            attemptSetupWithState(mostRecentlyReceivedButtonStateDuringAnimation)
            return
        }

        setupWithState(buttonState)
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

    private func setupWithState(buttonState: LiveAuctionBidButtonState) {
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
                handleBiddable(buttonState, formattedPrice: formattedPrice)

            case .BiddingInProgress:
                setupUI("Bidding...", background: purple)
            case .BidSuccess:
                setupUI("You're the highest bidder", background: .whiteColor(), border: green, textColor: green)

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

    private func handleBiddable(buttonState: LiveAuctionBidButtonState, formattedPrice: String) {
        // First we check to see if our previous button state was "I'm the highest bidder" and now
        // our state is "I'm Biddable", then we infer the user got outbid. Let's present a nice animation.
        if let previousButtonState = _previousButtonState,
            case .Active(let previousState) = previousButtonState,
                 case .BidSuccess = previousState {
            // User was previously the highest bidder but has been outbid

            _outbidAnimationIsInProgress = true
            enabled = false
            UIView.animateIf(Bool(ARPerformWorkAsynchronously), duration: ARAnimationQuickDuration, {
                self.setupUI("Outbid", background: red)
                }, completion: { _ in
                    // Note: we're not using ar_dispatch_after because if the completion and dispatch_after blocks are run synchronously, we'll get a stack overflow 😬
                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self.outbidNoticeDuration * Double(NSEC_PER_SEC)))
                    dispatch_after(time, dispatch_get_main_queue(), { [weak self] in
                        self?.enabled = true
                        self?._outbidAnimationIsInProgress = false
                        self?.attemptSetupWithState(buttonState) // Once the animation is complete, try to re-apply our original button state.
                    })
            })
        } else {
            setupUI("Bid \(formattedPrice)")
            enabled = true
        }
    }
}


private let white = UIColor.whiteColor()
private let purple = UIColor.artsyPurpleRegular()
private let green = UIColor.artsyGreenRegular()
private let red = UIColor.artsyRedRegular()
private let grey = UIColor.artsyGrayRegular()
