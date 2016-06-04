import UIKit
import FLKAutoLayout
import ORStackView

/// Know those pages where we have infinite scrolling of artworks and a fancy header at the top
/// that represents some model object? Well this should be the base for them.

/// The View Controller that represents that model should become the delegate
/// of the modelViewController, and should pass in its own header views.

/// TODO: Migrate the loading spinner to here?

@objc protocol ARModelInfiniteScrollViewControllerDelegate: AREmbeddedModelsViewControllerDelegate { }

class ARModelInfiniteScrollViewController: UIViewController, UIScrollViewDelegate {

    var headerStackView: ORStackView! {
        didSet {
            modelViewController.headerView = headerStackView
            invalidateHeaderHeight() // trigger the height being set
        }
    }

    var stickyHeaderView: UIView? {
        didSet {
            modelViewController.stickyHeaderView = stickyHeaderView
            invalidateHeaderHeight()
        }
    }

    private var modelViewController: AREmbeddedModelsViewController!

    override func viewDidLoad() {
        let controller = defaultScrollingViewController()
        ar_addAlignedModernChildViewController(controller)

        // Has to happen after viewDidLoad on controller
        controller.collectionView.showsVerticalScrollIndicator = true
        modelViewController = controller
    }

    // I'm not 100% on why this is needed, but it's in all of the VCs
    // with this pattern, so I assume we were seeing crashes when VCs were popped
    deinit {
        modelViewController.collectionView.delegate = nil
    }

    func defaultScrollingViewController() -> AREmbeddedModelsViewController {
        let viewController = AREmbeddedModelsViewController()
        viewController.activeModule = moduleLayout
        viewController.scrollDelegate = self
        viewController.showTrailingLoadingIndicator = true
        return viewController
    }

    lazy var moduleLayout: ARArtworkMasonryModule = {
        return ARArtworkMasonryModule(layout: self.layout(), andStyle: .ArtworkOnly)
    }()

    // TODO: Add a flexible column size?

    func layout() -> ARArtworkMasonryLayout {
        switch self.traitCollection.horizontalSizeClass {
        case .Compact: return .Layout2Column
        case .Regular: return .Layout3Column
        case .Unspecified: return .Layout2Column
        }
    }

    // This class can handle dealing with UIActivities for you
    // in order to use it, set the spotlight entity and when it has full
    // metadata, call `ar_setDataLoaded()` on this VC. This should be set
    // before presenting the view controller.

    var spotlightEntity: ARSpotlightMetadataProvider?

    // Lets someone come back to this VC and the activity is re-triggered
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        // Deal with rotations that could have happened in the background
        // TODO: is this moving the collectionview back up to the top on a refine pop?
        view.setNeedsLayout()
        view.layoutIfNeeded()

        if spotlightEntity != nil { setAr_userActivityEntity(spotlightEntity) }
    }

    // Activity is done when this VC has left
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)
        self.userActivity?.invalidate()
    }

    // A simpler API to explain what is really happening for other objects
    func invalidateHeaderHeight() {
        // Ensure the lazy loading of the stack views is done before
        // relying on their bounds
        headerStackView.setNeedsLayout()
        headerStackView.layoutIfNeeded()
        stickyHeaderView?.setNeedsLayout()
        stickyHeaderView?.layoutIfNeeded()

        viewDidLayoutSubviews()
    }

    // Handle changing the height of the header stackview on
    // orientation changes, or when the view has been invalidated
    override func viewDidLayoutSubviews() {
        let headerHeight = headerStackView.bounds.height
        modelViewController.headerHeight = headerHeight

        let stickyHeaderHeight = stickyHeaderView?.bounds.height ?? 0
        modelViewController.stickyHeaderHeight = stickyHeaderHeight
    }
}

private typealias PublicComputedProperties = ARModelInfiniteScrollViewController
extension PublicComputedProperties {
    var activeModule: ARModelCollectionViewModule {
        get {
            return modelViewController.activeModule
        }

        set {
            modelViewController.activeModule = newValue
        }
    }

    var items: [AnyObject] {
        get {
            return modelViewController.items
        }

        set {
            modelViewController.resetItems()
            modelViewController.appendItems(newValue)
        }
    }

    var showTrailingLoadingIndicator: Bool {
        get {
            return modelViewController.showTrailingLoadingIndicator
        }

        set {
            modelViewController.showTrailingLoadingIndicator = newValue
        }
    }

    var delegate: ARModelInfiniteScrollViewControllerDelegate? {
        get {
            return modelViewController.delegate as? ARModelInfiniteScrollViewControllerDelegate
        }

        set {
            modelViewController.delegate = newValue
        }
    }
}
