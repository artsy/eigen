import Foundation
import UIKit
import Artsy_UIFonts

extension NSAttributedString {
    func makeBoldOccurencesSansSerifSemiBold() -> NSAttributedString {
        let copy = NSMutableAttributedString(attributedString: self)

        enumerateAttributesInRange(NSRange(location: 0, length: length), options: []) { (attrs, range, _) in
            guard let font = attrs[NSFontAttributeName] as? UIFont else { return }

            if font.isBold {
                copy.setAttributes([NSFontAttributeName: UIFont.serifSemiBoldFontWithSize(font.pointSize)], range: range)
            }
        }

        return NSAttributedString(attributedString: copy)
    }
}

extension UIFont {
    var isBold: Bool {
        return fontDescriptor().symbolicTraits.contains(.TraitBold)
    }
}
