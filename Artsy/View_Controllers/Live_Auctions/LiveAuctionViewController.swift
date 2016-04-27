import UIKit
import UICKeyChainStore

class LiveAuctionViewController: UISplitViewController {
    let saleID: String

    lazy var salesPerson: LiveAuctionsSalesPersonType = {
        // TODO: Very brittle! Assumes user is logged in. Prediction doesn't have guest support yet.
        let accessToken = UICKeyChainStore.stringForKey(AROAuthTokenDefault) ?? ""
        return LiveAuctionsSalesPerson(saleID: self.saleID, accessToken: accessToken, stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
     }()

    lazy var useSingleLayout: Bool = {
        return self.traitCollection.userInterfaceIdiom == .Phone
    }()

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!

    var lotListController: LiveAuctionLotListViewController!

    init(saleID: String) {
        self.saleID = saleID

        super.init(nibName: nil, bundle: nil)
        self.title = saleID;
    }

    override func viewWillAppear(animated: Bool) {
        if delegate != nil { return }

        preferredDisplayMode = .AllVisible;
        preferredPrimaryColumnWidthFraction = 0.4;
        delegate = self;

        lotSetController = LiveAuctionLotSetViewController(saleID: saleID, salesPerson:salesPerson)
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        lotListController = LiveAuctionLotListViewController(lots: salesPerson.lots, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel!)
        lotListController.delegate = self


        viewControllers = useSingleLayout ? [lotsSetNavigationController] : [lotListController, lotsSetNavigationController]
        super.viewWillAppear(animated)
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewDidDisappear(animated)

        guard let internalPopover = self.valueForKey("_hiddenPopoverController") as? UIPopoverController else { return }
        internalPopover.dismissPopoverAnimated(false)
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func shouldAutorotate() -> Bool {
        return traitDependentAutorotateSupport
    }

    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations
    }
}

extension LiveAuctionViewController: UISplitViewControllerDelegate {
    func splitViewController(splitViewController: UISplitViewController, collapseSecondaryViewController secondaryViewController: UIViewController, ontoPrimaryViewController primaryViewController: UIViewController) -> Bool {
        return true
    }
}

extension LiveAuctionViewController: LiveAuctionLotListViewControllerDelegate {
    func didSelectLotAtIndex(index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController) {
        lotSetController.jumpToLotAtIndex(index, animated: false)
    }
}
