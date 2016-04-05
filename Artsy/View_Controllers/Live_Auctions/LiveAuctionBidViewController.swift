import UIKit


enum LiveAuctionBiddingProgressState {
    case Idle(biddingAmount: String)
    case InProgress
    case Success(isMaxBidder: Bool)
    case NetworkFail
}

class LiveAuctionBidViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

}
