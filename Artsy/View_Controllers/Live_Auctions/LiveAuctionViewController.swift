import UIKit
import UICKeyChainStore

class LiveAuctionViewController: UISplitViewController {
    let saleSlugOrID: String

    lazy var useSingleLayout: Bool = {
        return self.traitCollection.userInterfaceIdiom == .Phone
    }()

    lazy var staticDataFetcher: LiveAuctionStaticDataFetcherType = {
        return LiveAuctionStaticDataFetcher(saleSlugOrID: self.saleSlugOrID)
    }()

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!

    var lotListController: LiveAuctionLotListViewController!

    var sale: LiveSale?

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID

        super.init(nibName: nil, bundle: nil)
        self.title = saleSlugOrID;
    }

    override func viewWillAppear(animated: Bool) {
        if delegate != nil { return }

        self.ar_presentIndeterminateLoadingIndicatorAnimated(true)

        staticDataFetcher.fetchStaticData().subscribe { [weak self] result in
            defer { self?.ar_removeIndeterminateLoadingIndicatorAnimated(true) }

            switch result {
            case .Success(let sale):
                self?.sale = sale
                self?.setupWithSale(sale)
            case .Error:
                // TODO: handle error case
                break
            }
        }

        preferredDisplayMode = .AllVisible;
        preferredPrimaryColumnWidthFraction = 0.4;
        delegate = self;

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

private typealias PrivateFunctions = LiveAuctionViewController
extension PrivateFunctions {

    func setupWithSale(sale: LiveSale) {
        let salesPerson = self.salesPerson(sale)

        lotSetController = LiveAuctionLotSetViewController(salesPerson: salesPerson)
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
        lotListController.delegate = self

        viewControllers = useSingleLayout ? [lotsSetNavigationController] : [lotListController, lotsSetNavigationController]
    }

    func salesPerson(sale: LiveSale) -> LiveAuctionsSalesPersonType {
        // TODO: Very brittle! Assumes user is logged in. Prediction doesn't have guest support yet.
        let accessToken = UICKeyChainStore.stringForKey(AROAuthTokenDefault) ?? ""
        return LiveAuctionsSalesPerson(sale: sale, accessToken: accessToken, stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
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
