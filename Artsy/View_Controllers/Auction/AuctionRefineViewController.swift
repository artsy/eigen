import UIKit
import MARKRangeSlider

protocol AuctionRefineViewControllerDelegate: class {
    func userDidCancel(controller: AuctionRefineViewController)
    func userDidApply(settings: AuctionRefineSettings, controller: AuctionRefineViewController)
}

// TODO: Move into a navigation

class AuctionRefineViewController: UIViewController {
    weak var delegate: AuctionRefineViewControllerDelegate?
    var saleViewModel: SaleViewModel!
    var minLabel: UILabel?
    var maxLabel: UILabel?
    var slider: MARKRangeSlider?
    var applyButton: UIButton?
    var resetButton: UIButton?
    var sortTableView: UITableView?

    // defaultSettings also implies min/max price ranges
    var defaultSettings: AuctionRefineSettings
    var initialSettings: AuctionRefineSettings
    var currentSettings: AuctionRefineSettings {
        didSet {
            updateButtonEnabledStates()
            updatePriceLabels()
        }
    }

    var changeStatusBar = false

    init(defaultSettings: AuctionRefineSettings, initialSettings: AuctionRefineSettings) {
        self.defaultSettings = defaultSettings
        self.initialSettings = initialSettings
        self.currentSettings = initialSettings

        super.init(nibName: nil, bundle: nil)
    }

    // Required by Swift compiler, sadly.
    required init?(coder aDecoder: NSCoder) {
        fatalError()
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .whiteColor()
        
        setupViews()
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        // Removes our rounded corners
        presentationController?.presentedView()?.layer.cornerRadius = 0

        if changeStatusBar {
            UIApplication.sharedApplication().setStatusBarHidden(true, withAnimation: animated ? .Slide : .None)
        }
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)

        if changeStatusBar {
            UIApplication.sharedApplication().setStatusBarHidden(false, withAnimation: animated ? .Slide : .None)
        }
    }

    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations
    }

    override func shouldAutorotate() -> Bool {
        return traitDependentAutorotateSupport
    }
}
