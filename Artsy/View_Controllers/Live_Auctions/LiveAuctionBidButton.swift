import QuartzCore
import Interstellar
import Artsy_UIButtons

class LiveAuctionBidButton : ARFlatButton {
    let progressSignal = Signal<LiveAuctionBiddingProgressState>()

    override func setup() {
        super.setup()
        progressSignal.next(setupWithState)
    }

    private func setupWithState(state: LiveAuctionBiddingProgressState) {
        switch state {
        case .Idle(let price):
            setupUI("Bid \(price)", background: .blackColor())
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
    }

    private func setupUI(title: String, background: UIColor, border: UIColor? = nil, textColor: UIColor = UIColor.whiteColor() ) {
        setTitle(title.uppercaseString, forState: .Normal)
        setTitleColor(textColor, forState: .Normal)

        let borderColor = border ?? background
        setBorderColor(borderColor, forState: .Normal, animated: false)
        setBackgroundColor(background, forState: .Normal)
    }
}
