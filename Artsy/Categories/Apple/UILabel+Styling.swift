import UIKit
import Artsy_UIColors

extension UILabel {

    func makeSubstringFaint(_ substring: String) {
        makeSubstring(substring, useAttributes: [NSAttributedStringKey.foregroundColor: UIColor.artsyGraySemibold()])
    }

    func makeSubstring(_ substring: String, useFont font: UIFont) {
        makeSubstring(substring, useAttributes: [NSAttributedStringKey.font: font])
    }

    func makeSubstring(_ substring: String, useAttributes attributes: [NSAttributedStringKey: Any]) {
        guard let
            attributedText = self.attributedText?.mutableCopy() as? NSMutableAttributedString,
            let text: NSString = self.text as NSString?
            else { return }

        let range = text.range(of: substring)
        if range.location != NSNotFound {
            attributedText.setAttributes(attributes, range: range)
        }

        self.attributedText = attributedText
    }

    func resizeFont(to size: CGFloat) {
        font = font.withSize(size)
    }
}
