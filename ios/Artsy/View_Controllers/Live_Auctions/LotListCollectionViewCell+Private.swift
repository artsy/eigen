import UIKit
import Then

private typealias PrivateFunctions = LotListCollectionViewCell
extension PrivateFunctions {

    func resetViewHierarchy() {
        contentView.subviews.forEach { $0.removeFromSuperview() }

        // Separators
        [topSeparator, bottomSeparator].forEach { separator in
            contentView.addSubview(separator)
            separator.alignLeading("0", trailing: "0", toView: self)
        }
        topSeparator.alignTopEdge(withView: contentView, predicate: "0")
        // By placing the bottomSeparator 1pt below our bottom edge (outside our bounds), it is hidden from
        // view if the cell beneath us is the current lot.
        bottomSeparator.alignBottomEdge(withView: contentView, predicate: "1")

        // Add and arrange lotImageView.
        contentView.addSubview(lotImageView)
        lotImageView.constrainWidth("60", height: "60")
        lotImageView.alignTop("10", bottom: "-10", toView: contentView)
        lotImageView.alignLeadingEdge(withView: contentView, predicate: "20")

        // Now add, arrange, and configure the labelContainerView
        contentView.addSubview(labelContainerView)
        [lotNumberLabel, artistsNamesLabel, currentAskingPriceLabel].forEach { label in
            // Add them and pin their leading/trailing edges
            labelContainerView.addSubview(label)
            label.alignLeading("0", trailing: "0", toView: labelContainerView)
        }

        // We need to stack them a bit funny, because the currentAskingPriceLabel may be removed from the hierarchy later
        // So the layout needs to work with or without it.
        lotNumberLabel.alignTopEdge(withView: labelContainerView, predicate: "0")
        artistsNamesLabel.alignAttribute(.top, to: .bottom, ofView: lotNumberLabel, predicate: "5")
        artistsNamesLabel.alignBottomEdge(withView: labelContainerView, predicate: "<= 0")
        artistsNamesLabel.constrainBottomSpace(toView: currentAskingPriceLabel, predicate: "-2")
        currentAskingPriceLabel.alignBottomEdge(withView: labelContainerView, predicate: "0")

        // Positions the label container.
        labelContainerView.constrainLeadingSpace(toView: lotImageView, predicate: "10")
        labelContainerView.alignTrailingEdge(withView: contentView, predicate: "<= -10")
        labelContainerView.constrainHeight("<= 60")
        labelContainerView.alignCenterY(withView: lotImageView, predicate: "0")

        contentView.addSubview(closedLabel)
        closedLabel.alignTrailingEdge(withView: contentView, predicate: "-20")
        closedLabel.alignCenterY(withView: lotImageView, predicate: "0")
        closedLabel.constrainLeadingSpace(toView: labelContainerView, predicate: ">= 10")

        // Hammer image view.
        contentView.addSubview(hammerImageView)
        hammerImageView.alignCenterY(withView: contentView, predicate: "0")
        hammerImageView.alignTrailingEdge(withView: contentView, predicate: "-10")
        hammerImageView.constrainLeadingSpace(toView: labelContainerView, predicate: ">= 10")
    }

    func setLotState(_ lotState: LotState) {
        resetViewHierarchy()

        let contentViewAlpha: CGFloat
        let currentLot: Bool

        switch lotState {
        case .closedLot:
            contentViewAlpha = 0.5
            currentLot = false
        case .liveLot:
            contentViewAlpha = 1
            currentLot = true
            closedLabel.removeFromSuperview()
        case .upcomingLot:
            contentViewAlpha = 1
            currentLot = false
            closedLabel.removeFromSuperview()
        }

        let labelColor: UIColor

        if currentLot {
            selectedBackgroundView = nil

            [topSeparator, bottomSeparator].forEach { $0.isHidden = true }

            labelColor = .white

            // Artists' names are restricted to one line.
            artistsNamesLabel.numberOfLines = 1
            artistsNamesLabel.lineBreakMode = .byTruncatingTail

            backgroundColor = .artsyPurpleRegular()
        } else {
            selectedBackgroundView = UIView().then {
                $0.backgroundColor = .artsyGrayLight()
            }
            currentAskingPriceLabel.removeFromSuperview()
            hammerImageView.removeFromSuperview()

            topSeparator.isHidden = isNotTopCell
            bottomSeparator.isHidden = false

            labelColor = .black

            // Artists' names are allowed to expand.
            artistsNamesLabel.numberOfLines = 0
            artistsNamesLabel.lineBreakMode = .byWordWrapping

            backgroundColor = .clear
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
            $0.font = UIFont.sansSerifFont(withSize: 12)
            $0.numberOfLines = 1
            $0.backgroundColor = .clear
        }
    }

    class func _artistNamesLabel() -> UILabel {
        return ARSerifLabel().then {
            $0.font = UIFont.serifFont(withSize: 14)
            $0.backgroundColor = .clear
        }
    }

    class func _currentAskingPriceLabel() -> UILabel {
        return ARSansSerifLabel().then {
            $0.font = UIFont.sansSerifFont(withSize: 16)
            $0.backgroundColor = .clear
        }
    }

    class func _labelContainerView() -> UIView {
        return UIView().then {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }
    }

    class func _closedLabel() -> UILabel {
        return ARSansSerifLabel().then {
            $0.font = UIFont.sansSerifFont(withSize: 12)
            $0.backgroundColor = .clear
            $0.textColor = .artsyRedRegular()
            $0.text = "CLOSED"
        }
    }

}
