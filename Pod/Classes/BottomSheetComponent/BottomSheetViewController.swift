//
//  BottomSheetViewController.swift
//  Emission
//
//  Created by Luc Succes on 12/19/18.
//

import UIKit

/**
 *  The base delegate protocol for BottomSheet delegates.
 */
@objc public protocol BottomSheetDelegate: class {
    
    /** This is called after size changes, so if you care about the bottomSafeArea property for custom UI layout, you can use this value.
     * NOTE: It's not called *during* the transition between sizes (such as in an animation coordinator), but rather after the resize is complete.
     */
    @objc optional func drawerPositionDidChange(drawer: BottomSheetViewController, bottomSafeArea: CGFloat)
    
    /**
     *  Make UI adjustments for when BottomSheet goes to 'fullscreen'. Bottom safe area is provided for your convenience.
     */
    @objc optional func makeUIAdjustmentsForFullscreen(progress: CGFloat, bottomSafeArea: CGFloat)
    
    /**
     *  Make UI adjustments for changes in the drawer's distance-to-bottom. Bottom safe area is provided for your convenience.
     */
    @objc optional func drawerChangedDistanceFromBottom(drawer: BottomSheetViewController, distance: CGFloat, bottomSafeArea: CGFloat)
    
    /**
     *  Called when the current drawer display mode changes (leftSide vs bottomDrawer). Make UI changes to account for this here.
     */
    @objc optional func drawerDisplayModeDidChange(drawer: BottomSheetViewController)
}

/**
 *  View controllers in the drawer can implement this to receive changes in state or provide values for the different drawer positions.
 */
@objc public protocol BottomSheetDrawerViewControllerDelegate: BottomSheetDelegate {
    
    /**
     *  Provide the collapsed drawer height for BottomSheet. BottomSheet does NOT automatically handle safe areas for you, however: bottom safe area is provided for your convenience in computing a value to return.
     */
    @objc optional func collapsedDrawerHeight(bottomSafeArea: CGFloat) -> CGFloat
    
    /**
     *  Provide the partialReveal drawer height for BottomSheet. BottomSheet does NOT automatically handle safe areas for you, however: bottom safe area is provided for your convenience in computing a value to return.
     */
    @objc optional func partialRevealDrawerHeight(bottomSafeArea: CGFloat) -> CGFloat
    
    /**
     *  Return the support drawer positions for your drawer.
     */
    @objc optional func supportedDrawerPositions() -> [BottomSheetPosition]
}

/**
 *  View controllers that are the main content can implement this to receive changes in state.
 */
@objc public protocol BottomSheetPrimaryContentControllerDelegate: BottomSheetDelegate {
    
    // Not currently used for anything, but it's here for parity with the hopes that it'll one day be used.
}

/**
 *  A completion block used for animation callbacks.
 */
public typealias BottomSheetAnimationCompletionBlock = ((_ finished: Bool) -> Void)

/**
 Represents a BottomSheet drawer position.
 
 - collapsed:         When the drawer is in its smallest form, at the bottom of the screen.
 - partiallyRevealed: When the drawer is partially revealed.
 - open:              When the drawer is fully open.
 - closed:            When the drawer is off-screen at the bottom of the view. Note: Users cannot close or reopen the drawer on their own. You must set this programatically
 */
@objc public class BottomSheetPosition: NSObject {
    
    public static let collapsed = BottomSheetPosition(rawValue: 0)
    public static let partiallyRevealed = BottomSheetPosition(rawValue: 1)
    public static let open = BottomSheetPosition(rawValue: 2)
    public static let closed = BottomSheetPosition(rawValue: 3)
    
    public static let all: [BottomSheetPosition] = [
        .collapsed,
        .partiallyRevealed,
        .open,
        .closed
    ]
    
    let rawValue: Int
    
    init(rawValue: Int) {
        self.rawValue = rawValue
    }
    
    public static func positionFor(string: String?) -> BottomSheetPosition {
        
        guard let positionString = string?.lowercased() else {
            
            return .collapsed
        }
        
        switch positionString {
            
        case "collapsed":
            return .collapsed
            
        case "partiallyrevealed":
            return .partiallyRevealed
            
        case "open":
            return .open
            
        case "closed":
            return .closed
            
        default:
            print("BottomSheetViewController: Position for string '\(positionString)' not found. Available values are: collapsed, partiallyRevealed, open, and closed. Defaulting to collapsed.")
            return .collapsed
        }
    }
}

/// Represents the current display mode for BottomSheet
///
/// - panel: Show as a floating panel (replaces: leftSide)
/// - drawer: Show as a bottom drawer (replaces: bottomDrawer)
/// - automatic: Determine it based on device / orientation / size class (like Maps.app)
public enum BottomSheetDisplayMode {
    case panel
    case drawer
    case automatic
}


/// Represents the positioning of the drawer when the `displayMode` is set to either `BottomSheetDisplayMode.panel` or `BottomSheetDisplayMode.automatic`.
///
/// - topLeft: The drawer will placed in the upper left corner
/// - topRight: The drawer will placed in the upper right corner
/// - bottomLeft: The drawer will placed in the bottom left corner
/// - bottomRight: The drawer will placed in the bottom right corner
public enum BottomSheetPanelCornerPlacement {
    case topLeft
    case topRight
    case bottomLeft
    case bottomRight
}

/// Represents the 'snap' mode for BottomSheet. The default is 'nearest position'. You can use 'nearestPositionUnlessExceeded' to make the drawer feel lighter or heavier.
///
/// - nearestPosition: Snap to the nearest position when scroll stops
/// - nearestPositionUnlessExceeded: Snap to the nearest position when scroll stops, unless the distance is greater than 'threshold', in which case advance to the next drawer position.
public enum BottomSheetSnapMode {
    case nearestPosition
    case nearestPositionUnlessExceeded(threshold: CGFloat)
}

private let kBottomSheetDefaultCollapsedHeight: CGFloat = 68.0
private let kBottomSheetDefaultPartialRevealHeight: CGFloat = 264.0

open class BottomSheetViewController: UIViewController, BottomSheetDrawerViewControllerDelegate {
    
    // Internal
    fileprivate let primaryContentContainer: UIView = UIView()
    fileprivate let drawerContentContainer: UIView = UIView()
    fileprivate let drawerShadowView: UIView = UIView()
    fileprivate let drawerScrollView: BottomSheetPassthroughScrollView = BottomSheetPassthroughScrollView()
    fileprivate let backgroundDimmingView: UIView = UIView()
    
    fileprivate var dimmingViewTapRecognizer: UITapGestureRecognizer?
    
    fileprivate var lastDragTargetContentOffset: CGPoint = CGPoint.zero
    
    // Public
    
    public let bounceOverflowMargin: CGFloat = 20.0
    
