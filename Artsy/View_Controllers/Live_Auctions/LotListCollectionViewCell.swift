import UIKit
import Artsy_UIColors


class LotListCollectionViewCell: UICollectionViewCell {
    static let CellIdentifier = "LotCellIdentifier"
    static let Height: CGFloat = 80

    override func applyLayoutAttributes(layoutAttributes: UICollectionViewLayoutAttributes) {
        super.applyLayoutAttributes(layoutAttributes)
        guard let layoutAttributes = layoutAttributes as? LotListLayoutAttributes else { return }

        if layoutAttributes.selected {
            backgroundColor = .artsyPurpleRegular()
        } else {
            backgroundColor = .grayColor()
        }
    }
}

class LotListLayoutAttributes: UICollectionViewLayoutAttributes {
    var selected = false

    override func copyWithZone(zone: NSZone) -> AnyObject {
        let copy = super.copyWithZone(zone) as! LotListLayoutAttributes

        copy.selected = selected

        return copy
    }
}
