import QuartzCore
import Interstellar
import Artsy_UIButtons

enum LiveAuctionBidButtonState {
    case Active(biddingState: LiveAuctionBiddingProgressState)
    case InActive(lotState: LotState)
}

class LiveAuctionBidButton : ARFlatButton {
    let progressSignal = Signal<LiveAuctionBidButtonState>()

    override func setup() {
        super.setup()
        progressSignal.next(setupWithState)
    }

    private func setupWithState(buttonState: LiveAuctionBidButtonState) {

        switch buttonState {
        // When the lot is live
        case .Active(let state):

            switch state {
            case .Idle(let price):
                setupUI("Bid \(price)")
            case .InProgress:
                setupUI("Bidding...", background: .artsyPurpleRegular())
            case .Success(let outbid):
                if outbid {
                    setupUI("Outbid", background: .artsyRedRegular())
                } else {
                    setupUI("You're the highest bidder", background: .whiteColor(), border: .artsyGreenRegular(), textColor: .artsyGreenRegular() )
                }

            case .NetworkFail:
                setupUI("Network Failed", background: .whiteColor(), border: .artsyGreenRegular(), textColor: .artsyGreenRegular() )
            }


        // When the lot is not live
        case .InActive(let state):
            switch state {
                case .ClosedLot:
                    setupUI("Bidding Closed")
                case .LiveLot: break // Should never happen, as it'd be handled above
                case .UpcomingLot(_):
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
}
