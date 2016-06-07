import UIKit
import Artsy_UIButtons

class SerifModalWebNavigationController: UINavigationController, UINavigationControllerDelegate {

    let statusMaintainer = ARSerifStatusMaintainer()
    lazy var sharedApplication: UIApplication = {
        return UIApplication.sharedApplication()
    }()

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

    func dismiss() {
        presentingViewController?.dismissViewControllerAnimated(true, completion: nil)
    }

    func navigationController(navigationController: UINavigationController, willShowViewController viewController: UIViewController, animated: Bool) {
        viewController.automaticallyAdjustsScrollViewInsets = false
    }
}
