import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout

protocol AuctionTitleViewDelegate: class {
    func userDidPressInfo(titleView: AuctionTitleView)
    func userDidPressRegister(titleView: AuctionTitleView)
}

class AuctionTitleView: UIView {
    unowned let delegate: AuctionTitleViewDelegate

    let viewModel: SaleViewModel
    var registrationStatus: ArtsyAPISaleRegistrationStatus? {
        didSet {
            // Based on new registration status, we'll reconstruct our whole hierarchy from scratch to reflect the new status.
            self.setupViews()
        }
    }

    var registrationButton: UIButton!

    init(viewModel: SaleViewModel, registrationStatus: ArtsyAPISaleRegistrationStatus?, delegate: AuctionTitleViewDelegate) {
        self.viewModel = viewModel
        self.delegate = delegate
        self.registrationStatus = registrationStatus

        super.init(frame: CGRect.zero)

        setupViews()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        setupViews()
    }
}

private typealias UserInteraction = AuctionTitleView
extension UserInteraction {
    func userDidPressInfo() {
        delegate.userDidPressInfo(self)
    }

    func userDidPressRegister() {
        delegate.userDidPressRegister(self)
    }
}

private extension AuctionTitleView {
    func setupViews() {
        // Remove all subviews and call setupViews() again to start from scratch.
        subviews.forEach { $0.removeFromSuperview() }

        // We divide ourselves into two views: the title view and the bottom view.
        // The bottom view can be a register button and label and other UI flourishes,
        // or it could just be a label. We don't care in this function, we just stack
        // the title view and bottom view on top of eachother.

        let regularSize = traitCollection.horizontalSizeClass == .Regular

        let topSpacing = regularSize ? 30 : 20
        let sideSpacing = regularSize ? 40 : 20

        let titleView = self.titleView(regularSize)
        addSubview(titleView)

        let bottomView = self.bottomView(regularSize)
        addSubview(bottomView)

        // Stack them on top of eachother and constrain top/bottom edges
        titleView.alignTopEdgeWithView(self, predicate: "\(topSpacing)")
        bottomView.alignAttribute(.Top, toAttribute: .Bottom, ofView: titleView, predicate: "20")
        bottomView.alignAttribute(.Bottom, toAttribute: .Bottom, ofView: self, predicate: "-10")

        // Make them each full-width
        [titleView, bottomView].forEach {
            $0.alignLeading("\(sideSpacing)", trailing: "\(-sideSpacing)", toView: self)
        }
    }

    func titleView(regularSize: Bool) -> UIView {
        let container = UIView()

        let titleLabel = ARSerifLabel().then {
            $0.text = self.viewModel.displayName
            $0.font = UIFont.serifFontWithSize(regularSize ? 30 : 20)
        }
        container.addSubview(titleLabel)

        let infoButton = UIButton.circularButton(.Info)
        infoButton.addTarget(self, action: "userDidPressInfo", forControlEvents: .TouchUpInside)
        container.addSubview(infoButton)

        // Vertically align both label and button
        infoButton.alignCenterYWithView(titleLabel, predicate: "0")

        if regularSize {
            titleLabel.alignCenterXWithView(container, predicate: "0")
        } else {
            titleLabel.alignLeadingEdgeWithView(container, predicate: "0")
        }

        // Info button always on right edge
        infoButton.alignTrailingEdgeWithView(container, predicate: "0")
        infoButton.alignTop("0", bottom: "0", toView: container)

        // Ensure button doesn't overlap with title
        infoButton.constrainLeadingSpaceToView(titleLabel, predicate: ">= \(regularSize ? 20 : 30)@400")

        return container
    }

    func bottomView(regularSize: Bool) -> UIView {
        let container = UIView()

        // We're assuming a missing registration status means that the user isn't registered. We'll let our delegate handle the interaction for that.
        let needsToRegister = registrationStatus ?? ArtsyAPISaleRegistrationStatusNotRegistered == ArtsyAPISaleRegistrationStatusRegistered

        // For registered users, we display the "Approved to bid"
        // For all other cases (not logged in / not registered), we show the "Register" button
        if needsToRegister {
            let registerView = self.registerView(regularSize)
            container.addSubview(registerView)

            // The design calls for an extra 10pt on top of the register button, but not just the label.
            registerView.alignTop("10", leading: "0", bottom: "0", trailing: "0", toView: container)
        } else {
            let registeredToBidLabel = ARSerifLabel().then {
                $0.text = "Approved to Bid"
                $0.font = UIFont.serifFontWithSize(16)
                $0.textAlignment = regularSize ? .Center : .Left

                $0.textColor = .auctionGreen()
            }
            container.addSubview(registeredToBidLabel)

            registeredToBidLabel.alignToView(container)
        }

        return container
    }

    func registerView(regularSize: Bool) -> UIView {
        let container = UIView()

        let registerButton = ARBlackFlatButton().then {
            $0.setTitle("Register to Bid", forState: .Normal)
            $0.addTarget(self, action: "userDidPressRegister", forControlEvents: .TouchUpInside)
        }
        container.addSubview(registerButton)

        let registrationLabel = ARSerifLabel().then {
            $0.text = "Registration required to bid"
            $0.font = UIFont.serifFontWithSize(16)
            $0.textColor = .artsyHeavyGrey()
        }
        container.addSubview(registrationLabel)

        // Centre both horizontally
        registerButton.alignCenterXWithView(container, predicate: "0")
        registrationLabel.alignCenterXWithView(container, predicate: "0")

        // Staack the register button on top of the label, and constrain them to the container.
        registerButton.alignTopEdgeWithView(container, predicate: "0")
        registrationLabel.constrainTopSpaceToView(registerButton, predicate: "10")
        registrationLabel.alignBottomEdgeWithView(container, predicate: "0")

        // We need to add left/right rules for iPad.
        if regularSize {
            let leftRule = ARSeparatorView()
            container.addSubview(leftRule)

            leftRule.alignLeadingEdgeWithView(container, predicate: "0")
            leftRule.constrainTrailingSpaceToView(registerButton, predicate: "-16")
            leftRule.alignCenterYWithView(registerButton, predicate: "0")

            let rightRule = ARSeparatorView()
            container.addSubview(rightRule)

            rightRule.constrainLeadingSpaceToView(registerButton, predicate: "16")
            rightRule.alignTrailingEdgeWithView(container, predicate: "0")
            rightRule.alignCenterYWithView(registerButton, predicate: "0")
        }

        return container
    }
}
