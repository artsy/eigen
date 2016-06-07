import UIKit
import Artsy_UIColors

extension UILabel {

    func makeSubstringFaint(substring: String) {
        guard let
            attributedText = self.attributedText!.mutableCopy() as? NSMutableAttributedString,
            text: NSString = self.text
            else { return }

        let range = text.rangeOfString(substring)
        if range.location != NSNotFound {
            attributedText.setAttributes([NSForegroundColorAttributeName: UIColor.artsyGraySemibold()], range: range)
        }

        self.attributedText = attributedText
    }

}