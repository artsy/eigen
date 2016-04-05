import UIKit

extension UIViewController {

    /// Returns YES for iPhone trait collections (view controllers presented on phones).
    /// Returns NO for all other interface idioms.
    var traitDependentAutorotateSupport: Bool {
        return traitCollectionIsPhone ? false : true
    }


    /// Returns UIInterfaceOrientationMaskPortrait for iPhone trait collections (view controllers presented on phones).
    /// Returns UIInterfaceOrientationMaskAll for all other interface idioms.
    var traitDependentSupportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.traitCollectionIsPhone ? .Portrait : .All
    }
    
    var useLargeLayout: Bool
    {
        return self.traitCollection.horizontalSizeClass != .Compact
    }

}

private extension UIViewController {
    /// Returns true iff the receiver's trait collection interface idiom is .Phone.
    /// Private because we want to keep the device-specific stuff abstracted outside of individual view controllers.
    private var traitCollectionIsPhone: Bool {
        return traitCollection.userInterfaceIdiom == .Phone
    }
}
