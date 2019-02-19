import QuartzCore
import Interstellar

enum LiveAuctionBidButtonState: Equatable {
    case active(biddingState: LiveAuctionBiddingProgressState)
    case inActive(lotState: LotState)
}

func == (lhs: LiveAuctionBidButtonState, rhs: LiveAuctionBidButtonState) -> Bool {
    switch (lhs, rhs) {
    case (.active(let lhsBiddingState), .active(let rhsBiddingState)) where lhsBiddingState == rhsBiddingState: return true
    case (.inActive(let lhsLotState), .inActive(let rhsLotState)) where lhsLotState == rhsLotState: return true
    default: return false
    }
}

@objc protocol LiveAuctionBidButtonDelegate {
    @objc optional func bidButtonRequestedRegisterToBid(_ button: LiveAuctionBidButton)
    @objc optional func bidButtonRequestedBid(_ button: LiveAuctionBidButton)
    @objc optional func bidButtonRequestedSubmittingMaxBid(_ button: LiveAuctionBidButton)
}

class LiveAuctionBidButton: ARFlatButton {
    var viewModel: LiveAuctionBiddingViewModelType

    // On the lotVC we want to indicate being outbid
    // but on the max-bid modal we don't.
    var flashOutbidOnBiddableStateChanges = true

    // Used almost exclusively in testing
    var outbidNoticeAnimationComplete: () -> Void = {}
    var outbidNoticeDuration: TimeInterval = 1
    let spinner = ARSpinner()

    /// When in a max-bid overlay we want to hide the button
    /// during an error, but when live-bidding we need it to
    /// show some kind of error message
    var hideOnError: Bool = false

    @IBOutlet weak var delegate: LiveAuctionBidButtonDelegate?

    init(viewModel: LiveAuctionBiddingViewModelType) {
        self.viewModel = viewModel

        super.init(frame: CGRect.zero)
    }

    required init?(coder aDecoder: NSCoder) {
        // This is an acceptable default, it can be replaced before added to a view and setup() getting called.
        viewModel = LiveAuctionLeaveMaxBidButtonViewModel()
        super.init(coder: aDecoder)
    }

    override var intrinsicContentSize : CGSize {
        return CGSize(width: 48, height: 40)
    }

