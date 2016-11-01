import UIKit
import Artsy_UIButtons
import Then

class LiveAuctionLoadingView: UIView {

    override init(frame: CGRect) {
        super.init(frame: frame)
        commonSetup()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonSetup()
    }

    var spinningImageView = UIImageView()

    func commonSetup() {
        backgroundColor = .white

        let containerView = UIView()

        spinningImageView.then {
            $0.image = UIImage(asset: .LiveAuctionSpinner)
            $0.contentMode = .ScaleAspectFit

            containerView.addSubview($0)
            $0.alignLeading("0", trailing: "0", toView: containerView)
            $0.alignTopEdgeWithView(containerView, predicate: "0")
        }

        let label = ARSansSerifLabel().then {
            $0.textColor = UIColor.artsyPurpleRegular()
            $0.text = "Entering the auction room"
            $0.font = $0.font.fontWithSize(12)

            containerView.addSubview($0)
            $0.alignLeading("0", trailing: "0", toView: containerView)
            $0.alignBottomEdgeWithView(containerView, predicate: "0")
        }

        label.constrainTopSpaceToView(spinningImageView, predicate: "20")

        addSubview(containerView)
        containerView.alignCenter(withView: self)

        let dimension = 40
        let closeButton = ARMenuButton()
        closeButton.setBorderColor(.artsyGrayRegular(), for: UIControlState(), animated: false)
        closeButton.setBackgroundColor(.white, for: UIControlState(), animated: false)
        closeButton.setImage(UIImage(named:"serif_modal_close"), for: UIControlState())
        closeButton.addTarget(self, action: #selector(performOperation), for: .touchUpInside)

        addSubview(closeButton)
        closeButton.alignTrailingEdge(withView: self, predicate: "-20")
        closeButton.alignTopEdge(withView: self, predicate: "31")
        closeButton.constrainWidth("\(dimension)", height: "\(dimension)")
    }

    override func didMoveToSuperview() {
        super.didMoveToSuperview()

        // Set animation based on getting added to a superview (superview is nil when moving off of it).
        // And only spin in production.
        if let _ = superview, ARPerformWorkAsynchronously.boolValue {
            spinningImageView.ar_startSpinningIndefinitely()
        } else {
            spinningImageView.ar_stopSpinningInstantly(true)
        }
    }

    var operation: (() -> Void)?
    @objc func performOperation() {
        operation?()
    }
}
