import UIKit
import Artsy_UIButtons
import Interstellar
import UICKeyChainStore
import SwiftyJSON
import FXBlurView
import ORStackView

class LiveAuctionViewController: UISplitViewController {
    let saleSlugOrID: String

    lazy var useSingleLayout: Bool = { [weak self] in
        return self?.traitCollection.horizontalSizeClass == .compact
    }()

    lazy var staticDataFetcher: LiveAuctionStaticDataFetcherType = { [weak self] in
        return LiveAuctionStaticDataFetcher(saleSlugOrID: self?.saleSlugOrID ?? "")
    }()

    lazy var salesPersonCreator: (LiveSale, JWT, BiddingCredentials) -> LiveAuctionsSalesPersonType = LiveAuctionViewController.salesPerson

    var lotSetController: LiveAuctionLotSetViewController!
    var lotsSetNavigationController: ARSerifNavigationViewController!
    var lotListController: LiveAuctionLotListViewController!
    var loadingView: LiveAuctionLoadingView?

    var overlaySubscription: ObserverToken<Bool>?

    var sale: LiveSale?

    fileprivate var statusMaintainer = ARSerifStatusMaintainer()
    lazy var app = UIApplication.shared
    var suppressJumpingToOpenLots = false

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID

        super.init(nibName: nil, bundle: nil)

        self.title = saleSlugOrID

        // UIKit complains if we don't have at least one view controller; we replace this later in setupWithSale()
        viewControllers = [UIViewController()]

        // Find out when we've updated registration status
        NotificationCenter.default
            .addObserver(self, selector: #selector(userHasChangedRegistrationStatus), name: NSNotification.Name.ARAuctionArtworkRegistrationUpdated, object: nil)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if delegate != nil { return }

        preferredDisplayMode = .allVisible
        preferredPrimaryColumnWidthFraction = 0.4
        delegate = self

        statusMaintainer.viewWillAppear(animated, app: app)
        connectToNetwork()

        app.isIdleTimerDisabled = true

        if waitingForInitialLoad {
            loadingView = LiveAuctionLoadingView().then {
                $0.operation = applyWeakly(self, LiveAuctionViewController.dismissLiveAuctionsModal)
                view.addSubview($0)
                $0.align(toView: view)
            }
        }
    }

