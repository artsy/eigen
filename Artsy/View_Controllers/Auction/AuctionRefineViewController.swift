import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts

protocol AuctionRefineViewControllerDelegate: class {
    func userDidCancel(controller: AuctionRefineViewController)
}

class AuctionRefineViewController: UIViewController {
    weak var delegate: AuctionRefineViewControllerDelegate?

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .whiteColor()
        
        setupViews()
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        // Removes our rounded corners
        presentationController?.presentedView()?.layer.cornerRadius = 0
        UIApplication.sharedApplication().setStatusBarHidden(true, withAnimation: animated ? .Slide : .None)
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)

        UIApplication.sharedApplication().setStatusBarHidden(true, withAnimation: animated ? .Slide : .None)
    }
}

extension AuctionRefineViewController {
    func userDidCancel() {
        delegate?.userDidCancel(self)
    }
}

private extension AuctionRefineViewController {
    func setupViews() {
        let cancelButton = self.cancelButton()
        view.addSubview(cancelButton)
        cancelButton.alignTopEdgeWithView(view, predicate: "10")
        cancelButton.alignTrailingEdgeWithView(view, predicate: "-10")

        let titleLabel = self.titleLabel()
        view.addSubview(titleLabel)
        titleLabel.alignTopEdgeWithView(view, predicate: "20")
        titleLabel.alignLeadingEdgeWithView(view, predicate: "20")
    }

    func cancelButton() -> UIButton {
        let cancelButton = UIButton(type: .Custom)
        cancelButton.setImage(UIImage(named: "RefineCancelButton"), forState: .Normal)
        cancelButton.imageView?.contentMode = .ScaleAspectFit
        cancelButton.ar_extendHitTestSizeByWidth(4, andHeight: 4) // To expand to required 44pt hit area
        cancelButton.addTarget(self, action: "userDidCancel", forControlEvents: .TouchUpInside)
        return cancelButton
    }

    func titleLabel() -> UILabel {
        let titleLabel = ARSerifLabel()
        titleLabel.font = UIFont.serifFontWithSize(20)
        titleLabel.text = "Refine"
        return titleLabel
    }
}
