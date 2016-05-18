import UIKit
import Artsy_UIButtons
import Interstellar
import UICKeyChainStore
import SwiftyJSON

class LiveAuctionViewController: UISplitViewController {
    let saleSlugOrID: String

    lazy var useSingleLayout: Bool = {
        return self.traitCollection.userInterfaceIdiom == .Phone
    }()

    lazy var staticDataFetcher: LiveAuctionStaticDataFetcherType = {
        return LiveAuctionStaticDataFetcher(saleSlugOrID: self.saleSlugOrID)
    }()

    lazy var salesPersonCreator: (LiveSale, JWT, String) -> LiveAuctionsSalesPersonType = self.salesPerson

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!
    var lotListController: LiveAuctionLotListViewController!

    var sale: LiveSale?

    var offlineView: AROfflineView?

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID

        super.init(nibName: nil, bundle: nil)

        self.title = saleSlugOrID
        viewControllers = [UIViewController()] // UIKit complains if we don't have at least one view controller; we replace this later in setupWithSale()
    }

    override func viewWillAppear(animated: Bool) {
        if delegate != nil { return }

        preferredDisplayMode = .AllVisible;
        preferredPrimaryColumnWidthFraction = 0.4;
        delegate = self;

        ar_presentIndeterminateLoadingIndicatorAnimated(true)
        connectToNetwork()

        super.viewWillAppear(animated)
    }

    func connectToNetwork() {
        staticDataFetcher.fetchStaticData().subscribe { [weak self] result in
            defer { self?.ar_removeIndeterminateLoadingIndicatorAnimated(true) }

            switch result {
            case .Success(let (sale, jwt, bidderID)):
                self?.offlineView?.removeFromSuperview()
                self?.sale = sale
                self?.setupWithSale(sale, jwt: jwt, bidderID: bidderID)

            case .Error(let error):
                print("Error pulling down sale data for \(self?.saleSlugOrID)")
                print("Error: \(error)")
                self?.showOfflineView()
            }
        }
    }

    func showOfflineView() {
        // Stop the spinner to indicate that it's
        // tried and failed to do it

        if (offlineView != nil) {
            offlineView?.refreshFailed()
            return
        }

        offlineView = AROfflineView()
        guard let offlineView = offlineView else { return }

        offlineView.delegate = self
        view.addSubview(offlineView)
        offlineView.alignToView(view)

        // As we're not showing a ARSerifNav
        // we don't have a back button yet, so add one

        let dimension = 40
        let closeButton = ARMenuButton()
        closeButton.setBorderColor(.artsyGrayRegular(), forState: .Normal, animated: false)
        closeButton.setBackgroundColor(.whiteColor(), forState: .Normal, animated: false)
        closeButton.setImage(UIImage(named:"serif_modal_close"), forState: .Normal)
        closeButton.addTarget(self, action: #selector(dismissLiveAuctionsModal), forControlEvents: .TouchUpInside)

        offlineView.addSubview(closeButton)
        closeButton.alignTrailingEdgeWithView(offlineView, predicate: "-20")
        closeButton.alignTopEdgeWithView(offlineView, predicate: "20")
        closeButton.constrainWidth("\(dimension)", height: "\(dimension)")
    }

    func dismissLiveAuctionsModal() {
        self.presentingViewController?.dismissViewControllerAnimated(true, completion: nil)
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

extension LiveAuctionViewController: AROfflineViewDelegate {
    // Give networking a second shot when offline
    func offlineViewDidRequestRefresh(offlineView: AROfflineView!) {
        connectToNetwork()
    }
}

private typealias PrivateFunctions = LiveAuctionViewController
extension PrivateFunctions {

    func setupWithSale(sale: LiveSale, jwt: JWT, bidderID: String?) {
        let salesPerson = self.salesPerson(sale, jwt: jwt, bidderID: bidderID)

        lotSetController = LiveAuctionLotSetViewController(salesPerson: salesPerson)
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
        lotListController.delegate = self

        viewControllers = useSingleLayout ? [lotsSetNavigationController] : [lotListController, lotsSetNavigationController]
    }

    func salesPerson(sale: LiveSale, jwt: JWT, bidderID: String?) -> LiveAuctionsSalesPersonType {
        return LiveAuctionsSalesPerson(sale: sale, jwt: jwt, bidderID: bidderID)
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
        let sale = self.parseSale(JSON(json))!
        let bidderID: String? = "awesome-bidder-id-aw-yeah"

        let s = (sale: sale, jwt: "", bidderID: bidderID)
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
