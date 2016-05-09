import UIKit
import Interstellar
import UICKeyChainStore

class LiveAuctionViewController: UISplitViewController {
    let saleSlugOrID: String

    lazy var useSingleLayout: Bool = {
        return self.traitCollection.userInterfaceIdiom == .Phone
    }()

    lazy var staticDataFetcher: LiveAuctionStaticDataFetcherType = {
        return LiveAuctionStaticDataFetcher(saleSlugOrID: self.saleSlugOrID)
    }()

    lazy var salesPersonCreator: (LiveSale, JWT) -> LiveAuctionsSalesPersonType = self.salesPerson

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!
    var lotListController: LiveAuctionLotListViewController!

    var sale: LiveSale?

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID

        super.init(nibName: nil, bundle: nil)

        self.title = saleSlugOrID
        viewControllers = [UIViewController()] // UIKit complains if we don't have at least one view controller; we replace this later in setupWithSale()
    }

    override func viewWillAppear(animated: Bool) {
        if delegate != nil { return }

        self.ar_presentIndeterminateLoadingIndicatorAnimated(true)

        staticDataFetcher.fetchStaticData().subscribe { [weak self] result in
            defer { self?.ar_removeIndeterminateLoadingIndicatorAnimated(true) }

            switch result {
            case .Success(let (sale, jwt)):
                self?.sale = sale
                self?.setupWithSale(sale, jwt: jwt)
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

    func setupWithSale(sale: LiveSale, jwt: JWT) {
        let salesPerson = self.salesPerson(sale, jwt: jwt)

        lotSetController = LiveAuctionLotSetViewController(salesPerson: salesPerson)
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
        lotListController.delegate = self

        viewControllers = useSingleLayout ? [lotsSetNavigationController] : [lotListController, lotsSetNavigationController]
    }

    func salesPerson(sale: LiveSale, jwt: JWT) -> LiveAuctionsSalesPersonType {
        // TODO: Very brittle! Assumes user is logged in. Prediction doesn't have guest support yet.
        return LiveAuctionsSalesPerson(sale: sale, jwt: jwt)
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

class Stubbed_StaticDataFetcher: LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Observable<StaticSaleResult> {
        let signal = Observable<StaticSaleResult>()

        let json = loadJSON("live_auctions_static")
        let sale = self.parseSale(json)!

        let s = (sale: sale, jwt: "")
        signal.update(Result.Success(s))

        return signal
    }
}

func loadJSON(filename: String) -> AnyObject {
    let jsonPath = NSBundle.mainBundle().pathForResource(filename, ofType: "json")
    let jsonData = NSData(contentsOfFile: jsonPath!)!
    let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

    return json
    }
