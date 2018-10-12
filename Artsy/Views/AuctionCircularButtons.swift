import Foundation

@objc enum CircularButtonType: NSInteger {
    case cancel
    case info

    var image: UIImage! {
        let imageName: String

        switch self {
        case .cancel: imageName = "CircularCancelButton"
        case .info: imageName = "CircularInfoButton"
        }

        return UIImage(named: imageName)
    }
}

extension UIButton {
    /// Returns one of a set of circular buttons used throughout the app.
    static func circularButton(_ type: CircularButtonType) -> UIButton {
        let button = UIButton(type: .custom)
        button.setImage(type.image, for: UIControl.State())
        button.imageView?.contentMode = .scaleAspectFit
        button.ar_extendHitTestSize(byWidth: 4, andHeight: 4) // To expand to required 44pt hit area (images are 40x40).
        return button
    }
}
