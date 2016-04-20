import UIKit
import UICKeyChainStore

class LiveAuctionViewController: UISplitViewController {
    let saleID: String

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!

    var lotListController: LiveAuctionLotListViewController!
    var lotListNavigationController: ARSerifNavigationViewController!

    var firstLoaded = false

    init(saleID: String) {
        self.saleID = saleID
        super.init(nibName: nil, bundle: nil)
        self.title = saleID;
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        if firstLoaded  { return }
        firstLoaded = true

        preferredDisplayMode = .AllVisible;
        preferredPrimaryColumnWidthFraction = 0.4;
        delegate = self;


        // TODO: Very brittle! Assumes user is logged in. Prediction doesn't have guest support yet.
        let accessToken = UICKeyChainStore.stringForKey(AROAuthTokenDefault) ?? ""
        let salesPerson = LiveAuctionsSalesPerson(saleID: self.saleID, accessToken: accessToken, stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())

        lotSetController = LiveAuctionLotSetViewController(saleID: saleID, salesPerson:salesPerson)
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        lotListController = LiveAuctionLotListViewController(lots: salesPerson.lots, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel!)
        lotListController.delegate = self

        lotListNavigationController = ARSerifNavigationViewController(rootViewController: lotListController)

        if traitCollection.userInterfaceIdiom == .Phone {
            preferredDisplayMode = .PrimaryOverlay
            lotListNavigationController.pushViewController(lotSetController, animated: false)
            viewControllers = [lotListNavigationController]
        } else {
            viewControllers = [lotListNavigationController, lotsSetNavigationController]
        }
    }


    // Support for ARMenuAwareViewController

    let hidesBackButton = true
    let hidesSearchButton = true
    let hidesStatusBarBackground = true

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

        if traitCollection.userInterfaceIdiom == .Phone {
            lotListNavigationController.pushViewController(lotSetController, animated: true)
        }

        lotSetController.jumpToLotAtIndex(index, animated: false)
    }
}
