import UIKit

extension UITableViewController {
    var appDependentRowAnimationStyle: UITableView.RowAnimation {
        return ARPerformWorkAsynchronously.boolValue ? .automatic : .none
    }
}
