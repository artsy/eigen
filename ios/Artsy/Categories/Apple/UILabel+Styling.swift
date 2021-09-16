import UIKit

extension UILabel {

    func makeSubstringFaint(_ substring: String) {
        makeSubstring(substring, useAttributes: [NSAttributedString.Key.foregroundColor: UIColor.artsyGraySemibold() as Any])
    }

    func makeSubstring(_ substring: String, useFont font: UIFont) {
        makeSubstring(substring, useAttributes: [NSAttributedString.Key.font: font])
    }

    func makeSubstring(_ substring: String, useAttributes attributes: [NSAttributedString.Key: Any]) {
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
