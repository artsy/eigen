import UIKit
import Artsy_UILabels
import Artsy_UIFonts
import Then

private typealias PrivateFunctions = LotListCollectionViewCell
extension PrivateFunctions {

    // TODO: Layout user interface
    func setup() {
        translatesAutoresizingMaskIntoConstraints = false

        contentView.addSubview(imageView)
        imageView.constrainWidth("60", height: "60")
        imageView.alignTop("10", leading: "20", bottom: "10", trailing: nil, toView: contentView)

        contentView.addSubview(labelContainerView)
        [lotNumberLabel, artistsNamesLabel, currentAskingPriceLabel].forEach { label in
            labelContainerView.addSubview(label)
            label.alignLeading("0", trailing: "0", toView: labelContainerView)
        }
        lotNumberLabel.alignTopEdgeWithView(labelContainerView, predicate: "0")
        artistsNamesLabel.alignAttribute(.Top, toAttribute: .Bottom, ofView: lotNumberLabel, predicate: "0")
        artistsNamesLabel.constrainBottomSpaceToView(labelContainerView, predicate: ">= 0")
        artistsNamesLabel.constrainBottomSpaceToView(currentAskingPriceLabel, predicate: ">= 10")

        currentAskingPriceLabel.alignBottomEdgeWithView(labelContainerView, predicate: "0")

        labelContainerView.alignLeading("10", trailing: nil, toView: imageView)
        labelContainerView.alignTop("10", bottom: "10", toView: contentView)
    }

    func setLotState(lotState: LotState) {
        // Reset to defaults
        contentView.alpha = 1

        switch lotState {
        case .ClosedLot:
            contentView.alpha = 0.5
        case .LiveLot:
            labelContainerView.addSubview(currentAskingPriceLabel)
        case .UpcomingLot:
            currentAskingPriceLabel.removeFromSuperview()
        }

        contentView.setNeedsLayout()
    }
}

private typealias ClassFunctions = LotListCollectionViewCell
extension ClassFunctions {
    class func _lotNumberLabel() -> UILabel {
        return ARSansSerifLabel().then {
            $0.font = UIFont.sansSerifFontWithSize(12)
            $0.numberOfLines = 1
        }
    }

    class func _artistNamesLabel() -> UILabel {
        return UILabel()
    }

    class func _currentAskingPriceLabel() -> UILabel {
        return UILabel()
    }
}
