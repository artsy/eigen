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
    }
}

extension AuctionRefineViewController {
    func userDidCancel() {
        delegate?.userDidCancel(self)
    }
}

private extension AuctionRefineViewController {
    func setupViews() {
        // TODO: Get image from Katarina? This one is 45x45 instead of 40x40. We can then remove the size constraints, too.
        let cancelButton = ARCircularActionButton(imageName: "TextfieldClearButton")
        cancelButton.addTarget(self, action: "userDidCancel", forControlEvents: .TouchUpInside)
        view.addSubview(cancelButton)
        cancelButton.alignTopEdgeWithView(view, predicate: "10")
        cancelButton.alignTrailingEdgeWithView(view, predicate: "-10")
        cancelButton.constrainWidth("40", height: "40")

        let titleLabel = ARSerifLabel()
        titleLabel.font = UIFont.serifFontWithSize(20)
        titleLabel.text = "Refine"
        view.addSubview(titleLabel)
        titleLabel.alignTopEdgeWithView(view, predicate: "20")
        titleLabel.alignLeadingEdgeWithView(view, predicate: "20")
    }

}
