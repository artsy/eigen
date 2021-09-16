import UIKit

extension UIViewController {
    /// Loads the view by faking a non-animated (dis)appearance transition.
    func loadViewProgrammatically(_ appearing: Bool = true) {
        beginAppearanceTransition(appearing, animated: false)
        endAppearanceTransition()
    }
}
