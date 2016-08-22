import UIKit

extension UITableViewController {
    var appDependentRowAnimationStyle: UITableViewRowAnimation {
        return ARPerformWorkAsynchronously ? .Automatic : .None
    }
}
