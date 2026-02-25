import UIKit
import ObjectiveC

private var statusViewAssociatedKey: Int = 0

enum BlurredStatusOverlayViewCloseButtonState {
    case hide
    case show(target: NSObject, selector: Selector)
}

// As of iOS7+, it is the responsibility of the view controller to maintain its preferred status bar style.
// This style may change while the blurred overlay is present, but it's up to the view controller to do that.
extension UIViewController {

    var blurredStatusOverlayView: UIView? {
        set {
            objc_setAssociatedObject(self, &statusViewAssociatedKey, newValue, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        }
        get {
            return objc_getAssociatedObject(self, &statusViewAssociatedKey) as? UIView
        }
    }

    func ar_presentBlurredOverlayWithTitle(_ title: String, subtitle: String, buttonState: BlurredStatusOverlayViewCloseButtonState = .hide) {

        if blurredStatusOverlayView != nil { return }

        let blurView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
        self.blurredStatusOverlayView = blurView
        self.view.addSubview(blurView)
        if let view = self.view {
            blurView.align(toView: view)
        }

        let container = blurView.contentView

        // Optional X button in the top trailing edge
        if case .show(let target, let selector) = buttonState {
            let dimension = 40
            let closeButton = ARMenuButton()
            closeButton.setBorderColor(.white, for: UIControl.State(), animated: false)
            closeButton.setBackgroundColor(.clear, for: UIControl.State(), animated: false)
            let cross = UIImage(named: "serif_modal_close")?.withRenderingMode(.alwaysTemplate)
            closeButton.setImage(cross, for: UIControl.State())
            closeButton.alpha = 0.5
            closeButton.tintColor = .white
            closeButton.addTarget(target, action: selector, for: .touchUpInside)

            container.addSubview(closeButton)
            closeButton.alignTrailingEdge(withView: container, predicate: "-20")
            closeButton.alignTopEdge(withView: container, predicate: "20")
            closeButton.constrainWidth("\(dimension)", height: "\(dimension)")
        }

        let textStack = ORStackView()
        textStack.addSerifPageTitle(title, subtitle: subtitle)
        textStack.subviews
            .compactMap { $0 as? UILabel }
            .forEach { label in
                label.textColor = .white
                label.backgroundColor = .clear
            }

        // Vertically center the text stack
        container.addSubview(textStack)
        textStack.constrainWidth(toView: container, predicate: "-40")
        textStack.alignCenter(withView: container)
    }

    func ar_removeBlurredOverlayWithTitle() {
        guard let blurredStatusOverlayView = blurredStatusOverlayView else { return }
        blurredStatusOverlayView.removeFromSuperview()
        self.blurredStatusOverlayView = nil
    }
}
