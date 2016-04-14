import UIKit
import Artsy_UILabels
import Artsy_UIFonts
import Then

private typealias PrivateFunctions = LotListCollectionViewCell
extension PrivateFunctions {

    func setup() {
        contentView.translatesAutoresizingMaskIntoConstraints = false
        contentView.alignToView(self)

        contentView.addSubview(imageView)
        imageView.constrainWidth("60", height: "60")
        imageView.alignTop("10", bottom: "-10", toView: contentView)
        imageView.alignLeadingEdgeWithView(contentView, predicate: "20")

        contentView.addSubview(labelContainerView)
        [lotNumberLabel, artistsNamesLabel, currentAskingPriceLabel].forEach { label in
            labelContainerView.addSubview(label)
            label.alignLeading("0", trailing: "0", toView: labelContainerView)
        }
        lotNumberLabel.alignTopEdgeWithView(labelContainerView, predicate: "0")
        artistsNamesLabel.alignAttribute(.Top, toAttribute: .Bottom, ofView: lotNumberLabel, predicate: "0")
        artistsNamesLabel.alignBottomEdgeWithView(labelContainerView, predicate: "<= 0")
        artistsNamesLabel.constrainBottomSpaceToView(currentAskingPriceLabel, predicate: "  0")
        currentAskingPriceLabel.alignBottomEdgeWithView(labelContainerView, predicate: "0")

        labelContainerView.constrainLeadingSpaceToView(imageView, predicate: "10")
        labelContainerView.constrainHeight("<= 60")
//        labelContainerView.alignTop("10", bottom: nil, toView: contentView)
        labelContainerView.alignCenterYWithView(imageView, predicate: "0")
    }

    func setLotState(lotState: LotState) {
        // Reset to defaults
        contentView.alpha = 1

        let color: UIColor

        switch lotState {
        case .ClosedLot:
            currentAskingPriceLabel.removeFromSuperview()
            contentView.alpha = 0.5
            color = .blackColor()
        case .LiveLot:
            labelContainerView.addSubview(currentAskingPriceLabel)
            color = .whiteColor()
        case .UpcomingLot:
            currentAskingPriceLabel.removeFromSuperview()
            color = .blackColor()
        }

        [lotNumberLabel, artistsNamesLabel, currentAskingPriceLabel].forEach { $0.textColor = color }
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
