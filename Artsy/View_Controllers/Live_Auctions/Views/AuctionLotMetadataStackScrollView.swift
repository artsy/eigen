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

        viewModel.subscribe { lot in
            name.text = lot.lotArtist
            title.setTitle(lot.lotName, date: lot.lotArtworkCreationDate)
            estimate.text = lot.estimateString
            premium.text = lot.lotPremium
        }

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

        let loremProofOfConcept = stack.addBodyText("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", sideMargin: "40")

        let loremTwo = stack.addBodyText("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", sideMargin: "40")

        scrollEnabled = false
        backgroundColor = UIColor(white: 1, alpha: 0.85)
        for label in [name, title, estimate, premium, loremProofOfConcept, loremTwo] {
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
        aboveFoldHeightConstraint.active = false

        UIView.animateIf(animated, duration: ARAnimationQuickDuration) {
            self.layoutIfNeeded()
        }
    }

    func hideFullMetadata(animated: Bool) {
        scrollEnabled = false

        toggle.setTitle("LOT INFO", forState: .Normal)
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleUp), forState: .Normal)
        aboveFoldHeightConstraint.active = true

        UIView.animateIf(animated, duration: ARAnimationQuickDuration) {
            self.layoutIfNeeded()
        }
    }

    private class func toggleSizeButton() -> UIButton {
        let toggle = UIButton(type: .Custom)

        // Adjusts where the text will be placed
        toggle.contentEdgeInsets = UIEdgeInsets(top: 0, left: 10, bottom: 30, right: 17)
        toggle.titleLabel?.font = .sansSerifFontWithSize(12)
        toggle.setTitle("LOT INFO", forState: .Normal)
        toggle.setTitleColor(.blackColor(), forState: .Normal)

        // Constrain the image to the left edge
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleUp), forState: .Normal)
        toggle.imageView?.alignTrailingEdgeWithView(toggle, predicate: "0")
        toggle.imageView?.alignTopEdgeWithView(toggle, predicate: "4")
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
