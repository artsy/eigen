import UIKit
import ObjectiveC
import Artsy_UIButtons
import ORStackView

private var statusViewAssociatedKey: Int = 0
private var statusViewPreviousStatusBarStyle: UIStatusBarStyle = .default

enum BlurredStatusOverlayViewCloseButtonState {
    case hide
    case show(target: NSObject, selector: Selector)
}

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

        // This is processing heavy, move the blurring / setup to a background queue

        ar_dispatch_async {

            UIGraphicsBeginImageContext(self.view.bounds.size)
            self.view.drawHierarchy(in: self.view.bounds, afterScreenUpdates: false)
            let viewImage = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()

            let blurredImage: UIImage? = viewImage?.blurredImage(withRadius: 12, iterations: 2, tintColor: UIColor.black)

            ar_dispatch_main_queue {
                // Create an imageview of the blurred view, for the view's background

                let imageView = UIImageView(frame: self.view.bounds)
                self.blurredStatusOverlayView = imageView

                imageView.image = blurredImage
                self.view.addSubview(imageView)
                imageView.align(toView: self.view)

                // We want it tinted black, but applying a black tint doesn't really
                // do too much in the blur image, so apply a transparent black overlay
                let darkOverlay = UIView(frame: imageView.bounds)
                darkOverlay.backgroundColor = UIColor(white: 0, alpha: 0.75)
                imageView.addSubview(darkOverlay)
                darkOverlay.align(toView: imageView)

                // As the BG will be dark, we need to set the status bar to be white
                // this should not affect the presentation, so if it's not showing,
                // it's not going to show it.
                let app = UIApplication.shared
                statusViewPreviousStatusBarStyle = app.statusBarStyle
                app.setStatusBarStyle(.lightContent, animated: true)

                // Optional X button in the top trailing edge
                if case .show(let target, let selector) = buttonState {
                    let dimension = 40
                    let closeButton = ARMenuButton()
                    closeButton.setBorderColor(.white, for: UIControlState(), animated: false)
                    closeButton.setBackgroundColor(.clear, for: UIControlState(), animated: false)
                    let cross = UIImage(named:"serif_modal_close")?.withRenderingMode(.alwaysTemplate)
                    closeButton.setImage(cross, for: UIControlState())
                    closeButton.alpha = 0.5
                    closeButton.tintColor = .white
                    closeButton.addTarget(target, action: selector, for: .touchUpInside)

                    imageView.addSubview(closeButton)
                    closeButton.alignTrailingEdge(withView: imageView, predicate: "-20")
                    closeButton.alignTopEdge(withView: imageView, predicate: "20")
                    closeButton.constrainWidth("\(dimension)", height: "\(dimension)")
                }

                let textStack = ORStackView()
                textStack.addSerifPageTitle(title, subtitle: subtitle)
                textStack.subviews
                    .flatMap { $0 as? UILabel }
                    .forEach { label in
                        label.textColor = .white
                        label.backgroundColor = .clear
                    }

                // Vertically center the text stack
                imageView.addSubview(textStack)
                textStack.constrainWidth(toView: imageView, predicate: "-40")
                textStack.alignCenter(withView: imageView)
            }
        }
    }

    func ar_removeBlurredOverlayWithTitle() {
        guard let blurredStatusOverlayView = blurredStatusOverlayView else { return }
        blurredStatusOverlayView.removeFromSuperview()
        self.blurredStatusOverlayView = nil

        UIApplication.shared.statusBarStyle = statusViewPreviousStatusBarStyle
    }

}
