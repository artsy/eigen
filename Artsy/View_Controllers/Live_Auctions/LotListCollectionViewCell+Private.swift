import UIKit
import Artsy_UILabels
import Artsy_UIFonts
import Then

private typealias PrivateFunctions = LotListCollectionViewCell
extension PrivateFunctions {

    func setup() {
        // Necessary setup
        contentView.translatesAutoresizingMaskIntoConstraints = false
        contentView.alignToView(self)

        // Separators
        [topSeparator, bottomSeparator].forEach { separator in
            contentView.addSubview(separator)
            separator.alignLeading("0", trailing: "0", toView: self)
        }
        topSeparator.alignTopEdgeWithView(contentView, predicate: "0")
        // By placing the bottomSeparator 1pt below our bottom edge (outside our bounds), it is hidden from
        // view if the cell beneath us is the current lot.
        bottomSeparator.alignBottomEdgeWithView(contentView, predicate: "1")

        // Add and arrange lotImageView.
        contentView.addSubview(lotImageView)
        lotImageView.constrainWidth("60", height: "60")
        lotImageView.alignTop("10", bottom: "-10", toView: contentView)
        lotImageView.alignLeadingEdgeWithView(contentView, predicate: "20")

        // Now add, arrange, and configure the labelContainerView
        contentView.addSubview(labelContainerView)
        [lotNumberLabel, artistsNamesLabel, currentAskingPriceLabel].forEach { label in
            // Add them and pin their leading/trailing edges
            labelContainerView.addSubview(label)
            label.alignLeading("0", trailing: "0", toView: labelContainerView)
        }

        // We need to stack them a bit funny, because the currentAskingPriceLabel may be removed from the hierarchy later
        // So the layout needs to work with or without it.
        lotNumberLabel.alignTopEdgeWithView(labelContainerView, predicate: "0")
        artistsNamesLabel.alignAttribute(.Top, toAttribute: .Bottom, ofView: lotNumberLabel, predicate: "5")
        artistsNamesLabel.alignBottomEdgeWithView(labelContainerView, predicate: "<= 0")
        artistsNamesLabel.constrainBottomSpaceToView(currentAskingPriceLabel, predicate: "-2")
        currentAskingPriceLabel.alignBottomEdgeWithView(labelContainerView, predicate: "0")

        // Positions the label container.
        labelContainerView.constrainLeadingSpaceToView(lotImageView, predicate: "10")
        labelContainerView.alignTrailingEdgeWithView(contentView, predicate: "<= -10")
        labelContainerView.constrainHeight("<= 60")
        labelContainerView.alignCenterYWithView(lotImageView, predicate: "0")

        // Hammer image view.
        contentView.addSubview(hammerImageView)
        hammerImageView.alignCenterYWithView(contentView, predicate: "0")
        hammerImageView.alignTrailingEdgeWithView(contentView, predicate: "-10")
        hammerImageView.constrainLeadingSpaceToView(labelContainerView, predicate: ">= 10")
    }

    func setLotState(lotState: LotState) {
        let contentViewAlpha: CGFloat
        let currentLot: Bool

        switch lotState {
        case .ClosedLot:
            contentViewAlpha = 0.5
            currentLot = false
        case .LiveLot:
            contentViewAlpha = 1
            currentLot = true
        case .UpcomingLot:
            contentViewAlpha = 1
            currentLot = false
        }

        let labelColor: UIColor

        if currentLot {
            selectedBackgroundView = nil
            labelContainerView.addSubview(currentAskingPriceLabel)
            labelContainerView.addSubview(hammerImageView)

            [topSeparator, bottomSeparator].forEach { $0.hidden = true }

            labelColor = .whiteColor()

            // Artists' names are restricted to one line.
            artistsNamesLabel.numberOfLines = 1
            artistsNamesLabel.lineBreakMode = .ByTruncatingTail

            backgroundColor = .artsyPurpleRegular()
        } else {
            selectedBackgroundView = UIView().then {
                $0.backgroundColor = .artsyGrayLight()
            }
            currentAskingPriceLabel.removeFromSuperview()
            hammerImageView.removeFromSuperview()
            hammerImageView.hidden = true

            topSeparator.hidden = isNotTopCell
            bottomSeparator.hidden = false

            labelColor = .blackColor()

            // Artists' names are allowed to expand.
            artistsNamesLabel.numberOfLines = 0
            artistsNamesLabel.lineBreakMode = .ByWordWrapping

            backgroundColor = .clearColor()
        }

        [lotImageView, labelContainerView].forEach { $0.alpha = contentViewAlpha }
        [lotNumberLabel, artistsNamesLabel, currentAskingPriceLabel].forEach { $0.textColor = labelColor }


        contentView.setNeedsLayout()
    }
}

private typealias ClassFunctions = LotListCollectionViewCell
extension ClassFunctions {
    class func _lotNumberLabel() -> UILabel {
        return ARSansSerifLabel().then {
            $0.font = UIFont.sansSerifFontWithSize(12)
            $0.numberOfLines = 1
            $0.backgroundColor = .clearColor()
        }
    }

    class func _artistNamesLabel() -> UILabel {
        return ARSerifLabel().then {
            $0.font = UIFont.serifFontWithSize(14)
            $0.backgroundColor = .clearColor()
        }
    }

    class func _currentAskingPriceLabel() -> UILabel {
        return ARSansSerifLabel().then {
            $0.font = UIFont.sansSerifFontWithSize(16)
            $0.backgroundColor = .clearColor()
        }
    }

    class func _labelContainerView() -> UIView {
        return UIView().then {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
    }
}
