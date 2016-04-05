import UIKit

enum LiveAuctionBiddingProgressState {
    case Idle(biddingAmount: String)
    case InProgress
    case Success(isMaxBidder: Bool)
    case NetworkFail
}

class LiveAuctionBidViewController: UIViewController {

    @IBOutlet weak var bidButton: UIButton!
    @IBOutlet weak var lowerBiddingSeparatorView: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()

        view.layoutIfNeeded()
        let bottomSeparatorOvelapsBidButton = bidButton.center.y < lowerBiddingSeparatorView.center.y
        lowerBiddingSeparatorView.hidden = bottomSeparatorOvelapsBidButton
    }
}
