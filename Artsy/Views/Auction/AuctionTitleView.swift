import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout

@objc protocol AuctionTitleViewDelegate: class {
    func userDidPressInfo(titleView: AuctionTitleView)
    func userDidPressRegister(titleView: AuctionTitleView)
}

class AuctionTitleView: UIView {
    weak var delegate: AuctionTitleViewDelegate?

    let viewModel: SaleViewModel
    let showAdditionalInformation: Bool

    func updateRegistrationStatus() {
        // Based on new registration status, we'll reconstruct our whole hierarchy from scratch to reflect the new status.
        self.setupViews()
    }

    var registrationButton: UIButton!
    var fullWidth: Bool

    init(viewModel: SaleViewModel, delegate: AuctionTitleViewDelegate?, fullWidth: Bool, showAdditionalInformation: Bool) {
        self.viewModel = viewModel
        self.delegate = delegate
        self.fullWidth = fullWidth
        self.showAdditionalInformation = showAdditionalInformation

        super.init(frame: CGRect.zero)

        self.translatesAutoresizingMaskIntoConstraints = false

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
        delegate?.userDidPressInfo(self)
    }

    func userDidPressRegister() {
        delegate?.userDidPressRegister(self)
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

        let titleView = self.titleView()
        addSubview(titleView)

        let bottomView = self.bottomView()
        addSubview(bottomView)

        // Stack them on top of eachother and constrain top/bottom edges
        titleView.alignTopEdgeWithView(self, predicate: "0")
        bottomView.alignAttribute(.Top, toAttribute: .Bottom, ofView: titleView, predicate: "10")
        bottomView.alignAttribute(.Bottom, toAttribute: .Bottom, ofView: self, predicate: "-10")

        // Make them each full-width
        titleView.alignLeading("0", trailing: "0", toView: self)
        bottomView.alignLeading("0", trailing: "0", toView: self)
    }

    func titleView() -> UIView {
        let container = UIView()
        let regularSize = traitCollection.horizontalSizeClass == .Regular

        let titleLabel = ARSerifLabel().then {
            $0.text = self.viewModel.displayName
            $0.font = UIFont.serifFontWithSize(regularSize ? 30 : 20)
        }
        container.addSubview(titleLabel)

        if fullWidth {
            titleLabel.alignTop("0", bottom: "0", toView: container)
            titleLabel.alignLeadingEdgeWithView(container, predicate: "0")

            // If we're showing the info button, we'll anchor trailing space to that later, but if not, we need to anchor to the container.
            if showAdditionalInformation == false {
                titleLabel.alignTrailingEdgeWithView(container, predicate: "0")
            }
        } else {
            titleLabel.alignCenterXWithView(container, predicate: "0")
        }

        if showAdditionalInformation {
            let infoButton = UIButton.circularButton(.Info)
            infoButton.addTarget(self, action: #selector(AuctionTitleView.userDidPressInfo), forControlEvents: .TouchUpInside)
            container.addSubview(infoButton)

            // Vertically align both label and button
            infoButton.alignCenterYWithView(titleLabel, predicate: "0")

            // Info button always on right edge
            infoButton.alignTrailingEdgeWithView(container, predicate: "0")
            infoButton.alignTop("0", bottom: "0", toView: container)

            // Ensure button doesn't overlap with title
            titleLabel.setContentCompressionResistancePriority(UILayoutPriorityDefaultLow, forAxis: .Horizontal)
            infoButton.constrainLeadingSpaceToView(titleLabel, predicate: ">= \(regularSize ? 20 : 30)@400")
        } else {
            container.alignTop("0", bottom: "0", toView: titleLabel)
        }

        return container
    }

    func bottomView() -> UIView {
        let container = UIView()

        // Closed auctions shouldn't show a Register Button
        if viewModel.saleIsClosed {
            return container
        }

        // We're assuming a missing registration status means that the user isn't registered. We'll let our delegate handle the interaction for that.
        // For registered users, we display the "Approved to bid"
        // For all other cases (not logged in / not registered), we show the "Register" button, which shows an apporpriate CTA.
        if viewModel.auctionState.contains(.UserIsRegistered) {
            let registeredToBidLabel = ARSerifLabel().then {
                $0.text = "Approved to Bid"
                $0.font = UIFont.serifFontWithSize(16)
                $0.textAlignment = fullWidth ? .Left : .Center

                $0.textColor = .auctionGreen()
            }
            container.addSubview(registeredToBidLabel)

            registeredToBidLabel.alignToView(container)
        } else {
            let registerView = self.registerView()
            container.addSubview(registerView)

            // The design calls for an extra 10pt on top of the register button, but not just the label.
            registerView.alignTop("10", leading: "0", bottom: "0", trailing: "0", toView: container)
        }

        return container
    }

    func registerView() -> UIView {
        let container = UIView()

        let registerButton = ARBidButton().then {
            $0.setTitle("Register to Bid", forState: .Normal)
            $0.addTarget(self, action: #selector(AuctionTitleView.userDidPressRegister), forControlEvents: .TouchUpInside)
            $0.setAuctionState(viewModel.auctionState)
        }
        container.addSubview(registerButton)

        let registrationLabel = ARSerifLabel().then {
            $0.text = "Registration required to bid"
            $0.font = UIFont.serifFontWithSize(16)
            $0.textColor = .artsyGraySemibold()
        }
        container.addSubview(registrationLabel)

        // Centre both horizontally
        registerButton.alignCenterXWithView(container, predicate: "0")
        registrationLabel.alignCenterXWithView(container, predicate: "0")

        // Stack the register button on top of the label, and constrain them to the container.
        registerButton.alignTopEdgeWithView(container, predicate: "0")
        registrationLabel.constrainTopSpaceToView(registerButton, predicate: "10")
        registrationLabel.alignBottomEdgeWithView(container, predicate: "0")

        if fullWidth {
            registerButton.alignLeading("0", trailing: "0", toView: container)
        } else {
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
