import UIKit
import ORStackView
import Then

class AuctionViewController: UIViewController {
    let saleID: String
    var saleViewModel: SaleViewModel!
    var appeared = false

    var headerStack: ORStackView!

    lazy var stickyHeader: ScrollingStickyHeaderView = {
        // Eh, when we start connecting data this'll have to move whenever
        // so ok for now
        return ScrollingStickyHeaderView().then{
            $0.titleLabel.text = "VC Header"
            $0.subtitleLabel.text = "Loadsa works"
            $0.button.setTitle("Refine", forState: .Normal)
            $0.button.addTarget(self, action: "buttonPressed", forControlEvents: .TouchUpInside)
        }
    }()

    /// Variable for storing lazily-computed default refine settings. 
    /// Should not be accessed directly, call defaultRefineSettings() instead.
    private var _defaultRefineSettings: AuctionRefineSettings?
    private var artworksViewController: ARModelInfiniteScrollViewController!

    /// Current refine settings.
    /// Our refine settings are (by default) the defaultRefineSettings().
    lazy var refineSettings: AuctionRefineSettings = {
        return self.defaultRefineSettings()
    }()

    lazy var networkModel: AuctionNetworkModel = {
        return AuctionNetworkModel(saleID: self.saleID)
    }()

    init(saleID: String) {
        self.saleID = saleID
        super.init(nibName: nil, bundle: nil)
    }

    // Required by Swift compiler, sadly.
    required init?(coder aDecoder: NSCoder) {
        self.saleID = ""
        super.init(coder: aDecoder)
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        headerStack = ORTagBasedAutoStackView()
        artworksViewController = ARModelInfiniteScrollViewController()
        ar_addAlignedModernChildViewController(artworksViewController)

        artworksViewController.headerStackView = headerStack
        artworksViewController.modelViewController.delegate = self
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        guard appeared == false else { return }
        appeared = true

        self.ar_presentIndeterminateLoadingIndicatorAnimated(animated)
        self.networkModel.fetch().next { saleViewModel in
            self.setupForSale(saleViewModel)
        }.error { error in
            // TODO: Error-handling somehow
        }
    }

    enum ViewTags: Int {
        case Banner = 0, Title
        
        case WhitespaceGobbler
    }

}

extension AuctionViewController {
    func setupForSale(saleViewModel: SaleViewModel) {
        // TODO: Sale is currently private on the SVM
        // artworksViewController.spotlightEntity = saleViewModel.sale

        self.saleViewModel = saleViewModel

        [ (AuctionBannerView(viewModel: saleViewModel), ViewTags.Banner),
          (AuctionTitleView(viewModel: saleViewModel, delegate: self), .Title),
          (ARWhitespaceGobbler(), .WhitespaceGobbler)
        ].forEach { (view, tag) in
            view.tag = tag.rawValue
            headerStack.addSubview(view, withTopMargin: "0", sideMargin: "0")
        }

        artworksViewController.stickyHeaderView = stickyHeader
        artworksViewController.invalidateHeaderHeight()

        self.artworksViewController.modelViewController.appendItems(saleViewModel.artworks)
        self.artworksViewController.modelViewController.showTrailingLoadingIndicator = false

        self.ar_removeIndeterminateLoadingIndicatorAnimated(true) // TODO: Animated?
    }

    func defaultRefineSettings() -> AuctionRefineSettings {
        guard let defaultSettings = _defaultRefineSettings else {
            let defaultSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber, range: self.saleViewModel.lowEstimateRange)
            _defaultRefineSettings = defaultSettings
            return defaultSettings
        }
        return defaultSettings
    }
}

extension AuctionViewController: AuctionTitleViewDelegate {
    func buttonPressed() {
        let refineViewController = AuctionRefineViewController(defaultSettings: defaultRefineSettings(), initialSettings: refineSettings).then {
            $0.delegate = self
            $0.modalPresentationStyle = .FormSheet
            $0.changeStatusBar = self.traitCollection.horizontalSizeClass == .Compact
        }
        presentViewController(refineViewController, animated: true, completion: nil)
    }
}

extension AuctionViewController: AuctionRefineViewControllerDelegate {
    func userDidCancel(controller: AuctionRefineViewController) {
        dismissViewControllerAnimated(true, completion: nil)
    }

    func userDidApply(settings: AuctionRefineSettings, controller: AuctionRefineViewController) {
        refineSettings = settings
        dismissViewControllerAnimated(true, completion: nil)
    }
}

extension AuctionViewController: AREmbeddedModelsViewControllerDelegate {
    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, didTapItemAtIndex index: UInt) {
        // TODO
    }

    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, shouldPresentViewController viewController: UIViewController!) {
        navigationController?.pushViewController(viewController, animated: true)
    }

    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, stickyHeaderDidChangeStickyness isAttatchedToLeadingEdge: Bool) {
        stickyHeader.stickyHeaderHeight.constant = isAttatchedToLeadingEdge ? 120 : 60
        stickyHeader.toggleAttatched(isAttatchedToLeadingEdge, animated: true)
    }
}