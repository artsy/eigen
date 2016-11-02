import UIKit

extension UITableViewController {
    var appDependentRowAnimationStyle: UITableViewRowAnimation {
        return ARPerformWorkAsynchronously.boolValue ? .automatic : .none
    }
}
