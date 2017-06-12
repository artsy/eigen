import UIKit
import Artsy_UIButtons

class SerifModalWebNavigationController: UINavigationController, UINavigationControllerDelegate {
    override init(rootViewController: UIViewController) {
        super.init(rootViewController: rootViewController)
        (rootViewController as? ARExternalWebBrowserViewController)?.statusBarStyle = .lightContent
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        view.layer.cornerRadius = 0
        view.superview?.layer.cornerRadius = 0
    }
    
    // TODO: Add status bar style

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
        (viewController as? ARExternalWebBrowserViewController)?.statusBarStyle = .lightContent
    }
}