    func connectToNetwork() {
        staticDataFetcher.fetchStaticData().subscribe { [weak self] result in
            self?.ar_removeIndeterminateLoadingIndicator(animated: ARPerformWorkAsynchronously.boolValue)

            switch result {
            case .success(let (sale, jwt, bidderCredentials)):
                self?.sale = sale
                self?.setupWithSale(sale, jwt: jwt, bidderCredentials: bidderCredentials)

            case .error(let error):
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
    var waitingForInitialLoad = true

    /// param is hide because it recieves a "connected" signal
    func showSocketDisconnectedOverlay(_ hide: Bool) {
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

    func actuallyShowDisconnectedOverlay(_ show: Bool) {
        if !show {
            ar_removeBlurredOverlayWithTitle()
        } else {
            let title = NSLocalizedString("Artsy has lost contact with the auction house.", comment: "Live websocket disconnect title")
            let subtitle = NSLocalizedString("Attempting to reconnect now", comment: "Live websocket disconnect subtitle")
            let menuButton = BlurredStatusOverlayViewCloseButtonState.show(target: self, selector: #selector(dismissLiveAuctionsModal))
            ar_presentBlurredOverlayWithTitle(title, subtitle: subtitle, buttonState:menuButton)
        }
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
        offlineView.align(toView: view)

        // As we're not showing a ARSerifNav
        // we don't have a back button yet, so add one

        let dimension = 40
        let closeButton = ARMenuButton()
        closeButton.setBorderColor(.artsyGrayRegular(), for: UIControlState(), animated: false)
        closeButton.setBackgroundColor(.white, for: UIControlState(), animated: false)
        closeButton.setImage(UIImage(named:"serif_modal_close"), for: UIControlState())
        closeButton.addTarget(self, action: #selector(dismissLiveAuctionsModal), for: .touchUpInside)

        offlineView.addSubview(closeButton)
        closeButton.alignTrailingEdge(withView: offlineView, predicate: "-20")
        closeButton.alignTopEdge(withView: offlineView, predicate: "20")
        closeButton.constrainWidth("\(dimension)", height: "\(dimension)")
    }

    func userHasChangedRegistrationStatus() {
        // we have to ask for a new metaphysics JWT ( as they contain metadata about bidder status )
        // so we need to pull down the current view heirarchy, and recreate it
        // Which luckily, connectToNetwork() does for us via setupWithSale()
        connectToNetwork()
    }

    func dismissLiveAuctionsModal() {
        overlaySubscription?.unsubscribe()
        self.presentingViewController?.dismiss(animated: true, completion: nil)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        statusMaintainer.viewWillDisappear(animated, app: app)
        app.isIdleTimerDisabled = false

        // Hrm, yes, so this seems to be a weird side effect of UISplitVC
        // in that it won't pass the view transition funcs down to it's children
        viewControllers.forEach { vc in
            vc.beginAppearanceTransition(false, animated: animated)
        }

        // This crashes on iOS 10
        if #available(iOS 10, *) {} else {
            guard let internalPopover = value(forKey: "_hidden" + "PopoverController") as? UIPopoverController else { return }
            internalPopover.dismiss(animated: false)
        }
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)

        viewControllers.forEach { vc in
            vc.endAppearanceTransition()
        }
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override var shouldAutorotate : Bool {
        return traitDependentAutorotateSupport
    }

    override var supportedInterfaceOrientations : UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations
    }
}

extension LiveAuctionViewController: AROfflineViewDelegate {
    // Give networking a second shot when offline
    func offlineViewDidRequestRefresh(_ offlineView: AROfflineView!) {
        connectToNetwork()
    }
}

fileprivate typealias PrivateFunctions = LiveAuctionViewController
extension PrivateFunctions {

    func setupWithSale(_ sale: LiveSale, jwt: JWT, bidderCredentials: BiddingCredentials) {
        let salesPerson = self.salesPersonCreator(sale, jwt, bidderCredentials)

        overlaySubscription?.unsubscribe()
        overlaySubscription = salesPerson.socketConnectionSignal
            .merge(salesPerson.operatorConnectedSignal)
            .map { return $0.0 && $0.1 } // We are connected iff the socket is connected and the operator is connected.
            .subscribe(showSocketDisconnectedOverlay)

        lotSetController = LiveAuctionLotSetViewController(salesPerson: salesPerson, traitCollection: view.traitCollection)
        lotSetController.suppressJumpingToOpenLots = suppressJumpingToOpenLots
        lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)

        if useSingleLayout {
            viewControllers = [lotsSetNavigationController]
        } else {
            lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel)
            lotListController.delegate = self

            let lotListNav = ARSerifNavigationViewController(rootViewController: lotListController)

            viewControllers = [lotListNav, lotsSetNavigationController]
        }

        salesPerson.initialStateLoadedSignal.subscribe { [weak self] _ in
            self?.waitingForInitialLoad = false
            self?.loadingView?.removeFromSuperview()
            self?.loadingView = nil
        }
    }

    class func salesPerson(_ sale: LiveSale, jwt: JWT, biddingCredentials: BiddingCredentials) -> LiveAuctionsSalesPersonType {
        return LiveAuctionsSalesPerson(sale: sale, jwt: jwt, biddingCredentials: biddingCredentials)
    }
}

extension LiveAuctionViewController: UISplitViewControllerDelegate {
    func splitViewController(_ splitViewController: UISplitViewController, collapseSecondary secondaryViewController: UIViewController, onto primaryViewController: UIViewController) -> Bool {
        return true
    }
}

extension LiveAuctionViewController: LiveAuctionLotListViewControllerDelegate {
    func didSelectLotAtIndex(_ index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController) {
        lotSetController.jumpToLotAtIndex(index)
    }
}

// swiftlint:disable force_unwrapping

class Stubbed_StaticDataFetcher: LiveAuctionStaticDataFetcherType {

    var bidders: [Bidder] = []
    var paddleNumber: String = "123456"

    init() {
        if let bidder = try? Bidder(dictionary: ["qualifiedForBidding": true, "saleRequiresBidderApproval": true, "bidderID": "123456"], error: Void()) {
            bidders = [bidder]
        }
    }

    func fetchStaticData() -> Observable<StaticSaleResult> {
        let signal = Observable<StaticSaleResult>()

        let json = loadJSON("live_auctions_static")
        let sale = self.parseSale(JSON(json!))!
        let bidderCredentials = BiddingCredentials(bidders: bidders, paddleNumber: paddleNumber)

        let stubbedJWT = JWT(jwtString: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJvYnNlcnZlciIsInVzZXJJZCI6bnVsbCwic2FsZUlkIjoiNTRjN2U4ZmE3MjYxNjkyYjVhY2QwNjAwIiwiYmlkZGVySWQiOm51bGwsImlhdCI6MTQ2NTIzNDI2NDI2N30.2q3bh1E897walHdSXIocGKElbxOhCGmCCsL8Bf-UWNA")!
        let s = (sale: sale, jwt: stubbedJWT, bidderCredentials: bidderCredentials)
        signal.update(Result.success(s))

        return signal
    }
}

func loadJSON(_ filename: String) -> AnyObject! {
    let jsonPath = Bundle.main.path(forResource: filename, ofType: "json")
    let jsonData = try! Data(contentsOf: URL(fileURLWithPath: jsonPath!))
    let json = try? JSONSerialization.jsonObject(with: jsonData, options: .allowFragments)

    return json as AnyObject!
    }
