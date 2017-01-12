import UIKit
import Artsy_UIButtons

class SerifModalWebNavigationController: UINavigationController, UINavigationControllerDelegate {

    let statusMaintainer = ARSerifStatusMaintainer()
    lazy var sharedApplication: UIApplication = {
        return UIApplication.shared
    }()

    override init(rootViewController: UIViewController) {
        super.init(rootViewController: rootViewController)
        (rootViewController as? ARExternalWebBrowserViewController)?.ignoreStatusBar = true
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        statusMaintainer.viewWillAppear(animated, app: sharedApplication)

        view.layer.cornerRadius = 0
        view.superview?.layer.cornerRadius = 0
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        statusMaintainer.viewWillDisappear(animated, app: sharedApplication)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white

        edgesForExtendedLayout = UIRectEdge()
        setNavigationBarHidden(true, animated: false)

        let dimension = 40
        let closeButton = ARMenuButton()
        closeButton.setBorderColor(.artsyGrayRegular(), for: UIControlState(), animated: false)
        closeButton.setBackgroundColor(.white, for: UIControlState(), animated: false)
        closeButton.setImage(UIImage(named:"serif_modal_close"), for: UIControlState())
        closeButton.addTarget(self, action: #selector(dismissMe), for: .touchUpInside)

        view.addSubview(closeButton)
        closeButton.alignTrailingEdge(withView: view, predicate: "-20")
        closeButton.alignTopEdge(withView: view, predicate: "20")
        closeButton.constrainWidth("\(dimension)", height: "\(dimension)")

        self.delegate = self
    }

    override var supportedInterfaceOrientations : UIInterfaceOrientationMask {
        return traitDependentSupportedInterfaceOrientations
    }

    override var shouldAutorotate : Bool {
        return traitDependentAutorotateSupport
    }

    func dismissMe() {
        presentingViewController?.dismiss(animated: true, completion: nil)
    }

    func navigationController(_ navigationController: UINavigationController, willShow viewController: UIViewController, animated: Bool) {
        viewController.automaticallyAdjustsScrollViewInsets = false
        (viewController as? ARExternalWebBrowserViewController)?.ignoreStatusBar = true
    }
}
