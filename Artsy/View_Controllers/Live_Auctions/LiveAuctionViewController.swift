import UIKit

class LiveAuctionViewController: UISplitViewController, UISplitViewControllerDelegate {
    let saleID: String

    init(saleID: String) {
        self.saleID = saleID
        super.init(nibName: nil, bundle: nil)
        self.title = saleID;
    }

    override func viewDidLoad() {
        super.viewDidLoad()


        let lotsVC = LiveAuctionLotsViewController(saleID: saleID)
        let nav = ARSerifNavigationViewController(rootViewController: lotsVC)

        let lotsSalesPerson = lotsVC.salesPerson

        let lotViewController = LiveAuctionLotListViewController(lots: lotsSalesPerson.lots, currentLotSignal: lotsSalesPerson.currentLotSignal, auctionViewModel: lotsSalesPerson.auctionViewModel!)
        lotViewController.delegate = lotsVC

        self.viewControllers = [lotViewController, nav]
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

}
