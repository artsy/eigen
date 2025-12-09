import Foundation
import UIKit

extension NSAttributedString {
    @objc func makeBoldOccurencesSansSerifSemiBold() -> NSAttributedString {
        let copy = NSMutableAttributedString(attributedString: self)

        enumerateAttributes(in: NSRange(location: 0, length: length), options: []) { (attrs, range, _) in
            guard let font = attrs[NSAttributedString.Key.font] as? UIFont else { return }

            // font is bold
            if font.fontDescriptor.symbolicTraits.contains(.traitBold) {
                copy.setAttributes([NSAttributedString.Key.font: UIFont.serifSemiBoldFont(withSize: font.pointSize) as Any], range: range)
            }
        }

        return NSAttributedString(attributedString: copy)
    }
}
