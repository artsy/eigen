import UIKit
import MARKRangeSlider
import ARAnalytics

protocol RefinementOptionsViewControllerDelegate: class {
    associatedtype R: RefinableType

    func userDidCancel(controller: RefinementOptionsViewController<R>)
    func userDidApply(settings: R, controller: RefinementOptionsViewController<R>)
}

// TODO: Move into a navigation

class RefinementOptionsViewController<R: RefinableType>: UIViewController {
    var minLabel: UILabel?
    var maxLabel: UILabel?
    var slider: MARKRangeSlider?
    var applyButton: UIButton?
    var resetButton: UIButton?
    var userDidCancelClosure: (RefinementOptionsViewController -> Void)?
    var userDidApplyClosure: (R -> Void)?

    // this is semantically "private" to guarantee it doesn't outlive this instance of RefinementOptionsViewController
    var tableViewHandler: RefinementOptionsViewControllerTableViewHandler?
    var sortTableView: UITableView?

    var viewDidAppearAnalyticsOption: RefinementAnalyticsOption?
    var applyButtonPressedAnalyticsOption: RefinementAnalyticsOption?

    let currencySymbol: String
    // defaultSettings also implies min/max price ranges
    var defaultSettings: R
    var initialSettings: R
    var currentSettings: R {
        didSet {
            updateButtonEnabledStates()
            updatePriceLabels()
        }
    }

    var changeStatusBar = false

    init(defaultSettings: R, initialSettings: R, currencySymbol: String, userDidCancelClosure: (RefinementOptionsViewController -> Void)?, userDidApplyClosure: (R -> Void)?) {
        self.defaultSettings = defaultSettings
        self.initialSettings = initialSettings
        self.currentSettings = initialSettings
        self.currencySymbol = currencySymbol
        self.userDidCancelClosure = userDidCancelClosure
        self.userDidApplyClosure = userDidApplyClosure

        super.init(nibName: nil, bundle: nil)
    }

    func sliderValueDidChange(slider: MARKRangeSlider) {
        let range = (min: Int(slider.leftValue), max: Int(slider.rightValue))
        currentSettings = currentSettings.refineSettingsWithPriceRange(range)
    }

    func userDidPressApply() {
        applyButtonPressedAnalyticsOption?.sendAsEvent()
        userDidApplyClosure?(currentSettings)
    }

    func userDidCancel() {
        userDidCancelClosure?(self)
    }

    func userDidPressReset() {
        // Reset all UI back to its default settings, including a hard reload on the table view.
        currentSettings = defaultSettings
        sortTableView?.reloadData()

        if let range = self.defaultSettings.priceRange {
            slider?.setLeftValue(CGFloat(range.min), rightValue: CGFloat(range.max))
        }
        updatePriceLabels()
        updateButtonEnabledStates()
    }

    // Required by Swift compiler, sadly.

    required init?(coder aDecoder: NSCoder) {
        return nil
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

    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        viewDidAppearAnalyticsOption?.sendAsPageView()
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

class RefinementAnalyticsOption: NSObject {
    let name: String
    let properties: [NSObject: AnyObject]

    init(name: String, properties: [NSObject: AnyObject]) {
        self.name = name
        self.properties = properties

        super.init()
    }

    func sendAsEvent() {
        ARAnalytics.event(name, withProperties: properties)
    }

    func sendAsPageView() {
        ARAnalytics.pageView(name, withProperties: properties)
    }
}
