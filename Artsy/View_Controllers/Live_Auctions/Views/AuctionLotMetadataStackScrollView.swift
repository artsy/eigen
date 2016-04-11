import UIKit
import ORStackView
import Interstellar
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout

class AuctionLotMetadataStackScrollView: ORStackScrollView {
    let viewModel = Signal<LiveAuctionLotViewModelType>()

    let aboveFoldStack = TextStack()
    let toggle = AuctionLotMetadataStackScrollView.toggleSizeButton()

    var aboveFoldHeightConstraint: NSLayoutConstraint!

    init() {
        super.init(stackViewClass: TextStack.self)

        /// Splits the essential lot metadata and the "lot info" button
        let aboveFoldStackWrapper = UIView()

        // Sets up the above the fold stack
        let name = aboveFoldStack.addArtistName("")
        let title = aboveFoldStack.addArtworkName("", date: nil)
        let estimate = aboveFoldStack.addBodyText("", topMargin: "4")
        let premium = aboveFoldStack.addBodyText("", topMargin: "4")
        premium.textColor = UIColor.artsyGraySemibold()

        viewModel.next { lot in
            name.text = lot.lotArtist
            title.setTitle(lot.lotName, date: lot.lotArtworkCreationDate)
            estimate.text = lot.estimateString
            premium.text = lot.lotPremium
        }

        // Want to make the wrapper hold the stack on the left
        aboveFoldStackWrapper.addSubview(aboveFoldStack)
        aboveFoldStack.alignTop("0", leading: "0", toView: aboveFoldStackWrapper)
        aboveFoldStack.alignBottomEdgeWithView(aboveFoldStackWrapper, predicate: "0")

        // Then the button on the right
        aboveFoldStackWrapper.addSubview(toggle)
        toggle.alignTopEdgeWithView(aboveFoldStackWrapper, predicate: "0")
        toggle.alignTrailingEdgeWithView(aboveFoldStackWrapper, predicate: "0")

        // Then glue them together with 20px margin
        aboveFoldStack.constrainTrailingSpaceToView(toggle, predicate: "-20")

        // Add the above the fold stack, to the stack
        stackView.addSubview(aboveFoldStackWrapper, withTopMargin: "0", sideMargin: "0")

        // set a constraint to force it to be in small mode first
        aboveFoldHeightConstraint = constrainHeightToView(aboveFoldStackWrapper, predicate: "0").first as! NSLayoutConstraint

        self.invalidateIntrinsicContentSize()
    }

    class func toggleSizeButton() -> UIButton {
        let toggle = UIButton(type: .Custom)

        // Adjusts where the text will be placed
        toggle.contentEdgeInsets = UIEdgeInsets(top: 0, left: 10, bottom: 30, right: 17)
        toggle.titleLabel?.font = .sansSerifFontWithSize(12)
        toggle.setTitle("LOT INFO", forState: .Normal)
        toggle.setTitleColor(.blackColor(), forState: .Normal)

        // Constrain the image to the left edge
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleDown), forState: .Normal)
        toggle.imageView?.alignTrailingEdgeWithView(toggle, predicate: "0")
        toggle.imageView?.alignTopEdgeWithView(toggle, predicate: "4")

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
