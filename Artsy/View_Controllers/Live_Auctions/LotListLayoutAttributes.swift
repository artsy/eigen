import UIKit

class LotListLayoutAttributes: UICollectionViewLayoutAttributes {
    var selected = false
}

private typealias Copying = LotListLayoutAttributes
extension Copying {

    override func copyWithZone(zone: NSZone) -> AnyObject {
        let copy = super.copyWithZone(zone) as! LotListLayoutAttributes

        copy.selected = selected

        return copy
    }
    
}
