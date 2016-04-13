import UIKit
import Interstellar

class LiveAuctionLotListViewController: UIViewController {
    let lots: [LiveAuctionLotViewModelType]
    let currentLotSignal: Signal<LiveAuctionLotViewModelType>

    init(lots: [LiveAuctionLotViewModelType], currentLotSignal: Signal<LiveAuctionLotViewModelType>) {
        self.lots = lots
        self.currentLotSignal = currentLotSignal

        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func viewDidLoad() {
        view.backgroundColor = .whiteColor()
    }
    
}