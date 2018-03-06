import Foundation
import UIKit
import Artsy_UIFonts

extension NSAttributedString {
    func makeBoldOccurencesSansSerifSemiBold() -> NSAttributedString {
        let copy = NSMutableAttributedString(attributedString: self)

        enumerateAttributes(in: NSRange(location: 0, length: length), options: []) { (attrs, range, _) in
            guard let font = attrs[NSAttributedStringKey.font] as? UIFont else { return }

            if font.isBold {
                copy.setAttributes([NSAttributedStringKey.font: UIFont.serifSemiBoldFont(withSize: font.pointSize)], range: range)
            }
        }

        return NSAttributedString(attributedString: copy)
    }
}

extension UIFont {
    var isBold: Bool {
        return fontDescriptor.symbolicTraits.contains(.traitBold)
    }
}
