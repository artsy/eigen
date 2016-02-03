import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout
import EDColor

protocol AuctionTitleViewDelegate: class {
    func userDidPressInfo(titleView: AuctionTitleView)
    func userDidPressRegister(titleView: AuctionTitleView)
}

class AuctionTitleView: UIView {
    unowned let delegate: AuctionTitleViewDelegate

    let viewModel: SaleViewModel
    var registrationStatus: ArtsyAPISaleRegistrationStatus? {
        didSet {
            // TODO: Update button title
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

        // Remove all subviews and call setupViews() again to start from scratch.
        subviews.forEach { $0.removeFromSuperview() }
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
        let regularSize = traitCollection.horizontalSizeClass == .Regular
        let topSpacing = regularSize ? 30 : 20
        let sideSpacing = regularSize ? 40 : 20

        let titleView = self.titleView(regularSize)
        addSubview(titleView)

        titleView.alignLeading("\(sideSpacing)", trailing: "\(-sideSpacing)", toView: self)
        titleView.alignTopEdgeWithView(self, predicate: "\(topSpacing)")

        let bottomView = self.bottomView(regularSize)
        addSubview(bottomView)

        bottomView.alignAttribute(.Top, toAttribute: .Bottom, ofView: titleView, predicate: "20")
        bottomView.alignAttribute(.Bottom, toAttribute: .Bottom, ofView: self, predicate: "10")
        bottomView.alignLeading("\(sideSpacing)", trailing: "\(-sideSpacing)", toView: self)
    }

    func titleView(regularSize: Bool) -> UIView {
        let container = UIView()

        let titleLabel = ARSerifLabel().then {
            $0.text = self.viewModel.displayName
            $0.font = UIFont.serifFontWithSize(regularSize ? 20 : 30)
        }
        container.addSubview(titleLabel)

        let infoButton = self.infoButton()
        container.addSubview(infoButton)

        // Vertically align both label and button
        infoButton.alignCenterYWithView(titleLabel, predicate: "0")

        if regularSize {
            titleLabel.alignCenterXWithView(container, predicate: "0")
        } else {
            // TODO: iPhone
        }

        // Info button always on left edge
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

            registerView.alignTop("10", leading: "0", bottom: "0", trailing: "0", toView: container)
        } else {
            let registeredToBidLabel = ARSerifLabel().then {
                $0.text = "Approved to Bid"
                $0.font = UIFont.serifFontWithSize(16)
                $0.textAlignment = regularSize ? .Center : .Left

                // TODO: Abstract colour out to constant.
                $0.textColor = UIColor(hex: 0x16d047)
            }
            container.addSubview(registeredToBidLabel)

            registeredToBidLabel.alignToView(container)
        }

        return container
    }

    func infoButton() -> UIButton {
        // TODO: this is copied from the Refine VC, find a better abstraction
        let cancelButton = UIButton(type: .Custom)
        cancelButton.setImage(UIImage(named: "AuctionRefineCancelButton"), forState: .Normal)
        cancelButton.imageView?.contentMode = .ScaleAspectFit
        cancelButton.ar_extendHitTestSizeByWidth(4, andHeight: 4) // To expand to required 44pt hit area
        cancelButton.addTarget(self, action: "userDidPressInfo", forControlEvents: .TouchUpInside)
        return cancelButton
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

        registerButton.alignTopEdgeWithView(container, predicate: "0")
        registrationLabel.constrainTopSpaceToView(registerButton, predicate: "10")
        registrationLabel.alignBottomEdgeWithView(container, predicate: "0")

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
