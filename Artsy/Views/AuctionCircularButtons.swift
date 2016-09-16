import Foundation
import Artsy_UIButtons
import FLKAutoLayout

@objc enum CircularButtonType: NSInteger {
    case Cancel
    case Info

    var image: UIImage! {
        let imageName: String

        switch self {
        case .Cancel: imageName = "CircularCancelButton"
        case .Info: imageName = "CircularInfoButton"
        }

        return UIImage(named: imageName)
    }
}

extension UIButton {
    /// Returns one of a set of circular buttons used throughout the app.
    static func circularButton(type: CircularButtonType) -> UIButton {
        let button = UIButton(type: .Custom)
        button.setImage(type.image, forState: .Normal)
        button.imageView?.contentMode = .ScaleAspectFit
        button.ar_extendHitTestSizeByWidth(4, andHeight: 4) // To expand to required 44pt hit area (images are 40x40).
        return button
    }
}
