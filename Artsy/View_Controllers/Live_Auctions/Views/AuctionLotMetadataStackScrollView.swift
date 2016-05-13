import UIKit
import ORStackView
import Interstellar
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout

class AuctionLotMetadataStackScrollView: ORStackScrollView {
    let viewModel = Observable<LiveAuctionLotViewModelType>()

    let aboveFoldStack = TextStack()
    private let toggle = AuctionLotMetadataStackScrollView.toggleSizeButton()

    var showAdditionalInformation: (() -> ())?
    var hideAdditionalInformation: (() -> ())?

    var aboveFoldHeightConstraint: NSLayoutConstraint!

    init() {
        super.init(stackViewClass: TextStack.self)

        /// Anything addded to `stack` here will be hidden by default
        guard let stack = stackView as? TextStack else { return }

        /// Splits the essential lot metadata and the "lot info" button
        let aboveFoldStackWrapper = UIView()

        // Sets up the above the fold stack
        let name = aboveFoldStack.addArtistName("")
        let title = aboveFoldStack.addArtworkName("", date: nil)
        let estimate = aboveFoldStack.addBodyText("", topMargin: "4")
        let premium = aboveFoldStack.addBodyText("", topMargin: "4")
        premium.textColor = UIColor.artsyGraySemibold()

        // Want to make the wrapper hold the stack on the left
        aboveFoldStackWrapper.addSubview(aboveFoldStack)
        aboveFoldStack.alignTop("0", leading: "20", toView: aboveFoldStackWrapper)
        aboveFoldStack.alignBottomEdgeWithView(aboveFoldStackWrapper, predicate: "0")

        // Then the button on the right
        aboveFoldStackWrapper.addSubview(toggle)
        toggle.alignTopEdgeWithView(aboveFoldStackWrapper, predicate: "0")
        toggle.alignTrailingEdgeWithView(aboveFoldStackWrapper, predicate: "-20")

        toggle.addTarget(self, action: #selector(toggleTapped), forControlEvents: .TouchUpInside)

        // Then glue them together with 20px margin
        aboveFoldStack.constrainTrailingSpaceToView(toggle, predicate: "-20")

        // Add the above the fold stack, to the stack
        stackView.addSubview(aboveFoldStackWrapper, withTopMargin: "0", sideMargin: "0")

        // set a constraint to force it to be in small mode first
        aboveFoldHeightConstraint = constrainHeightToView(aboveFoldStackWrapper, predicate: "0")

        let separator = stack.addThickLineBreak("40")
        let artistBlurbTitle = stack.addBigHeading("About the Artist", sideMargin: "40")
        let artistBlurb = stack.addBodyText("", sideMargin: "40")
        let artistMetadata:[UIView] = [separator, artistBlurbTitle, artistBlurb]

        viewModel.subscribe { lot in
            name.text = lot.lotArtist
            title.setTitle(lot.lotName, date: lot.lotArtworkCreationDate)
            estimate.text = lot.estimateString
            premium.text = lot.lotPremium

            if let blurb = lot.lotArtistBlurb {
                artistBlurb.text = blurb
            } else {
                artistMetadata.forEach { $0.removeFromSuperview() }
            }
        }

        scrollEnabled = false
        backgroundColor = UIColor(white: 1, alpha: 0.85)
        for label in stack.subviews.filter({ $0.isKindOfClass(UILabel.self) }) {
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

    func showFullMetadata(animated: Bool) {
        scrollEnabled = true

        toggle.setTitle("HIDE INFO", forState: .Normal)
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleDown), forState: .Normal)

        toggle.titleEdgeInsets = UIEdgeInsets(top: 20, left: 0, bottom: 0, right: 0)
        toggle.imageTopConstraint?.constant = 15

        aboveFoldHeightConstraint.active = false

        UIView.animateSpringIf(animated, duration: ARAnimationDuration, delay: 0, damping: 0.9, velocity: 3.5) {
            self.layoutIfNeeded()
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
            self.layoutIfNeeded()
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
