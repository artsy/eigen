import UIKit
import ORStackView
import Interstellar
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout

class AuctionLotMetadataStackScrollView: ORStackScrollView {
    let aboveFoldStack = TextStack()
    private let toggle = AuctionLotMetadataStackScrollView.toggleSizeButton()

    var showAdditionalInformation: (() -> ())?
    var hideAdditionalInformation: (() -> ())?

    var aboveFoldHeightConstraint: NSLayoutConstraint!

    required init(viewModel: LiveAuctionLotViewModelType, sideMargin: String) {
        super.init(stackViewClass: TextStack.self)

        scrollIndicatorInsets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 2)

        /// Anything addded to `stack` here will be hidden by default
        guard let stack = stackView as? TextStack else { return }

        /// Splits the essential lot metadata and the "lot info" button
        let aboveFoldStackWrapper = UIView()

        // Sets up the above the fold stack
        let name = aboveFoldStack.addArtistName("")
        let title = aboveFoldStack.addArtworkName("", date: nil)
        let estimate = aboveFoldStack.addBodyText("", topMargin: "4")
        let currentBid = aboveFoldStack.addBodyText("", topMargin: "4")

        // Want to make the wrapper hold the stack on the left
        aboveFoldStackWrapper.addSubview(aboveFoldStack)
        aboveFoldStack.alignTop("0", leading: "0", toView: aboveFoldStackWrapper)
        aboveFoldStack.alignBottomEdgeWithView(aboveFoldStackWrapper, predicate: "0")

        // Then the button on the right
        aboveFoldStackWrapper.addSubview(toggle)
        toggle.alignTopEdgeWithView(aboveFoldStackWrapper, predicate: "0")
        toggle.alignTrailingEdgeWithView(aboveFoldStackWrapper, predicate: "0")

        toggle.addTarget(self, action: #selector(toggleTapped), forControlEvents: .TouchUpInside)

        // Then glue them together with 20px margin
        aboveFoldStack.constrainTrailingSpaceToView(toggle, predicate: "0")

        // Add the above the fold stack, to the stack
        stackView.addSubview(aboveFoldStackWrapper, withTopMargin: "0", sideMargin: sideMargin)

        // set a constraint to force it to be in small mode first
        aboveFoldHeightConstraint = constrainHeightToView(aboveFoldStackWrapper, predicate: "0")

        // ----- Below the fold 👇 ----- //

        if let medium = viewModel.lotArtworkMedium {
            stack.addBodyText(medium, topMargin: "20", sideMargin: sideMargin)
        }

        if let dimensions = viewModel.lotArtworkDimensions {
            stack.addBodyText(dimensions, sideMargin: sideMargin)
        }

        let separatorMargin = String(Int(sideMargin) ?? 0 + 40)

        if let description = viewModel.lotArtworkDescription {
            stack.addSmallLineBreak(separatorMargin)
            stack.addSmallHeading("Description", sideMargin: sideMargin)
            stack.addBodyMarkdown(description, sideMargin: sideMargin)
        }

        if let blurb = viewModel.lotArtistBlurb {
            stack.addThickLineBreak(separatorMargin)
            stack.addBigHeading("About the Artist", sideMargin: sideMargin)
            stack.addBodyMarkdown(blurb, sideMargin: sideMargin)
        }

        let currencySymbol = viewModel.currencySymbol

        name.text = viewModel.lotArtist
        title.setTitle(viewModel.lotName, date: viewModel.lotArtworkCreationDate)
        estimate.text = viewModel.estimateString
        viewModel.askingPriceSignal.subscribe { askingPrice in // TODO: Unsubscribe from this.
            currentBid.text = "Current Bid: \(askingPrice.convertToDollarString(currencySymbol))"
        }

        scrollEnabled = false

        let views = stack.subviews + aboveFoldStack.subviews
        for label in views.filter({ $0.isKindOfClass(UILabel.self) || $0.isKindOfClass(UITextView.self) }) {
            label.backgroundColor = .clearColor()
        }
    }

    @objc private func toggleTapped(button: UIButton) {
        if (aboveFoldHeightConstraint.active) {
            showAdditionalInformation?()
        } else {
            hideAdditionalInformation?()
        }
    }

    func setShowInfoButtonEnabled(enabled: Bool, animated: Bool = true) {
        if animated {
            UIView.transitionWithView(toggle, duration: ARAnimationQuickDuration, options: [.TransitionCrossDissolve], animations: {
                self.toggle.enabled = enabled
            }, completion: nil)
        } else {
            toggle.enabled = enabled
        }
    }

    func showFullMetadata(animated: Bool) {
        scrollEnabled = true

        toggle.setTitle("HIDE INFO", forState: .Normal)
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleDown), forState: .Normal)

        toggle.titleEdgeInsets = UIEdgeInsets(top: 20, left: 0, bottom: 0, right: 0)
        toggle.imageTopConstraint?.constant = 15

        aboveFoldHeightConstraint.active = false

        UIView.animateSpringIf(animated, duration: ARAnimationDuration, delay: 0, damping: 0.9, velocity: 3.5) {
            self.superview?.layoutIfNeeded()
        }
    }

    func hideFullMetadata(animated: Bool) {
        scrollEnabled = false

        toggle.setTitle("LOT INFO", forState: .Normal)
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleUp), forState: .Normal)

        toggle.titleEdgeInsets = UIEdgeInsetsZero
        toggle.imageTopConstraint?.constant = 4

        aboveFoldHeightConstraint.active = true

        UIView.animateSpringIf(animated, duration: ARAnimationDuration, delay: 0, damping: 0.9, velocity: 3.5) {
            self.superview?.layoutIfNeeded()
        }
    }

    /// A small class just to simplify changing the height constraint for the image view
    private class AuctionPushButton: UIButton {
        var imageTopConstraint: NSLayoutConstraint?
    }

    private class func toggleSizeButton() -> AuctionPushButton {
        let toggle = AuctionPushButton(type: .Custom)

        // Adjusts where the text will be placed
        toggle.contentEdgeInsets = UIEdgeInsets(top: 0, left: 10, bottom: 30, right: 17)
        toggle.titleLabel?.font = .sansSerifFontWithSize(12)
        toggle.setTitle("LOT INFO", forState: .Normal)
        toggle.setTitleColor(.blackColor(), forState: .Normal)
        toggle.setTitleColor(.artsyGrayMedium(), forState: .Disabled)

        // Constrain the image to the left edge
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleUp), forState: .Normal)
        toggle.imageView?.alignTrailingEdgeWithView(toggle, predicate: "0")
        toggle.imageTopConstraint =  toggle.imageView?.alignTopEdgeWithView(toggle, predicate: "4")
        toggle.setContentHuggingPriority(1000, forAxis: .Horizontal)

        // Extend its hit range, as it's like ~20px otherwise
        toggle.ar_extendHitTestSizeByWidth(20, andHeight: 40)
        return toggle
    }

    override func intrinsicContentSize() -> CGSize {
        return aboveFoldStack.intrinsicContentSize()
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

}
