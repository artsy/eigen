import UIKit
import Interstellar

class AuctionLotMetadataStackScrollView: ORStackScrollView {
    let aboveFoldStack = TextStack()
    fileprivate let toggle = AuctionLotMetadataStackScrollView.toggleSizeButton()

    var showAdditionalInformation: (() -> ())?
    var hideAdditionalInformation: (() -> ())?

    var aboveFoldHeightConstraint: NSLayoutConstraint!

    required init(viewModel: LiveAuctionLotViewModelType, salesPerson: LiveAuctionsSalesPersonType, sideMargin: String) {
        super.init(stackViewClass: TextStack.self)

        scrollIndicatorInsets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 2)

        /// Anything addded to `stack` here will be hidden by default
        guard let stack = stackView as? TextStack else { return }

        /// Splits the essential lot metadata and the "lot info" button
        let aboveFoldStackWrapper = UIView()

        // Sets up the above the fold stack
        let name = aboveFoldStack.addArtistName("")
        let title = aboveFoldStack.addArtworkName("", date: nil)
        title.numberOfLines = 1
        let estimate = aboveFoldStack.addBodyText("", topMargin: "4")
        let currentBid = aboveFoldStack.addBodyText("", topMargin: "4")

        // Want to make the wrapper hold the stack on the left
        aboveFoldStackWrapper.addSubview(aboveFoldStack)
        aboveFoldStack.alignTop("0", leading: "0", toView: aboveFoldStackWrapper)
        aboveFoldStack.alignBottomEdge(withView: aboveFoldStackWrapper, predicate: "0")

        // Then the button on the right
        aboveFoldStackWrapper.addSubview(toggle)
        toggle.alignTopEdge(withView: aboveFoldStackWrapper, predicate: "0")
        toggle.alignTrailingEdge(withView: aboveFoldStackWrapper, predicate: "0")

        toggle.addTarget(self, action: #selector(toggleTapped), for: .touchUpInside)

        // Then glue them together with 20px margin
        aboveFoldStack.constrainTrailingSpace(toView: toggle, predicate: "0")

        // Add the above the fold stack, to the stack
        stackView.addSubview(aboveFoldStackWrapper, withTopMargin: "0", sideMargin: sideMargin)

        // set a constraint to force it to be in small mode first
        aboveFoldHeightConstraint = constrainHeight(toView: aboveFoldStackWrapper, predicate: "0")

        // ----- Below the fold 👇 ----- //

        if let medium = viewModel.lotArtworkMedium {
            stack.addBodyText(medium, topMargin: "20", sideMargin: sideMargin)
        }

        if let dimensions = viewModel.lotArtworkDimensions {
            stack.addBodyText(dimensions, topMargin: "4", sideMargin: sideMargin)
        }

        if let editionInfo = viewModel.lotEditionInfo {
            stack.addBodyText(editionInfo, topMargin: "4", sideMargin: sideMargin)
        }

        let separatorMargin = String(Int(sideMargin) ?? 0 + 40)

        if let artworkdescription = viewModel.lotArtworkDescription, artworkdescription.isEmpty == false {
            stack.addSmallLineBreak(separatorMargin)
            stack.addSmallHeading("Description", sideMargin: sideMargin)
            stack.addBodyMarkdown(artworkdescription, sideMargin: sideMargin)
        }

        if let blurb = viewModel.lotArtistBlurb, blurb.isEmpty == false {
            stack.addThickLineBreak(separatorMargin)
            stack.addBigHeading("About the Artist", sideMargin: sideMargin)
            stack.addBodyMarkdown(blurb, sideMargin: sideMargin)
        }

        name.text = viewModel.lotArtist
        title.setTitle(viewModel.lotName, date: viewModel.lotArtworkCreationDate)
        estimate.text = "Estimate: \(viewModel.estimateString ?? "")"
        viewModel.currentBidSignal.subscribe { newCurrentBid in
            guard let state: LotState = viewModel.lotStateSignal.peek() else
            {
                currentBid.text = ""
                return
            }
            switch state {
            case .liveLot, .upcomingLot:
                if let reserve = newCurrentBid.reserve {
                    currentBid.text = "\(newCurrentBid.bid) \(reserve)"
                    currentBid.makeSubstringFaint(reserve)
                } else {
                    currentBid.text = newCurrentBid.bid
            }
            case .closedLot:
                if viewModel.isBeingSold && viewModel.userIsBeingSoldTo,
                    let winningLotValueString = salesPerson.winningLotValueString(viewModel) {
                    currentBid.text = "Sold for: \(winningLotValueString)"
                } else {
                    currentBid.text = ""
                }
            }
        }

        isScrollEnabled = false

        let views = stack.subviews + aboveFoldStack.subviews
        for label in views.filter({ $0.isKind(of: UILabel.self) || $0.isKind(of: UITextView.self) }) {
            label.backgroundColor = .clear
        }
    }