    override func setup() {
        super.setup()
        shouldDimWhenDisabled = false
        setContentCompressionResistancePriority(UILayoutPriority(rawValue: 1000), for: .vertical)
        addTarget(self, action: #selector(tappedBidButton), for: .touchUpInside)
        viewModel.progressSignal.subscribe(attemptSetupWithState)
        viewModel.bidPendingSignal.subscribe(updateForBidProgress)

        spinner.frame.size = CGSize(width: 44, height: 44)
        spinner.spinnerColor = .white
    }

    @objc func tappedBidButton() {
        guard let state = viewModel.progressSignal.peek() else { return }
        switch state {
        case .active(let bidState):
            switch bidState {

            case .userRegistrationRequired:
                delegate?.bidButtonRequestedRegisterToBid?(self)
            case .biddable:
                delegate?.bidButtonRequestedBid?(self)

            default: break
            }

        case .inActive(let lotState):
            switch lotState {
            case .upcomingLot:
                delegate?.bidButtonRequestedSubmittingMaxBid?(self)

            default: break
            }
        }

        isEnabled = false
    }


    fileprivate var _previousButtonState: LiveAuctionBidButtonState?
    fileprivate var _outbidAnimationIsInProgress = false
    fileprivate var _mostRecentlyReceivedButtonStateDuringAnimation: LiveAuctionBidButtonState?

    fileprivate func attemptSetupWithState(_ buttonState: LiveAuctionBidButtonState) {
        // We want to update our _previousButtonState if it is distinct from our new buttonState.
        defer {
            switch _previousButtonState {
            case .none:
                _previousButtonState = buttonState
            case .some(let previousButtonState) where previousButtonState != buttonState:
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

    fileprivate func setupUI(_ title: String, background: UIColor = .black, border: UIColor? = nil, textColor: UIColor = UIColor.white, applySpinAnimation: Bool = false, hideButton: Bool = false) {
        [UIControl.State.normal, .disabled].forEach { state in

            setAttributedTitle(NSAttributedString(string: title, attributes: [NSAttributedString.Key.foregroundColor: textColor]), for: state)

            let borderColor = border ?? background
            setBorderColor(borderColor, for: state, animated: false)
            setBackgroundColor(background, for: state)
        }

        self.isHidden = hideButton

        if applySpinAnimation {
            addSubview(spinner)
            spinner.alignCenter(withView: self)
            spinner.fadeIn(animated: false)
        } else {
            self.spinner.removeFromSuperview()
        }
    }

    fileprivate func setupWithState(_ buttonState: LiveAuctionBidButtonState) {
        let highestBidderSetup = {
            self.setupUI("You're the highest bidder", background: .white, border: green, textColor: green)
        }

        switch buttonState {

        // When the lot is live
        case .active(let state):
            switch state {
            case .userRegistrationRequired:
                setupUI("Register To Bid")
                isEnabled = true

            case .userRegistrationPending:
                setupUI("Registration Pending")
                isEnabled = false

            case .userRegistrationClosed:
                setupUI("Registration Closed")
                isEnabled = false

            case .lotSold:
                setupUI("Sold", background: .white, border: purple, textColor: purple)
            case .lotWaitingToOpen:
                setupUI("Waiting for Auctioneer…", background: white, border: grey, textColor: grey)

            case .biddable(let price, let currencySymbol):
                let formattedPrice = price.convertToDollarString(currencySymbol)
                handleBiddable(buttonState, formattedPrice: formattedPrice)

            case .biddingInProgress:
                setupUI("", background: purple, applySpinAnimation: ARPerformWorkAsynchronously.boolValue)

            case .bidNotYetAccepted(let price, let currencySymbol):
                let formattedPrice = price.convertToDollarString(currencySymbol)
                setupUI("Bid \(formattedPrice)", background: greyMedium, border: greyMedium, textColor: white)

            case .bidBecameMaxBidder, .bidAcknowledged:
                // If the bid has been acknowledged, we'll be the max bidder until the next Biddable state, even if that's directly following this one.
                highestBidderSetup()

            case .bidNetworkFail:
                setupUI("Network Failed", background: .white, border: red, textColor: red)

            case .bidFailed(_):
                setupUI("An Error Occurred", background: red, border: .white, textColor: .white, hideButton: hideOnError)
                // Show an error message for 2s then switch back to the previous (biddable) state
                ar_dispatch_after(2) {
                    if (!self.hideOnError) {
                        self.setupWithState(self._previousButtonState!)
                    }
                }

            case .bidOutbid:
                self.setupUI("Outbid", background: red)
            }


        // When the lot is not live
        case let .inActive(state):
            switch state {
            case .closedLot(let wasPassed):
                if wasPassed {
                    setupUI("Lot Closed", background: .white, border: passedGrey, textColor: passedGrey)
                } else {
                    setupUI("Sold", background: .white, border: purple, textColor: purple)
                }
                isEnabled = false
            case .liveLot: break // Should never happen, as it'd be handled above
            case .upcomingLot(let isHighestBidder):
                isEnabled = true
                if isHighestBidder {
                    setupUI("Raise Bid")
                } else {
                    setupUI("Bid")
                }
            }
        }
    }

    fileprivate func handleBiddable(_ buttonState: LiveAuctionBidButtonState, formattedPrice: String) {
        // First we check to see if our previous button state was "I'm the highest bidder" and now
        // our state is "I'm Biddable", then we infer the user got outbid. Let's present a nice animation.

        let skipAnimation = {
            self.setupUI("Bid \(formattedPrice)")
            self.isEnabled = true
        }

        if  let previousButtonState = _previousButtonState,
            case .active(let previousState) = previousButtonState {

            switch previousState {
            case .bidBecameMaxBidder, .bidNotYetAccepted:
                if !flashOutbidOnBiddableStateChanges { return }
                // User was previously the highest bidder but has been outbid

                _outbidAnimationIsInProgress = true
                isEnabled = false
                UIView.animateIf(ARPerformWorkAsynchronously.boolValue, duration: ARAnimationQuickDuration, {
                    self.setupWithState(.active(biddingState: .bidOutbid))
                }, completion: { _ in
                    // Note: we're not using ar_dispatch_after because if the completion and dispatch_after blocks are run synchronously, we'll get a stack overflow 😬
                    let time = DispatchTime.now() + Double(Int64(self.outbidNoticeDuration * Double(NSEC_PER_SEC))) / Double(NSEC_PER_SEC)
                    DispatchQueue.main.asyncAfter(deadline: time, execute: { [weak self] in
                        self?.isEnabled = true
                        self?._outbidAnimationIsInProgress = false
                        self?.attemptSetupWithState(buttonState) // Once the animation is complete, try to re-apply our original button state.
                        self?.outbidNoticeAnimationComplete()
                    })
                })

            default:
                skipAnimation()
            }
        } else {
            skipAnimation()
        }
    }

    fileprivate func updateForBidProgress(_ state: LiveAuctionBiddingProgressState) {
        setupWithState(.active(biddingState: state))
    }
}


private let white = UIColor.white
private let purple = UIColor.artsyPurpleRegular()!
private let green = UIColor.artsyGreenRegular()!
private let red = UIColor.artsyRedRegular()!
private let grey = UIColor.artsyGrayRegular()!
private let greyMedium = UIColor.artsyGrayMedium()!
private let passedGrey = UIColor(white: 0, alpha: 0.5)
