import UIKit
import Interstellar

class LiveBidProgressOverlayView: UIView {

    var biddingProgressSignal = Observable<LiveAuctionBiddingProgressState>()

    @IBOutlet weak var bidProgressImageView: UIImageView!
    @IBOutlet weak var bidProgressTitleLabel: UILabel!
    @IBOutlet weak var bidProgressSubtitleLabel: UILabel!

    override func awakeFromNib() {
        super.awakeFromNib()
        biddingProgressSignal.subscribe(biddingProgressUpdated)
    }

    fileprivate func biddingProgressUpdated(_ state: LiveAuctionBiddingProgressState) {

        let purple = UIColor.artsyPurpleRegular()!
        let green = UIColor.artsyGreenRegular()!
        let red = UIColor.artsyRedRegular()!
        let black = UIColor.black

        switch state {
        case .biddable, .userRegistrationRequired, .userRegistrationClosed, .userRegistrationPending: break
        case .lotSold:
            setupProgressUI("Sold", subtitle:"The Lot has finished", textColor: red, image: .LiveAuctionOutbidWarningIcon)

        case .bidOutbid:
            setupProgressUI("", textColor: red, image: .LiveAuctionOutbidWarningIcon)

        case .lotWaitingToOpen:
            // Hrm, is this a possible state for it to get to?
            setupProgressUI("Lot waiting to Open", textColor: purple, image: .LiveAuctionSpinner)

        case .biddingInProgress:
            setupProgressUI("Placing Bid", textColor: purple, image: .LiveAuctionSpinner, spinImage: true)

        case .bidAcknowledged:
            // TODO: this needs to keep track of the previous bidding state
            setupProgressUI("Bid Placed", textColor: green, image: .LiveAuctionMaxBidIcon)

        case .bidNotYetAccepted:
            setupProgressUI("Bid Placed", textColor: black, image: .LiveAuctionMaxBidIcon)

        case .bidNetworkFail:
            setupProgressUI("Connection Issues", subtitle: "Please check your signal strength", textColor: red, image: .LiveAuctionOutbidWarningIcon)

        case .bidFailed(let reason):
            setupProgressUI("Error", subtitle: errorCodeToHumanReadable(reason), textColor: red, image: .LiveAuctionOutbidWarningIcon)

        case .bidBecameMaxBidder:
            setupProgressUI("", textColor: green, image: .LiveAuctionMaxBidIcon)
        }
    }

    // WinningBidCanOnlyBeIncreased ->  Winning bid can only be increased
    func errorCodeToHumanReadable(_ errorMessage: String) -> String {
        var newString: String = ""

        let upperCase = CharacterSet.uppercaseLetters
        for scalar in errorMessage.unicodeScalars {
            if upperCase.contains(scalar) {
                newString.append(" ")
            }
            let character = Character(scalar)
            newString.append(character)
        }

        var trimmed = newString.trimmingCharacters(in: .whitespaces)
        let first = trimmed.remove(at: newString.startIndex)
        return String(first).uppercased() + trimmed.lowercased()
    }

    fileprivate func setupProgressUI(_ title: String, subtitle: String = "", textColor: UIColor, image: UIImage.Asset, spinImage: Bool = false) {
        bidProgressTitleLabel.text = title.uppercased()
        bidProgressSubtitleLabel.text = subtitle

        bidProgressTitleLabel.textColor = textColor
        bidProgressSubtitleLabel.textColor = textColor

        bidProgressImageView.image = UIImage(asset: image)

        // Only spin in prod
        let animate = spinImage && ARPerformWorkAsynchronously.boolValue
        if animate {
            bidProgressImageView.ar_startSpinningIndefinitely()
        } else {
            bidProgressImageView.ar_stopSpinningInstantly(true)
        }
    }

}