    /// The current content view controller (shown behind the drawer).
    public fileprivate(set) var primaryContentViewController: UIViewController! {
        willSet {
            
            guard let controller = primaryContentViewController else {
                return
            }
            
            controller.willMove(toParent: nil)
            controller.view.removeFromSuperview()
            controller.removeFromParent()
        }
        
        didSet {
            
            guard let controller = primaryContentViewController else {
                return
            }
            
            addChild(controller)
            
            primaryContentContainer.addSubview(controller.view)
            
            controller.view.constrainToParent()
            
            controller.didMove(toParent: self)
            
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
                self.setNeedsSupportedDrawerPositionsUpdate()
            }
        }
    }
    
    /// The current drawer view controller (shown in the drawer).
    public fileprivate(set) var drawerContentViewController: UIViewController! {
        willSet {
            
            guard let controller = drawerContentViewController else {
                return
            }
            
            controller.willMove(toParent: nil)
            controller.view.removeFromSuperview()
            controller.removeFromParent()
        }
        
        didSet {
            
            guard let controller = drawerContentViewController else {
                return
            }
            
            addChild(controller)
            
            drawerContentContainer.addSubview(controller.view)
            
            controller.view.constrainToParent()
            
            controller.didMove(toParent: self)
            
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
                self.setNeedsSupportedDrawerPositionsUpdate()
            }
        }
    }
    
    /// Get the current bottom safe area for BottomSheet. This is a convenience accessor. Most delegate methods where you'd need it will deliver it as a parameter.
    public var bottomSafeSpace: CGFloat {
        get {
            return BottomSheetSafeAreaInsets.bottom
        }
    }
    
    /// The content view controller and drawer controller can receive delegate events already. This lets another object observe the changes, if needed.
    public weak var delegate: BottomSheetDelegate?
    
    /// The current position of the drawer.
    public fileprivate(set) var drawerPosition: BottomSheetPosition = .collapsed {
        didSet {
            setNeedsStatusBarAppearanceUpdate()
        }
    }
    
    // The visible height of the drawer. Useful for adjusting the display of content in the main content view.
    public var visibleDrawerHeight: CGFloat {
        if drawerPosition == .closed {
            return 0.0
        } else {
            return drawerScrollView.bounds.height
        }
    }
    
    /// The background visual effect layer for the drawer. By default this is the extraLight effect. You can change this if you want, or assign nil to remove it.
    public var drawerBackgroundVisualEffectView: UIVisualEffectView? = UIVisualEffectView(effect: UIBlurEffect(style: .extraLight)) {
        willSet {
            drawerBackgroundVisualEffectView?.removeFromSuperview()
        }
        didSet {
            
            if let drawerBackgroundVisualEffectView = drawerBackgroundVisualEffectView, self.isViewLoaded
            {
                drawerScrollView.insertSubview(drawerBackgroundVisualEffectView, aboveSubview: drawerShadowView)
                drawerBackgroundVisualEffectView.clipsToBounds = true
                drawerBackgroundVisualEffectView.layer.cornerRadius = drawerCornerRadius
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The inset from the top safe area when the drawer is fully open. This property is only for the 'drawer' displayMode. Use panelInsets to control the top/bottom/left/right insets for the panel.
    @IBInspectable public var drawerTopInset: CGFloat = 20.0 {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// This replaces the previous panelInsetLeft and panelInsetTop properties. Depending on what corner placement is being used, different values from this struct will apply. For example, 'topLeft' corner placement will utilize the .top, .left, and .bottom inset properties and it will ignore the .right property (use panelWidth property to specify width)
    @IBInspectable public var panelInsets: UIEdgeInsets = UIEdgeInsets(top: 10.0, left: 10.0, bottom: 10.0, right: 10.0) {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The width of the panel in panel displayMode
    @IBInspectable public var panelWidth: CGFloat = 325.0 {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The corner radius for the drawer.
    /// Note: This property is ignored if your drawerContentViewController's view.layer.mask has a custom mask applied using a CAShapeLayer.
    /// Note: Custom CAShapeLayer as your drawerContentViewController's view.layer mask will override BottomSheet's internal corner rounding and use that mask as the drawer mask.
    @IBInspectable public var drawerCornerRadius: CGFloat = 13.0 {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
                drawerBackgroundVisualEffectView?.layer.cornerRadius = drawerCornerRadius
            }
        }
    }
    
    /// The opacity of the drawer shadow.
    @IBInspectable public var shadowOpacity: Float = 0.1 {
        didSet {
            if self.isViewLoaded
            {
                drawerShadowView.layer.shadowOpacity = shadowOpacity
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The radius of the drawer shadow.
    @IBInspectable public var shadowRadius: CGFloat = 3.0 {
        didSet {
            if self.isViewLoaded
            {
                drawerShadowView.layer.shadowRadius = shadowRadius
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The offset of the drawer shadow.
    @IBInspectable public var shadowOffset = CGSize(width: 0.0, height: -3.0) {
        didSet {
            if self.isViewLoaded {
                drawerShadowView.layer.shadowOffset = shadowOffset
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The opaque color of the background dimming view.
    @IBInspectable public var backgroundDimmingColor: UIColor = UIColor.black {
        didSet {
            if self.isViewLoaded
            {
                backgroundDimmingView.backgroundColor = backgroundDimmingColor
            }
        }
    }
    
    /// The maximum amount of opacity when dimming.
    @IBInspectable public var backgroundDimmingOpacity: CGFloat = 0.5 {
        didSet {
            
            if self.isViewLoaded
            {
                self.scrollViewDidScroll(drawerScrollView)
            }
        }
    }
    
    /// The drawer scrollview's delaysContentTouches setting
    @IBInspectable public var delaysContentTouches: Bool = true {
        didSet {
            if self.isViewLoaded
            {
                drawerScrollView.delaysContentTouches = delaysContentTouches
            }
        }
    }
    
    /// The drawer scrollview's canCancelContentTouches setting
    @IBInspectable public var canCancelContentTouches: Bool = true {
        didSet {
            if self.isViewLoaded
            {
                drawerScrollView.canCancelContentTouches = canCancelContentTouches
            }
        }
    }
    
    /// The starting position for the drawer when it first loads
    public var initialDrawerPosition: BottomSheetPosition = .collapsed
    
    /// The display mode for BottomSheet. Default is 'drawer', which preserves the previous behavior of BottomSheet. If you want it to adapt automatically, choose 'automatic'. The current display mode is available by using the 'currentDisplayMode' property.
    public var displayMode: BottomSheetDisplayMode = .drawer {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The Y positioning for BottomSheet. This property is only oberserved when `displayMode` is set to `.automatic` or `bottom`. Default value is `.topLeft`.
    public var panelCornerPlacement: BottomSheetPanelCornerPlacement = .topLeft {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// This is here exclusively to support IBInspectable in Interface Builder because Interface Builder can't deal with enums. If you're doing this in code use the -initialDrawerPosition property instead. Available strings are: open, closed, partiallyRevealed, collapsed
    @IBInspectable public var initialDrawerPositionFromIB: String? {
        didSet {
            initialDrawerPosition = BottomSheetPosition.positionFor(string: initialDrawerPositionFromIB)
        }
    }
    
    /// Whether the drawer's position can be changed by the user. If set to `false`, the only way to move the drawer is programmatically. Defaults to `true`.
    @IBInspectable public var allowsUserDrawerPositionChange: Bool = true {
        didSet {
            enforceCanScrollDrawer()
        }
    }
    
    /// The animation duration for setting the drawer position
    @IBInspectable public var animationDuration: TimeInterval = 0.3
    
    /// The animation delay for setting the drawer position
    @IBInspectable public var animationDelay: TimeInterval = 0.0
    
    /// The spring damping for setting the drawer position
    @IBInspectable public var animationSpringDamping: CGFloat = 0.75
    
    /// The spring's initial velocity for setting the drawer position
    @IBInspectable public var animationSpringInitialVelocity: CGFloat = 0.0
    
    /// This setting allows you to enable/disable BottomSheet automatically insetting the drawer on the left/right when in 'bottomDrawer' display mode in a horizontal orientation on a device with a 'notch' or other left/right obscurement.
    @IBInspectable public var adjustDrawerHorizontalInsetToSafeArea: Bool = true {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
            }
        }
    }
    
    /// The animation options for setting the drawer position
    public var animationOptions: UIView.AnimationOptions = [.curveEaseInOut]
    
    /// The drawer snap mode
    public var snapMode: BottomSheetSnapMode = .nearestPositionUnlessExceeded(threshold: 20.0)
    
    // The feedback generator to use for drawer positon changes. Note: This is 'Any' to preserve iOS 9 compatibilty. Assign a UIFeedbackGenerator to this property. Anything else will be ignored.
    public var feedbackGenerator: Any?
    
    /// Access to the safe areas that BottomSheet is using for layout (provides compatibility for iOS < 11)
    public var BottomSheetSafeAreaInsets: UIEdgeInsets {
        
        var safeAreaBottomInset: CGFloat = 0
        var safeAreaLeftInset: CGFloat = 0
        var safeAreaRightInset: CGFloat = 0
        var safeAreaTopInset: CGFloat = 0
        
        if #available(iOS 11.0, *)
        {
            safeAreaBottomInset = view.safeAreaInsets.bottom
            safeAreaLeftInset = view.safeAreaInsets.left
            safeAreaRightInset = view.safeAreaInsets.right
            safeAreaTopInset = view.safeAreaInsets.top
        }
        else
        {
            safeAreaBottomInset = self.bottomLayoutGuide.length
            safeAreaTopInset = self.topLayoutGuide.length
        }
        
        return UIEdgeInsets(top: safeAreaTopInset, left: safeAreaLeftInset, bottom: safeAreaBottomInset, right: safeAreaRightInset)
    }
    
    /// Get the current drawer distance. This value is equivalent in nature to the one delivered by BottomSheetDelegate's `drawerChangedDistanceFromBottom` callback.
    public var drawerDistanceFromBottom: (distance: CGFloat, bottomSafeArea: CGFloat) {
        
        if self.isViewLoaded
        {
            let lowestStop = getStopList().min() ?? 0.0
            
            return (distance: drawerScrollView.contentOffset.y + lowestStop, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
        }
        
        return (distance: 0.0, bottomSafeArea: 0.0)
    }
    
    
    /// Get all gesture recognizers in the drawer scrollview
    public var drawerGestureRecognizers: [UIGestureRecognizer] {
        get {
            return drawerScrollView.gestureRecognizers ?? [UIGestureRecognizer]()
        }
    }
    
    /// Get the drawer scrollview's pan gesture recognizer
    public var drawerPanGestureRecognizer: UIPanGestureRecognizer {
        get {
            return drawerScrollView.panGestureRecognizer
        }
    }
    
    /// The drawer positions supported by the drawer
    fileprivate var supportedPositions: [BottomSheetPosition] = BottomSheetPosition.all {
        didSet {
            
            guard self.isViewLoaded else {
                return
            }
            
            guard supportedPositions.count > 0 else {
                supportedPositions = BottomSheetPosition.all
                return
            }
            
            self.view.setNeedsLayout()
            
            if supportedPositions.contains(drawerPosition)
            {
                setDrawerPosition(position: drawerPosition, animated: true)
            }
            else
            {
                let lowestDrawerState: BottomSheetPosition = supportedPositions.filter({ $0 != .closed }).min { (pos1, pos2) -> Bool in
                    return pos1.rawValue < pos2.rawValue
                    } ?? .collapsed
                
                setDrawerPosition(position: lowestDrawerState, animated: false)
            }
            
            enforceCanScrollDrawer()
        }
    }
    
    /// The currently rendered display mode for BottomSheet. This will match displayMode unless you have it set to 'automatic'. This will provide the 'actual' display mode (never automatic).
    public fileprivate(set) var currentDisplayMode: BottomSheetDisplayMode = .automatic {
        didSet {
            if self.isViewLoaded
            {
                self.view.setNeedsLayout()
            }
            
            if oldValue != currentDisplayMode
            {
                delegate?.drawerDisplayModeDidChange?(drawer: self)
                (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.drawerDisplayModeDidChange?(drawer: self)
                (primaryContentContainer as? BottomSheetPrimaryContentControllerDelegate)?.drawerDisplayModeDidChange?(drawer: self)
            }
        }
    }
    
    fileprivate var isAnimatingDrawerPosition: Bool = false
    
    /// The height of the open position for the drawer
    private var heightOfOpenDrawer: CGFloat {
        
        let safeAreaTopInset = BottomSheetSafeAreaInsets.top
        let safeAreaBottomInset = BottomSheetSafeAreaInsets.bottom
        
        var height = self.view.bounds.height - safeAreaTopInset
        
        if currentDisplayMode == .panel {
            height -= (panelInsets.top + bounceOverflowMargin)
            height -= (panelInsets.bottom + safeAreaBottomInset)
        } else if currentDisplayMode == .drawer {
            height -= drawerTopInset
        }
        
        return height
    }
    
    
    /**
     Initialize the drawer controller programmtically.
     
     - parameter contentViewController: The content view controller. This view controller is shown behind the drawer.
     - parameter drawerViewController:  The view controller to display inside the drawer.
     
     - note: The drawer VC is 20pts too tall in order to have some extra space for the bounce animation. Make sure your constraints / content layout take this into account.
     
     - returns: A newly created BottomSheet drawer.
     */
    @objc required public init(contentViewController: UIViewController, drawerViewController: UIViewController) {
        super.init(nibName: nil, bundle: nil)
        
        ({
            self.primaryContentViewController = contentViewController
            self.drawerContentViewController = drawerViewController
        })()
    }
    
    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override open func loadView() {
        super.loadView()
        
        // Setup
        primaryContentContainer.backgroundColor = UIColor.white
        
        definesPresentationContext = true
        
        drawerScrollView.bounces = false
        drawerScrollView.delegate = self
        drawerScrollView.clipsToBounds = false
        drawerScrollView.showsVerticalScrollIndicator = false
        drawerScrollView.showsHorizontalScrollIndicator = false
        
        drawerScrollView.delaysContentTouches = delaysContentTouches
        drawerScrollView.canCancelContentTouches = canCancelContentTouches
        
        drawerScrollView.backgroundColor = UIColor.clear
        drawerScrollView.decelerationRate = UIScrollView.DecelerationRate.fast
        drawerScrollView.scrollsToTop = false
        drawerScrollView.touchDelegate = self
        
        drawerShadowView.layer.shadowOpacity = shadowOpacity
        drawerShadowView.layer.shadowRadius = shadowRadius
        drawerShadowView.layer.shadowOffset = shadowOffset
        drawerShadowView.backgroundColor = UIColor.clear
        
        drawerContentContainer.backgroundColor = UIColor.clear
        
        backgroundDimmingView.backgroundColor = backgroundDimmingColor
        backgroundDimmingView.isUserInteractionEnabled = false
        backgroundDimmingView.alpha = 0.0
        
        drawerBackgroundVisualEffectView?.clipsToBounds = true
        
        dimmingViewTapRecognizer = UITapGestureRecognizer(target: self, action: #selector(BottomSheetViewController.dimmingViewTapRecognizerAction(gestureRecognizer:)))
        backgroundDimmingView.addGestureRecognizer(dimmingViewTapRecognizer!)
        
        drawerScrollView.addSubview(drawerShadowView)
        
        if let drawerBackgroundVisualEffectView = drawerBackgroundVisualEffectView
        {
            drawerScrollView.addSubview(drawerBackgroundVisualEffectView)
            drawerBackgroundVisualEffectView.layer.cornerRadius = drawerCornerRadius
        }
        
        drawerScrollView.addSubview(drawerContentContainer)
        
        primaryContentContainer.backgroundColor = UIColor.white
        
        self.view.backgroundColor = UIColor.white
        
        self.view.addSubview(primaryContentContainer)
        self.view.addSubview(backgroundDimmingView)
        self.view.addSubview(drawerScrollView)
        
        primaryContentContainer.constrainToParent()
    }
    
    override open func viewDidLoad() {
        super.viewDidLoad()
        
        enforceCanScrollDrawer()
        setDrawerPosition(position: initialDrawerPosition, animated: false)
        scrollViewDidScroll(drawerScrollView)
        
        delegate?.drawerDisplayModeDidChange?(drawer: self)
        (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.drawerDisplayModeDidChange?(drawer: self)
        (primaryContentContainer as? BottomSheetPrimaryContentControllerDelegate)?.drawerDisplayModeDidChange?(drawer: self)
    }
    
    override open func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        setNeedsSupportedDrawerPositionsUpdate()
    }
    
    override open func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        
        // Make sure our view controller views are subviews of the right view (Resolves #21 issue with changing the presentation context)
        
        // May be nil during initial layout
        if let primary = primaryContentViewController
        {
            if primary.view.superview != nil && primary.view.superview != primaryContentContainer
            {
                primaryContentContainer.addSubview(primary.view)
                primaryContentContainer.sendSubviewToBack(primary.view)
                
                primary.view.constrainToParent()
            }
        }
        
        // May be nil during initial layout
        if let drawer = drawerContentViewController
        {
            if drawer.view.superview != nil && drawer.view.superview != drawerContentContainer
            {
                drawerContentContainer.addSubview(drawer.view)
                drawerContentContainer.sendSubviewToBack(drawer.view)
                
                drawer.view.constrainToParent()
            }
        }
        
        let safeAreaTopInset = BottomSheetSafeAreaInsets.top
        let safeAreaBottomInset = BottomSheetSafeAreaInsets.bottom
        let safeAreaLeftInset = BottomSheetSafeAreaInsets.left
        let safeAreaRightInset = BottomSheetSafeAreaInsets.right
        
        
        let displayModeForCurrentLayout: BottomSheetDisplayMode = displayMode != .automatic ? displayMode : ((self.view.bounds.width >= 600.0 || self.traitCollection.horizontalSizeClass == .regular) ? .panel : .drawer)
        
        currentDisplayMode = displayModeForCurrentLayout
        
        if displayModeForCurrentLayout == .drawer
        {
            // Bottom inset for safe area / bottomLayoutGuide
            if #available(iOS 11, *) {
                self.drawerScrollView.contentInsetAdjustmentBehavior = .scrollableAxes
            } else {
                self.automaticallyAdjustsScrollViewInsets = false
                self.drawerScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: self.bottomLayoutGuide.length, right: 0)
                self.drawerScrollView.scrollIndicatorInsets =  UIEdgeInsets(top: 0, left: 0, bottom: self.bottomLayoutGuide.length, right: 0) // (usefull if visible..)
            }
            
            let lowestStop = getStopList().min() ?? 0
            
            let adjustedLeftSafeArea = adjustDrawerHorizontalInsetToSafeArea ? safeAreaLeftInset : 0.0
            let adjustedRightSafeArea = adjustDrawerHorizontalInsetToSafeArea ? safeAreaRightInset : 0.0
            
            if supportedPositions.contains(.open)
            {
                // Layout scrollview
                drawerScrollView.frame = CGRect(x: adjustedLeftSafeArea, y: drawerTopInset + safeAreaTopInset, width: self.view.bounds.width - adjustedLeftSafeArea - adjustedRightSafeArea, height: heightOfOpenDrawer)
            }
            else
            {
                // Layout scrollview
                let adjustedTopInset: CGFloat = getStopList().max() ?? 0.0
                drawerScrollView.frame = CGRect(x: adjustedLeftSafeArea, y: self.view.bounds.height - adjustedTopInset, width: self.view.bounds.width - adjustedLeftSafeArea - adjustedRightSafeArea, height: adjustedTopInset)
            }
            
            drawerScrollView.addSubview(drawerShadowView)
            
            if let drawerBackgroundVisualEffectView = drawerBackgroundVisualEffectView
            {
                drawerScrollView.addSubview(drawerBackgroundVisualEffectView)
                drawerBackgroundVisualEffectView.layer.cornerRadius = drawerCornerRadius
            }
            
            drawerScrollView.addSubview(drawerContentContainer)
            
            drawerContentContainer.frame = CGRect(x: 0, y: drawerScrollView.bounds.height - lowestStop, width: drawerScrollView.bounds.width, height: drawerScrollView.bounds.height + bounceOverflowMargin)
            drawerBackgroundVisualEffectView?.frame = drawerContentContainer.frame
            drawerShadowView.frame = drawerContentContainer.frame
            drawerScrollView.contentSize = CGSize(width: drawerScrollView.bounds.width, height: (drawerScrollView.bounds.height - lowestStop) + drawerScrollView.bounds.height - safeAreaBottomInset + (bounceOverflowMargin - 5.0))
            
            // Update rounding mask and shadows
            let borderPath = drawerMaskingPath(byRoundingCorners: [.topLeft, .topRight, .bottomLeft, .bottomRight]).cgPath
            
            let cardMaskLayer = CAShapeLayer()
            cardMaskLayer.path = borderPath
            cardMaskLayer.frame = drawerContentContainer.bounds
            cardMaskLayer.fillColor = UIColor.white.cgColor
            cardMaskLayer.backgroundColor = UIColor.clear.cgColor
            drawerContentContainer.layer.mask = cardMaskLayer
            drawerShadowView.layer.shadowPath = borderPath
            
            backgroundDimmingView.frame = CGRect(x: 0.0, y: 0.0, width: self.view.bounds.width, height: self.view.bounds.height + drawerScrollView.contentSize.height)
            
            drawerScrollView.transform = CGAffineTransform.identity
            
            backgroundDimmingView.isHidden = false
        }
        else
        {
            // Bottom inset for safe area / bottomLayoutGuide
            if #available(iOS 11, *) {
                self.drawerScrollView.contentInsetAdjustmentBehavior = .scrollableAxes
            } else {
                self.automaticallyAdjustsScrollViewInsets = false
                self.drawerScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0.0, right: 0)
                self.drawerScrollView.scrollIndicatorInsets =  UIEdgeInsets(top: 0, left: 0, bottom: 0.0, right: 0)
            }
            
            // Layout container
            var collapsedHeight:CGFloat = kBottomSheetDefaultCollapsedHeight
            var partialRevealHeight:CGFloat = kBottomSheetDefaultPartialRevealHeight
            
            if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate
            {
                collapsedHeight = drawerVCCompliant.collapsedDrawerHeight?(bottomSafeArea: safeAreaBottomInset) ?? kBottomSheetDefaultCollapsedHeight
                partialRevealHeight = drawerVCCompliant.partialRevealDrawerHeight?(bottomSafeArea: safeAreaBottomInset) ?? kBottomSheetDefaultPartialRevealHeight
            }
            
            let lowestStop = [(self.view.bounds.size.height - panelInsets.bottom - safeAreaTopInset), collapsedHeight, partialRevealHeight].min() ?? 0
            
            let xOrigin = (panelCornerPlacement == .bottomLeft || panelCornerPlacement == .topLeft) ? (safeAreaLeftInset + panelInsets.left) : (self.view.bounds.maxX - (safeAreaRightInset + panelInsets.right) - panelWidth)
            
            let yOrigin = (panelCornerPlacement == .bottomLeft || panelCornerPlacement == .bottomRight) ? (panelInsets.top + safeAreaTopInset) : (panelInsets.top + safeAreaTopInset + bounceOverflowMargin)
            
            if supportedPositions.contains(.open)
            {
                // Layout scrollview
                drawerScrollView.frame = CGRect(x: xOrigin, y: yOrigin, width: panelWidth, height: heightOfOpenDrawer)
            }
            else
            {
                // Layout scrollview
                let adjustedTopInset: CGFloat = supportedPositions.contains(.partiallyRevealed) ? partialRevealHeight : collapsedHeight
                drawerScrollView.frame = CGRect(x: xOrigin, y: yOrigin, width: panelWidth, height: adjustedTopInset)
            }
            
            syncDrawerContentViewSizeToMatchScrollPositionForSideDisplayMode()
            
            drawerScrollView.contentSize = CGSize(width: drawerScrollView.bounds.width, height: self.view.bounds.height + (self.view.bounds.height - lowestStop))
            
            switch panelCornerPlacement {
            case .topLeft, .topRight:
                drawerScrollView.transform = CGAffineTransform(scaleX: 1.0, y: -1.0)
            case .bottomLeft, .bottomRight:
                drawerScrollView.transform = CGAffineTransform(scaleX: 1.0, y: 1.0)
            }
            
            backgroundDimmingView.isHidden = true
        }
        
        drawerContentContainer.transform = drawerScrollView.transform
        drawerShadowView.transform = drawerScrollView.transform
        drawerBackgroundVisualEffectView?.transform = drawerScrollView.transform
        
        let lowestStop = getStopList().min() ?? 0
        
        delegate?.drawerChangedDistanceFromBottom?(drawer: self, distance: drawerScrollView.contentOffset.y + lowestStop, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
        (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.drawerChangedDistanceFromBottom?(drawer: self, distance: drawerScrollView.contentOffset.y + lowestStop, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
        (primaryContentViewController as? BottomSheetPrimaryContentControllerDelegate)?.drawerChangedDistanceFromBottom?(drawer: self, distance: drawerScrollView.contentOffset.y + lowestStop, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
        
        maskDrawerVisualEffectView()
        maskBackgroundDimmingView()
        setDrawerPosition(position: drawerPosition, animated: false)
    }
    
    // MARK: Private State Updates
    
    private func enforceCanScrollDrawer() {
        guard isViewLoaded else {
            return
        }
        
        drawerScrollView.isScrollEnabled = allowsUserDrawerPositionChange && supportedPositions.count > 1
    }
    
    func getStopList() -> [CGFloat] {
        
        var drawerStops = [CGFloat]()
        
        var collapsedHeight:CGFloat = kBottomSheetDefaultCollapsedHeight
        var partialRevealHeight:CGFloat = kBottomSheetDefaultPartialRevealHeight
        
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate
        {
            collapsedHeight = drawerVCCompliant.collapsedDrawerHeight?(bottomSafeArea: BottomSheetSafeAreaInsets.bottom) ?? kBottomSheetDefaultCollapsedHeight
            partialRevealHeight = drawerVCCompliant.partialRevealDrawerHeight?(bottomSafeArea: BottomSheetSafeAreaInsets.bottom) ?? kBottomSheetDefaultPartialRevealHeight
        }
        
        if supportedPositions.contains(.collapsed)
        {
            drawerStops.append(collapsedHeight)
        }
        
        if supportedPositions.contains(.partiallyRevealed)
        {
            drawerStops.append(partialRevealHeight)
        }
        
        if supportedPositions.contains(.open)
        {
            drawerStops.append((self.view.bounds.size.height - drawerTopInset - BottomSheetSafeAreaInsets.top))
        }
        
        return drawerStops
    }
    
    /**
     Returns a masking path appropriate for the drawer content. Either
     an existing user-supplied mask from the `drawerContentViewController's`
     view will be returned, or the default BottomSheet mask with the requested
     rounded corners will be used.
     
     - parameter corners: The corners to round if there is no custom mask
     already applied to the `drawerContentViewController` view. If the
     `drawerContentViewController` has a custom mask (supplied by the
     user of this library), then the corners parameter will be ignored.
     */
    private func drawerMaskingPath(byRoundingCorners corners: UIRectCorner) -> UIBezierPath {
        drawerContentViewController.view.layoutIfNeeded()
        
        let path: UIBezierPath
        if let customPath = (drawerContentViewController.view.layer.mask as? CAShapeLayer)?.path {
            path = UIBezierPath(cgPath: customPath)
        } else {
            path = UIBezierPath(roundedRect: drawerContentContainer.bounds,
                                byRoundingCorners: corners,
                                cornerRadii: CGSize(width: drawerCornerRadius, height: drawerCornerRadius))
        }
        
        return path
    }
    
    private func maskDrawerVisualEffectView() {
        if let drawerBackgroundVisualEffectView = drawerBackgroundVisualEffectView {
            let path = drawerMaskingPath(byRoundingCorners: [.topLeft, .topRight])
            let maskLayer = CAShapeLayer()
            maskLayer.path = path.cgPath
            
            drawerBackgroundVisualEffectView.layer.mask = maskLayer
        }
    }
    
    /**
     Mask backgroundDimmingView layer to avoid drawer background beeing darkened.
     */
    private func maskBackgroundDimmingView() {
        let cutoutHeight = 2 * drawerCornerRadius
        let maskHeight = backgroundDimmingView.bounds.size.height - cutoutHeight - drawerScrollView.contentSize.height
        let borderPath = drawerMaskingPath(byRoundingCorners: [.topLeft, .topRight])
        borderPath.apply(CGAffineTransform(translationX: 0.0, y: maskHeight))
        let maskLayer = CAShapeLayer()
        
        // Invert mask to cut away the bottom part of the dimming view
        borderPath.append(UIBezierPath(rect: backgroundDimmingView.bounds))
        maskLayer.fillRule = CAShapeLayerFillRule.evenOdd
        
        maskLayer.path = borderPath.cgPath
        backgroundDimmingView.layer.mask = maskLayer
    }
    
    open func prepareFeedbackGenerator() {
        
        if #available(iOS 10.0, *) {
            if let generator = feedbackGenerator as? UIFeedbackGenerator
            {
                generator.prepare()
            }
        }
    }
    
    open func triggerFeedbackGenerator() {
        
        if #available(iOS 10.0, *) {
            
            prepareFeedbackGenerator()
            
            (feedbackGenerator as? UIImpactFeedbackGenerator)?.impactOccurred()
            (feedbackGenerator as? UISelectionFeedbackGenerator)?.selectionChanged()
            (feedbackGenerator as? UINotificationFeedbackGenerator)?.notificationOccurred(.success)
        }
    }
    
    /// Add a gesture recognizer to the drawer scrollview
    ///
    /// - Parameter gestureRecognizer: The gesture recognizer to add
    public func addDrawerGestureRecognizer(gestureRecognizer: UIGestureRecognizer) {
        drawerScrollView.addGestureRecognizer(gestureRecognizer)
    }
    
    /// Remove a gesture recognizer from the drawer scrollview
    ///
    /// - Parameter gestureRecognizer: The gesture recognizer to remove
    public func removeDrawerGestureRecognizer(gestureRecognizer: UIGestureRecognizer) {
        drawerScrollView.removeGestureRecognizer(gestureRecognizer)
    }
    
    /// Bounce the drawer to get user attention. Note: Only works in .drawer display mode and when the drawer is in .collapsed or .partiallyRevealed position.
    ///
    /// - Parameters:
    ///   - bounceHeight: The height to bounce
    ///   - speedMultiplier: The multiplier to apply to the default speed of the animation. Note, default speed is 0.75.
    public func bounceDrawer(bounceHeight: CGFloat = 50.0, speedMultiplier: Double = 0.75) {
        
        guard drawerPosition == .collapsed || drawerPosition == .partiallyRevealed else {
            print("BottomSheet: Error: You can only bounce the drawer when it's in the collapsed or partially revealed position.")
            return
        }
        
        guard currentDisplayMode == .drawer else {
            print("BottomSheet: Error: You can only bounce the drawer when it's in the .drawer display mode.")
            return
        }
        
        let drawerStartingBounds = drawerScrollView.bounds
        
        // Adapted from https://www.cocoanetics.com/2012/06/lets-bounce/
        let factors: [CGFloat] = [0, 32, 60, 83, 100, 114, 124, 128, 128, 124, 114, 100, 83, 60, 32,
                                  0, 24, 42, 54, 62, 64, 62, 54, 42, 24, 0, 18, 28, 32, 28, 18, 0]
        
        var values = [CGFloat]()
        
        for factor in factors
        {
            let positionOffset = (factor / 128.0) * bounceHeight
            values.append(drawerStartingBounds.origin.y + positionOffset)
        }
        
        let animation = CAKeyframeAnimation(keyPath: "bounds.origin.y")
        animation.repeatCount = 1
        animation.duration = (32.0/30.0) * speedMultiplier
        animation.fillMode = CAMediaTimingFillMode.forwards
        animation.values = values
        animation.isRemovedOnCompletion = true
        animation.autoreverses = false
        
        drawerScrollView.layer.add(animation, forKey: "bounceAnimation")
    }
    
    /**
     Get a frame for moving backgroundDimmingView according to drawer position.
     
     - parameter drawerPosition: drawer position in points
     
     - returns: a frame for moving backgroundDimmingView according to drawer position
     */
    private func backgroundDimmingViewFrameForDrawerPosition(_ drawerPosition: CGFloat) -> CGRect {
        let cutoutHeight = (2 * drawerCornerRadius)
        var backgroundDimmingViewFrame = backgroundDimmingView.frame
        backgroundDimmingViewFrame.origin.y = 0 - drawerPosition + cutoutHeight
        
        return backgroundDimmingViewFrame
    }
    
    private func syncDrawerContentViewSizeToMatchScrollPositionForSideDisplayMode() {
        
        guard currentDisplayMode == .panel else {
            return
        }
        
        let lowestStop = getStopList().min() ?? 0
        
        drawerContentContainer.frame = CGRect(x: 0.0, y: drawerScrollView.bounds.height - lowestStop , width: drawerScrollView.bounds.width, height: drawerScrollView.contentOffset.y + lowestStop + bounceOverflowMargin)
        drawerBackgroundVisualEffectView?.frame = drawerContentContainer.frame
        drawerShadowView.frame = drawerContentContainer.frame
        
        // Update rounding mask and shadows
        let borderPath = drawerMaskingPath(byRoundingCorners: [.topLeft, .topRight, .bottomLeft, .bottomRight]).cgPath
        
        let cardMaskLayer = CAShapeLayer()
        cardMaskLayer.path = borderPath
        cardMaskLayer.frame = drawerContentContainer.bounds
        cardMaskLayer.fillColor = UIColor.white.cgColor
        cardMaskLayer.backgroundColor = UIColor.clear.cgColor
        drawerContentContainer.layer.mask = cardMaskLayer
        
        maskDrawerVisualEffectView()
        
        if !isAnimatingDrawerPosition || borderPath.boundingBox.height < drawerShadowView.layer.shadowPath?.boundingBox.height ?? 0.0
        {
            drawerShadowView.layer.shadowPath = borderPath
        }
    }
    
    // MARK: Configuration Updates
    
    /**
     Set the drawer position, with an option to animate.
     
     - parameter position: The position to set the drawer to.
     - parameter animated: Whether or not to animate the change. (Default: true)
     - parameter completion: A block object to be executed when the animation sequence ends. The Bool indicates whether or not the animations actually finished before the completion handler was called. (Default: nil)
     */
    public func setDrawerPosition(position: BottomSheetPosition, animated: Bool, completion: BottomSheetAnimationCompletionBlock? = nil) {
        guard supportedPositions.contains(position) else {
            
            print("BottomSheetViewController: You can't set the drawer position to something not supported by the current view controller contained in the drawer. If you haven't already, you may need to implement the BottomSheetDrawerViewControllerDelegate.")
            return
        }
        
        drawerPosition = position
        
        var collapsedHeight:CGFloat = kBottomSheetDefaultCollapsedHeight
        var partialRevealHeight:CGFloat = kBottomSheetDefaultPartialRevealHeight
        
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate
        {
            collapsedHeight = drawerVCCompliant.collapsedDrawerHeight?(bottomSafeArea: BottomSheetSafeAreaInsets.bottom) ?? kBottomSheetDefaultCollapsedHeight
            partialRevealHeight = drawerVCCompliant.partialRevealDrawerHeight?(bottomSafeArea: BottomSheetSafeAreaInsets.bottom) ?? kBottomSheetDefaultPartialRevealHeight
        }
        
        let stopToMoveTo: CGFloat
        
        switch drawerPosition {
            
        case .collapsed:
            stopToMoveTo = collapsedHeight
            
        case .partiallyRevealed:
            stopToMoveTo = partialRevealHeight
            
        case .open:
            stopToMoveTo = heightOfOpenDrawer
            
        case .closed:
            stopToMoveTo = 0
            
        default:
            stopToMoveTo = 0
        }
        
        let lowestStop = getStopList().min() ?? 0
        
        triggerFeedbackGenerator()
        
        if animated && self.view.window != nil
        {
            isAnimatingDrawerPosition = true
            UIView.animate(withDuration: animationDuration, delay: animationDelay, usingSpringWithDamping: animationSpringDamping, initialSpringVelocity: animationSpringInitialVelocity, options: animationOptions, animations: { [weak self] () -> Void in
                
                self?.drawerScrollView.setContentOffset(CGPoint(x: 0, y: stopToMoveTo - lowestStop), animated: false)
                
                // Move backgroundDimmingView to avoid drawer background being darkened
                self?.backgroundDimmingView.frame = self?.backgroundDimmingViewFrameForDrawerPosition(stopToMoveTo) ?? CGRect.zero
                
                if let drawer = self
                {
                    drawer.delegate?.drawerPositionDidChange?(drawer: drawer, bottomSafeArea: self?.BottomSheetSafeAreaInsets.bottom ?? 0.0)
                    (drawer.drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.drawerPositionDidChange?(drawer: drawer, bottomSafeArea: self?.BottomSheetSafeAreaInsets.bottom ?? 0.0)
                    (drawer.primaryContentViewController as? BottomSheetPrimaryContentControllerDelegate)?.drawerPositionDidChange?(drawer: drawer, bottomSafeArea: self?.BottomSheetSafeAreaInsets.bottom ?? 0.0)
                    
                    drawer.view.layoutIfNeeded()
                }
                
                }, completion: { [weak self] (completed) in
                    
                    self?.isAnimatingDrawerPosition = false
                    self?.syncDrawerContentViewSizeToMatchScrollPositionForSideDisplayMode()
                    
                    completion?(completed)
            })
        }
        else
        {
            drawerScrollView.setContentOffset(CGPoint(x: 0, y: stopToMoveTo - lowestStop), animated: false)
            
            // Move backgroundDimmingView to avoid drawer background being darkened
            backgroundDimmingView.frame = backgroundDimmingViewFrameForDrawerPosition(stopToMoveTo)
            
            delegate?.drawerPositionDidChange?(drawer: self, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
            (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.drawerPositionDidChange?(drawer: self, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
            (primaryContentViewController as? BottomSheetPrimaryContentControllerDelegate)?.drawerPositionDidChange?(drawer: self, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
            
            completion?(true)
        }
    }
    
    /**
     Set the drawer position, by default the change will be animated. Deprecated. Recommend switching to the other setDrawerPosition method, this one will be removed in a future release.
     
     - parameter position: The position to set the drawer to.
     - parameter isAnimated: Whether or not to animate the change. Default: true
     */
    @available(*, deprecated)
    public func setDrawerPosition(position: BottomSheetPosition, isAnimated: Bool = true)
    {
        setDrawerPosition(position: position, animated: isAnimated)
    }
    
    /**
     Change the current primary content view controller (The one behind the drawer)
     
     - parameter controller: The controller to replace it with
     - parameter animated:   Whether or not to animate the change. Defaults to true.
     - parameter completion: A block object to be executed when the animation sequence ends. The Bool indicates whether or not the animations actually finished before the completion handler was called.
     */
    public func setPrimaryContentViewController(controller: UIViewController, animated: Bool = true, completion: BottomSheetAnimationCompletionBlock?)
    {
        // Account for transition issue in iOS 11
        controller.view.frame = primaryContentContainer.bounds
        controller.view.layoutIfNeeded()
        
        if animated
        {
            UIView.transition(with: primaryContentContainer, duration: 0.5, options: .transitionCrossDissolve, animations: { [weak self] () -> Void in
                
                self?.primaryContentViewController = controller
                
                }, completion: { (completed) in
                    
                    completion?(completed)
            })
        }
        else
        {
            primaryContentViewController = controller
            completion?(true)
        }
    }
    
    /**
     Change the current primary content view controller (The one behind the drawer). This method exists for backwards compatibility.
     
     - parameter controller: The controller to replace it with
     - parameter animated:   Whether or not to animate the change. Defaults to true.
     */
    public func setPrimaryContentViewController(controller: UIViewController, animated: Bool = true)
    {
        setPrimaryContentViewController(controller: controller, animated: animated, completion: nil)
    }
    
    /**
     Change the current drawer content view controller (The one inside the drawer)
     
     - parameter controller: The controller to replace it with
     - parameter animated:   Whether or not to animate the change.
     - parameter completion: A block object to be executed when the animation sequence ends. The Bool indicates whether or not the animations actually finished before the completion handler was called.
     */
    public func setDrawerContentViewController(controller: UIViewController, animated: Bool = true, completion: BottomSheetAnimationCompletionBlock?)
    {
        // Account for transition issue in iOS 11
        controller.view.frame = drawerContentContainer.bounds
        controller.view.layoutIfNeeded()
        
        if animated
        {
            UIView.transition(with: drawerContentContainer, duration: 0.5, options: .transitionCrossDissolve, animations: { [weak self] () -> Void in
                
                self?.drawerContentViewController = controller
                self?.setDrawerPosition(position: self?.drawerPosition ?? .collapsed, animated: false)
                
                }, completion: { (completed) in
                    
                    completion?(completed)
            })
        }
        else
        {
            drawerContentViewController = controller
            setDrawerPosition(position: drawerPosition, animated: false)
            
            completion?(true)
        }
    }
    
    /**
     Change the current drawer content view controller (The one inside the drawer). This method exists for backwards compatibility.
     
     - parameter controller: The controller to replace it with
     - parameter animated:   Whether or not to animate the change.
     */
    public func setDrawerContentViewController(controller: UIViewController, animated: Bool = true)
    {
        setDrawerContentViewController(controller: controller, animated: animated, completion: nil)
    }
    
    /**
     Update the supported drawer positions allows by the BottomSheet Drawer
     */
    public func setNeedsSupportedDrawerPositionsUpdate()
    {
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate
        {
            supportedPositions = drawerVCCompliant.supportedDrawerPositions?() ?? BottomSheetPosition.all
        }
        else
        {
            supportedPositions = BottomSheetPosition.all
        }
    }
    
    // MARK: Actions
    
    @objc func dimmingViewTapRecognizerAction(gestureRecognizer: UITapGestureRecognizer)
    {
        if gestureRecognizer == dimmingViewTapRecognizer
        {
            if gestureRecognizer.state == .ended
            {
                self.setDrawerPosition(position: .collapsed, animated: true)
            }
        }
    }
    
    // MARK: Propogate child view controller style / status bar presentation based on drawer state
    
    override open var childForStatusBarStyle: UIViewController? {
        get {
            
            if drawerPosition == .open {
                return drawerContentViewController
            }
            
            return primaryContentViewController
        }
    }
    
    override open var childForStatusBarHidden: UIViewController? {
        get {
            if drawerPosition == .open {
                return drawerContentViewController
            }
            
            return primaryContentViewController
        }
    }
    
    open override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransition(to: size, with: coordinator)
        
        if #available(iOS 10.0, *) {
            coordinator.notifyWhenInteractionChanges { [weak self] context in
                guard let currentPosition = self?.drawerPosition else { return }
                self?.setDrawerPosition(position: currentPosition, animated: false)
            }
        } else {
            coordinator.notifyWhenInteractionEnds { [weak self] context in
                guard let currentPosition = self?.drawerPosition else { return }
                self?.setDrawerPosition(position: currentPosition, animated: false)
            }
        }
        
    }
    
    // MARK: BottomSheetDrawerViewControllerDelegate implementation for nested BottomSheet view controllers in drawers. Implemented here, rather than an extension because overriding extensions in subclasses isn't good practice. Some developers want to subclass BottomSheet and customize these behaviors, so we'll move them here.
    
    open func collapsedDrawerHeight(bottomSafeArea: CGFloat) -> CGFloat {
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate,
            let collapsedHeight = drawerVCCompliant.collapsedDrawerHeight?(bottomSafeArea: bottomSafeArea) {
            return collapsedHeight
        } else {
            return 68.0 + bottomSafeArea
        }
    }
    
    open func partialRevealDrawerHeight(bottomSafeArea: CGFloat) -> CGFloat {
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate,
            let partialRevealHeight = drawerVCCompliant.partialRevealDrawerHeight?(bottomSafeArea: bottomSafeArea) {
            return partialRevealHeight
        } else {
            return 264.0 + bottomSafeArea
        }
    }
    
    open func supportedDrawerPositions() -> [BottomSheetPosition] {
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate,
            let supportedPositions = drawerVCCompliant.supportedDrawerPositions?() {
            return supportedPositions
        } else {
            return BottomSheetPosition.all
        }
    }
    
    open func drawerPositionDidChange(drawer: BottomSheetViewController, bottomSafeArea: CGFloat) {
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate {
            drawerVCCompliant.drawerPositionDidChange?(drawer: drawer, bottomSafeArea: bottomSafeArea)
        }
    }
    
    open func makeUIAdjustmentsForFullscreen(progress: CGFloat, bottomSafeArea: CGFloat) {
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate {
            drawerVCCompliant.makeUIAdjustmentsForFullscreen?(progress: progress, bottomSafeArea: bottomSafeArea)
        }
    }
    
    open func drawerChangedDistanceFromBottom(drawer: BottomSheetViewController, distance: CGFloat, bottomSafeArea: CGFloat) {
        if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate {
            drawerVCCompliant.drawerChangedDistanceFromBottom?(drawer: drawer, distance: distance, bottomSafeArea: bottomSafeArea)
        }
    }
}

extension BottomSheetViewController: BottomSheetPassthroughScrollViewDelegate {
    
    func shouldTouchPassthroughScrollView(scrollView: BottomSheetPassthroughScrollView, point: CGPoint) -> Bool
    {
        return !drawerContentContainer.bounds.contains(drawerContentContainer.convert(point, from: scrollView))
    }
    
    func viewToReceiveTouch(scrollView: BottomSheetPassthroughScrollView, point: CGPoint) -> UIView
    {
        if currentDisplayMode == .drawer
        {
            if drawerPosition == .open
            {
                return backgroundDimmingView
            }
            
            return primaryContentContainer
        }
        else
        {
            if drawerContentContainer.bounds.contains(drawerContentContainer.convert(point, from: scrollView))
            {
                return drawerContentViewController.view
            }
            
            return primaryContentContainer
        }
    }
}

extension BottomSheetViewController: UIScrollViewDelegate {
    
    public func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {
        
        if scrollView == drawerScrollView
        {
            // Find the closest anchor point and snap there.
            var collapsedHeight:CGFloat = kBottomSheetDefaultCollapsedHeight
            var partialRevealHeight:CGFloat = kBottomSheetDefaultPartialRevealHeight
            
            if let drawerVCCompliant = drawerContentViewController as? BottomSheetDrawerViewControllerDelegate
            {
                collapsedHeight = drawerVCCompliant.collapsedDrawerHeight?(bottomSafeArea: BottomSheetSafeAreaInsets.bottom) ?? kBottomSheetDefaultCollapsedHeight
                partialRevealHeight = drawerVCCompliant.partialRevealDrawerHeight?(bottomSafeArea: BottomSheetSafeAreaInsets.bottom) ?? kBottomSheetDefaultPartialRevealHeight
            }
            
            var drawerStops: [CGFloat] = [CGFloat]()
            var currentDrawerPositionStop: CGFloat = 0.0
            
            if supportedPositions.contains(.open)
            {
                drawerStops.append(heightOfOpenDrawer)
                
                if drawerPosition == .open
                {
                    currentDrawerPositionStop = drawerStops.last!
                }
            }
            
            if supportedPositions.contains(.partiallyRevealed)
            {
                drawerStops.append(partialRevealHeight)
                
                if drawerPosition == .partiallyRevealed
                {
                    currentDrawerPositionStop = drawerStops.last!
                }
            }
            
            if supportedPositions.contains(.collapsed)
            {
                drawerStops.append(collapsedHeight)
                
                if drawerPosition == .collapsed
                {
                    currentDrawerPositionStop = drawerStops.last!
                }
            }
            
            let lowestStop = drawerStops.min() ?? 0
            
            let distanceFromBottomOfView = lowestStop + lastDragTargetContentOffset.y
            
            var currentClosestStop = lowestStop
            
            for currentStop in drawerStops
            {
                if abs(currentStop - distanceFromBottomOfView) < abs(currentClosestStop - distanceFromBottomOfView)
                {
                    currentClosestStop = currentStop
                }
            }
            
            var closestValidDrawerPosition: BottomSheetPosition = drawerPosition
            
            if abs(Float(currentClosestStop - heightOfOpenDrawer)) <= Float.ulpOfOne && supportedPositions.contains(.open)
            {
                closestValidDrawerPosition = .open
            }
            else if abs(Float(currentClosestStop - collapsedHeight)) <= Float.ulpOfOne && supportedPositions.contains(.collapsed)
            {
                closestValidDrawerPosition = .collapsed
            }
            else if supportedPositions.contains(.partiallyRevealed)
            {
                closestValidDrawerPosition = .partiallyRevealed
            }
            
            let snapModeToUse: BottomSheetSnapMode = closestValidDrawerPosition == drawerPosition ? snapMode : .nearestPosition
            
            switch snapModeToUse {
                
            case .nearestPosition:
                
                setDrawerPosition(position: closestValidDrawerPosition, animated: true)
                
            case .nearestPositionUnlessExceeded(let threshold):
                
                let distance = currentDrawerPositionStop - distanceFromBottomOfView
                
                var positionToSnapTo: BottomSheetPosition = drawerPosition
                
                if abs(distance) > threshold
                {
                    if distance < 0
                    {
                        let orderedSupportedDrawerPositions = supportedPositions.sorted(by: { $0.rawValue < $1.rawValue }).filter({ $0 != .closed })
                        
                        for position in orderedSupportedDrawerPositions
                        {
                            if position.rawValue > drawerPosition.rawValue
                            {
                                positionToSnapTo = position
                                break
                            }
                        }
                    }
                    else
                    {
                        let orderedSupportedDrawerPositions = supportedPositions.sorted(by: { $0.rawValue > $1.rawValue }).filter({ $0 != .closed })
                        
                        for position in orderedSupportedDrawerPositions
                        {
                            if position.rawValue < drawerPosition.rawValue
                            {
                                positionToSnapTo = position
                                break
                            }
                        }
                    }
                }
                
                setDrawerPosition(position: positionToSnapTo, animated: true)
            }
        }
    }
    
    public func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>) {
        
        if scrollView == drawerScrollView
        {
            lastDragTargetContentOffset = targetContentOffset.pointee
            
            // Halt intertia
            targetContentOffset.pointee = scrollView.contentOffset
        }
    }
    
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        
        if scrollView == drawerScrollView
        {
            let partialRevealHeight: CGFloat = (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.partialRevealDrawerHeight?(bottomSafeArea: BottomSheetSafeAreaInsets.bottom) ?? kBottomSheetDefaultPartialRevealHeight
            
            let lowestStop = getStopList().min() ?? 0
            
            if (scrollView.contentOffset.y - BottomSheetSafeAreaInsets.bottom) > partialRevealHeight - lowestStop && supportedPositions.contains(.open)
            {
                // Calculate percentage between partial and full reveal
                let fullRevealHeight = heightOfOpenDrawer
                let progress: CGFloat
                if fullRevealHeight == partialRevealHeight {
                    progress = 1.0
                } else {
                    progress = (scrollView.contentOffset.y - (partialRevealHeight - lowestStop)) / (fullRevealHeight - (partialRevealHeight))
                }
                
                delegate?.makeUIAdjustmentsForFullscreen?(progress: progress, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
                (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.makeUIAdjustmentsForFullscreen?(progress: progress, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
                (primaryContentViewController as? BottomSheetPrimaryContentControllerDelegate)?.makeUIAdjustmentsForFullscreen?(progress: progress, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
                
                backgroundDimmingView.alpha = progress * backgroundDimmingOpacity
                
                backgroundDimmingView.isUserInteractionEnabled = true
            }
            else
            {
                if backgroundDimmingView.alpha >= 0.001
                {
                    backgroundDimmingView.alpha = 0.0
                    
                    delegate?.makeUIAdjustmentsForFullscreen?(progress: 0.0, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
                    (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.makeUIAdjustmentsForFullscreen?(progress: 0.0, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
                    (primaryContentViewController as? BottomSheetPrimaryContentControllerDelegate)?.makeUIAdjustmentsForFullscreen?(progress: 0.0, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
                    
                    backgroundDimmingView.isUserInteractionEnabled = false
                }
            }
            
            delegate?.drawerChangedDistanceFromBottom?(drawer: self, distance: scrollView.contentOffset.y + lowestStop, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
            (drawerContentViewController as? BottomSheetDrawerViewControllerDelegate)?.drawerChangedDistanceFromBottom?(drawer: self, distance: scrollView.contentOffset.y + lowestStop, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
            (primaryContentViewController as? BottomSheetPrimaryContentControllerDelegate)?.drawerChangedDistanceFromBottom?(drawer: self, distance: scrollView.contentOffset.y + lowestStop, bottomSafeArea: BottomSheetSafeAreaInsets.bottom)
            
            // Move backgroundDimmingView to avoid drawer background beeing darkened
            backgroundDimmingView.frame = backgroundDimmingViewFrameForDrawerPosition(scrollView.contentOffset.y + lowestStop)
            
            syncDrawerContentViewSizeToMatchScrollPositionForSideDisplayMode()
        }
    }
}
