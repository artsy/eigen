import UIKit
import ObjectiveC
import Artsy_UIButtons
import ORStackView

private var statusViewAssociatedKey: Int = 0
private var statusViewPreviousStatusBarStyle: UIStatusBarStyle = .Default

enum BlurredStatusOverlayViewCloseButtonState {
    case Hide
    case Show(target: NSObject, selector: Selector)
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

    func ar_presentBlurredOverlayWithTitle(title: String, subtitle: String, buttonState: BlurredStatusOverlayViewCloseButtonState = .Hide) {

        if blurredStatusOverlayView != nil { return }

        // This is processing heavy, move the blurring / setup to a background queue

        ar_dispatch_async {

            UIGraphicsBeginImageContext(self.view.bounds.size);
            self.view.drawViewHierarchyInRect(self.view.bounds, afterScreenUpdates:false)
            let viewImage = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();

            let blurredImage = viewImage.blurredImageWithRadius(12, iterations: 2, tintColor: UIColor.blackColor())

            ar_dispatch_main_queue {
                // Create an imageview of the blurred view, for the view's background

                let imageView = UIImageView(frame: self.view.bounds)
                self.blurredStatusOverlayView = imageView

                imageView.image = blurredImage
                self.view.addSubview(imageView)
                imageView.alignToView(self.view)

                // We want it tinted black, but applying a black tint doesn't really
                // do too much in the blur image, so apply a transparent black overlay
                let darkOverlay = UIView(frame: imageView.bounds)
                darkOverlay.backgroundColor = UIColor(white: 0, alpha: 0.75)
                imageView.addSubview(darkOverlay)
                darkOverlay.alignToView(imageView)

                // As the BG will be dark, we need to set the status bar to be white
                // this should not affect the presentation, so if it's not showing, 
                // it's not going to show it.
                let app = UIApplication.sharedApplication()
                statusViewPreviousStatusBarStyle = app.statusBarStyle
                app.setStatusBarStyle(.LightContent, animated: true)

                // Optional X button in the top trailing edge
                if case .Show(let target, let selector) = buttonState {
                    let dimension = 40
                    let closeButton = ARMenuButton()
                    closeButton.setBorderColor(.whiteColor(), forState: .Normal, animated: false)
                    closeButton.setBackgroundColor(.clearColor(), forState: .Normal, animated: false)
                    let cross = UIImage(named:"serif_modal_close")?.imageWithRenderingMode(.AlwaysTemplate)
                    closeButton.setImage(cross, forState: .Normal)
                    closeButton.alpha = 0.5
                    closeButton.tintColor = .whiteColor()
                    closeButton.addTarget(target, action: selector, forControlEvents: .TouchUpInside)

                    imageView.addSubview(closeButton)
                    closeButton.alignTrailingEdgeWithView(imageView, predicate: "-20")
                    closeButton.alignTopEdgeWithView(imageView, predicate: "20")
                    closeButton.constrainWidth("\(dimension)", height: "\(dimension)")
                }

                let textStack = ORStackView()
                textStack.addSerifPageTitle(title, subtitle: subtitle)
                textStack.subviews.forEach {
                    guard let label = $0 as? UILabel else { return }
                    label.textColor = .whiteColor()
                    label.backgroundColor = .clearColor()
                }

                // Vertically center the text stack
                imageView.addSubview(textStack)
                textStack.constrainWidthToView(imageView, predicate: "-40")
                textStack.alignCenterWithView(imageView)
            }
        }
    }

    func ar_removeBlurredOverlayWithTitle() {
        guard let blurredStatusOverlayView = blurredStatusOverlayView else { return }
        blurredStatusOverlayView.removeFromSuperview()
        self.blurredStatusOverlayView = nil

        UIApplication.sharedApplication().statusBarStyle = statusViewPreviousStatusBarStyle
    }

}
