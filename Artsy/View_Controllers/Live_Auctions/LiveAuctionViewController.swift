import UIKit
import Artsy_UIButtons
import Interstellar
import UICKeyChainStore
import SwiftyJSON
import FXBlurView
import ORStackView

class LiveAuctionViewController: UISplitViewController {
    let saleSlugOrID: String

    lazy var useSingleLayout: Bool = {
        return self.traitCollection.horizontalSizeClass == .Compact
    }()

    lazy var staticDataFetcher: LiveAuctionStaticDataFetcherType = {
        return LiveAuctionStaticDataFetcher(saleSlugOrID: self.saleSlugOrID)
    }()

    lazy var salesPersonCreator: (LiveSale, JWT, String?) -> LiveAuctionsSalesPersonType = self.salesPerson

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!
    var lotListController: LiveAuctionLotListViewController!

    var sale: LiveSale?

    private var statusMaintainer = ARSerifStatusMaintainer()
    lazy var app = UIApplication.sharedApplication()

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID

        super.init(nibName: nil, bundle: nil)

        self.title = saleSlugOrID

        // UIKit complains if we don't have at least one view controller; we replace this later in setupWithSale()
        viewControllers = [UIViewController()]

        // Find out when we've updated registration status
        NSNotificationCenter.defaultCenter()
            .addObserver(self, selector: #selector(userHasChangedRegistrationStatus), name: ARAuctionArtworkRegistrationUpdatedNotification, object: nil)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        ar_presentIndeterminateLoadingIndicatorAnimated(true)
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        if delegate != nil { return }

        preferredDisplayMode = .AllVisible
        preferredPrimaryColumnWidthFraction = 0.4
        delegate = self

        statusMaintainer.viewWillAppear(animated, app: app)
        connectToNetwork()

        UIApplication.sharedApplication().idleTimerDisabled = true
    }