    @objc fileprivate func toggleTapped(_ button: UIButton) {
        if aboveFoldHeightConstraint.isActive {
            showAdditionalInformation?()
        } else {
            hideAdditionalInformation?()
        }
    }

    func setShowInfoButtonEnabled(_ enabled: Bool, animated: Bool = true) {
        if animated {
            UIView.transition(with: toggle, duration: ARAnimationQuickDuration, options: [.transitionCrossDissolve], animations: {
                self.toggle.isEnabled = enabled
            }, completion: nil)
        } else {
            toggle.isEnabled = enabled
        }
    }

    func showFullMetadata(_ animated: Bool) {
        isScrollEnabled = true

        toggle.setTitle("HIDE INFO", for: UIControl.State())
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleDown), for: UIControl.State())

        toggle.titleEdgeInsets = UIEdgeInsets(top: 20, left: 0, bottom: 0, right: 0)
        toggle.imageTopConstraint?.constant = 15

        aboveFoldHeightConstraint.isActive = false

        UIView.animateSpringIf(animated, duration: ARAnimationDuration, delay: 0, damping: 0.9, velocity: 3.5, {
            self.superview?.layoutIfNeeded()
        }) { _ in
            self.flashScrollIndicators()
        }
    }

    func hideFullMetadata(_ animated: Bool) {
        isScrollEnabled = false

        toggle.setTitle("LOT INFO", for: UIControl.State())
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleUp), for: UIControl.State())

        toggle.titleEdgeInsets = UIEdgeInsets.zero
        toggle.imageTopConstraint?.constant = 4

        aboveFoldHeightConstraint.isActive = true

        UIView.animateSpringIf(animated, duration: ARAnimationDuration, delay: 0, damping: 0.9, velocity: 3.5) {
            self.contentOffset = CGPoint.zero
            self.superview?.layoutIfNeeded()
        }
    }

    /// A small class just to simplify changing the height constraint for the image view
    fileprivate class AuctionPushButton: UIButton {
        var imageTopConstraint: NSLayoutConstraint?
    }

    fileprivate class func toggleSizeButton() -> AuctionPushButton {
        let toggle = AuctionPushButton(type: .custom)

        // Adjusts where the text will be placed
        toggle.contentEdgeInsets = UIEdgeInsets(top: 0, left: 10, bottom: 30, right: 17)
        toggle.titleLabel?.font = .sansSerifFont(withSize: 12)
        toggle.setTitle("LOT INFO", for: UIControl.State())
        toggle.setTitleColor(.black, for: UIControl.State())
        toggle.setTitleColor(.artsyGrayMedium(), for: .disabled)

        // Constrain the image to the left edge
        toggle.setImage(UIImage(asset: .LiveAuctionsDisclosureTriangleUp), for: UIControl.State())
        toggle.imageView?.alignTrailingEdge(withView: toggle, predicate: "0")
        toggle.imageTopConstraint =  toggle.imageView?.alignTopEdge(withView: toggle, predicate: "4")
        toggle.setContentHuggingPriority(UILayoutPriority(rawValue: 1000), for: .horizontal)
        toggle.setContentCompressionResistancePriority(UILayoutPriority(rawValue: 1000), for: .horizontal)

        // Extend its hit range, as it's like ~20px otherwise
        toggle.ar_extendHitTestSize(byWidth: 20, andHeight: 40)
        return toggle
    }

    override var intrinsicContentSize : CGSize {
        return aboveFoldStack.intrinsicContentSize
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

}
