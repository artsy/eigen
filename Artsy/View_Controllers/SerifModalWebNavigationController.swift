import UIKit
import Artsy_UIButtons

class SerifModalWebNavigationController: UINavigationController, UINavigationControllerDelegate {

    let statusMaintainer = ARSerifStatusMaintainer()
    lazy var sharedApplication: UIApplication = {
        return UIApplication.sharedApplication()
    }()

    override init(rootViewController: UIViewController) {
        super.init(rootViewController: rootViewController)
        (rootViewController as? ARExternalWebBrowserViewController)?.ignoreStatusBar = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: NSBundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        statusMaintainer.viewWillAppear(animated, app: sharedApplication)

        view.layer.cornerRadius = 0
        view.superview?.layer.cornerRadius = 0
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)
        statusMaintainer.viewWillDisappear(animated, app: sharedApplication)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .whiteColor()

        edgesForExtendedLayout = .None
        setNavigationBarHidden(true, animated: false)

        let dimension = 40
        let closeButton = ARMenuButton()
        closeButton.setBorderColor(.artsyGrayRegular(), forState: .Normal, animated: false)
        closeButton.setBackgroundColor(.whiteColor(), forState: .Normal, animated: false)
        closeButton.setImage(UIImage(named:"serif_modal_close"), forState: .Normal)
        closeButton.addTarget(self, action: #selector(dismiss), forControlEvents: .TouchUpInside)

        view.addSubview(closeButton)
        closeButton.alignTrailingEdgeWithView(view, predicate: "-20")
        closeButton.alignTopEdgeWithView(view, predicate: "20")
        closeButton.constrainWidth("\(dimension)", height: "\(dimension)")

        self.delegate = self
    }

    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations 
    }

    override func shouldAutorotate() -> Bool {
        return traitDependentAutorotateSupport
    }

    func dismiss() {
        presentingViewController?.dismissViewControllerAnimated(true, completion: nil)
    }

    func navigationController(navigationController: UINavigationController, willShowViewController viewController: UIViewController, animated: Bool) {
        viewController.automaticallyAdjustsScrollViewInsets = false
        (viewController as? ARExternalWebBrowserViewController)?.ignoreStatusBar = true
    }
}
