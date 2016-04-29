import UIKit
import Interstellar
import UICKeyChainStore

class LiveAuctionViewController: UISplitViewController {
    let saleSlugOrID: String

    lazy var useSingleLayout: Bool = {
        return self.traitCollection.userInterfaceIdiom == .Phone
    }()

    lazy var staticDataFetcher: LiveAuctionStaticDataFetcherType = {
        return Stubbed_StaticDataFetcher() // TODO: Remove stubbing.
    }()

    lazy var salesPersonCreator: LiveSale -> LiveAuctionsSalesPersonType = self.salesPerson

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
        return LiveAuctionsSalesPerson(sale: sale, accessToken: accessToken)
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
    func fetchStaticData() -> Observable<Result<LiveSale>> {
        let json = loadJSON("live_auctions_static")
        let sale = self.parseSale(json)

        if let sale = sale {
            return Observable(Result.Success(sale))
        } else {
            return Observable(Result.Error(LiveAuctionStaticDataFetcher.Error.JSONParsing))
        }
    }
}

func loadJSON(filename: String) -> AnyObject {
    let jsonPath = NSBundle.mainBundle().pathForResource(filename, ofType: "json")
    let jsonData = NSData(contentsOfFile: jsonPath!)!
    let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

    return json
    }