    func connectToNetwork() {
        staticDataFetcher.fetchStaticData().subscribe { [weak self] result in
            self?.ar_removeIndeterminateLoadingIndicatorAnimated(Bool(ARPerformWorkAsynchronously))

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

    /// We want to offer ~1 second of delay to allow
    /// the socket to reconnect before we show the disconnect warning
    /// This is mainly to ensure it doesn't consistently flicker on/off
    /// with unpredictable connections

    var showSocketDisconnectWarning = false
    var waitingToShowDisconnect = false

    /// param is hide because it recieves a "connected" signal
    func showSocketDisconnectedOverlay(hide: Bool) {
        if hide { actuallyShowDisconnectedOverlay(false) }
        let show = !hide
        showSocketDisconnectWarning = show

        if waitingToShowDisconnect { return }
        if show {
            waitingToShowDisconnect = true

            ar_dispatch_after(1.1) {
                self.waitingToShowDisconnect = false
                if self.showSocketDisconnectWarning == true {
                    self.actuallyShowDisconnectedOverlay(true)
                }
            }
        }
    }

    var disconnectedView: UIView?

    func actuallyShowDisconnectedOverlay(show: Bool) {
        if !show {
            guard let disconnectedView = disconnectedView else { return }
            disconnectedView.removeFromSuperview()
            self.disconnectedView = nil
            UIApplication.sharedApplication().setStatusBarStyle(.Default, animated: true)
            return
        }

        if let _ = disconnectedView where show { return }

        ar_dispatch_async {
            UIGraphicsBeginImageContext(self.view.bounds.size);
            self.view.drawViewHierarchyInRect(self.view.bounds, afterScreenUpdates:false)

            let viewImage = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();

            let blurredImage = viewImage.blurredImageWithRadius(12, iterations: 2, tintColor: UIColor.blackColor())

            ar_dispatch_main_queue {
                let imageView = UIImageView(frame: self.view.bounds)
                imageView.image = blurredImage
                self.view.addSubview(imageView)
                let darkOverlay = UIView(frame: imageView.bounds)
                darkOverlay.backgroundColor = UIColor(white: 0, alpha: 0.75)
                imageView.addSubview(darkOverlay)
                self.disconnectedView = imageView

                UIApplication.sharedApplication().setStatusBarStyle(.LightContent, animated: true)

                let dimension = 40
                let closeButton = ARMenuButton()
                closeButton.setBorderColor(.whiteColor(), forState: .Normal, animated: false)
                closeButton.setBackgroundColor(.clearColor(), forState: .Normal, animated: false)
                let cross = UIImage(named:"serif_modal_close")?.imageWithRenderingMode(.AlwaysTemplate)
                closeButton.setImage(cross, forState: .Normal)
                closeButton.alpha = 0.5
                closeButton.tintColor = .whiteColor()
                closeButton.addTarget(self, action: #selector(self.dismissLiveAuctionsModal), forControlEvents: .TouchUpInside)

                imageView.addSubview(closeButton)
                closeButton.alignTrailingEdgeWithView(imageView, predicate: "-20")
                closeButton.alignTopEdgeWithView(imageView, predicate: "20")
                closeButton.constrainWidth("\(dimension)", height: "\(dimension)")

                let infoStack = ORStackView()
                let title = NSLocalizedString("Artsy has lost contact with the auction house.", comment: "Live websocket disconnect title")
                let subtitle = NSLocalizedString("Attempting to reconnect now", comment: "Live websocket disconnect subtitle")

                infoStack.addSerifPageTitle(title, subtitle: subtitle)
                infoStack.subviews.forEach {
                    guard let label = $0 as? UILabel else { return }
                    label.textColor = .whiteColor()
                    label.backgroundColor = .clearColor()
                }
                imageView.addSubview(infoStack)
                infoStack.constrainWidthToView(imageView, predicate: "-40")
                infoStack.alignCenterWithView(imageView)
            }
        }

        disconnectedView = AROfflineView()

    }

    /// This is the offline view when we cannot fetch metaphysics static data
    /// which means we can't connect to the server for JSON data
    var offlineView: AROfflineView?

    func showOfflineView() {
        // Stop the spinner to indicate that it's
        // tried and failed to do it

        guard offlineView == nil else {
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

    func userHasChangedRegistrationStatus() {
        // we have to ask for a new metaphysics JWT ( as they contain metadata about bidder status )
        // so we need to pull down the current view heirarchy, and recreate it
        // Which luckily, connectToNetwork() does for us via setupWithSale()
        connectToNetwork()
    }

    func dismissLiveAuctionsModal() {
        self.presentingViewController?.dismissViewControllerAnimated(true, completion: nil)
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)

        statusMaintainer.viewWillDisappear(animated, app: app)
        app.idleTimerDisabled = false

        // Hrm, yes, so this seems to be a weird side effect of UISplitVC
        // in that it won't pass the view transition funcs down to it's children
        viewControllers.forEach { vc in
            vc.beginAppearanceTransition(false, animated: animated)
        }

        guard let internalPopover = self.valueForKey("_hidden" + "PopoverController") as? UIPopoverController else { return }
        internalPopover.dismissPopoverAnimated(false)
    }

    override func viewDidDisappear(animated: Bool) {
        super.viewDidDisappear(animated)
        viewControllers.forEach { vc in
            vc.endAppearanceTransition()
        }
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
        let salesPerson = self.salesPersonCreator(sale, jwt, bidderID)
        salesPerson.socketConnectionSignal.subscribe(showSocketDisconnectedOverlay)

        lotSetController = LiveAuctionLotSetViewController(salesPerson: salesPerson, traitCollection: view.traitCollection)
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        if useSingleLayout {
            viewControllers = [lotsSetNavigationController]

        } else {
            lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
            lotListController.delegate = self

            let lotListNav = ARSerifNavigationViewController(rootViewController: lotListController)

            viewControllers = [lotListNav, lotsSetNavigationController]
        }
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

// swiftlint:disable force_unwrapping

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

func loadJSON(filename: String) -> AnyObject! {
    let jsonPath = NSBundle.mainBundle().pathForResource(filename, ofType: "json")
    let jsonData = NSData(contentsOfFile: jsonPath!)!
    let json = try? NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

    return json
    }
