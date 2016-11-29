import UIKit
import Artsy_UIColors

extension UILabel {

    func makeSubstringFaint(_ substring: String) {
        guard let
            attributedText = self.attributedText?.mutableCopy() as? NSMutableAttributedString,
            let text: NSString = self.text as NSString?
            else { return }

        let range = text.range(of: substring)
        if range.location != NSNotFound {
            attributedText.setAttributes([NSForegroundColorAttributeName: UIColor.artsyGraySemibold()], range: range)
        }

        self.attributedText = attributedText
    }

}
