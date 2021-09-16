import UIKit

struct NavigationButton {
    typealias HandlerClosure = @convention (block) (UIButton) -> Void

    let buttonClass: UIButton.Type
    let properties: [String: String]
    let handler: HandlerClosure

    var descriptionDictionary: NSDictionary {
        return [
            ARNavigationButtonClassKey: buttonClass,
            ARNavigationButtonPropertiesKey: properties,
            ARNavigationButtonHandlerKey: toBlock(handler)
        ]
    }
}

extension ARNavigationButtonsViewController {
    static func viewController(withButtons buttons: [NavigationButton]) -> ARNavigationButtonsViewController {
        return ARNavigationButtonsViewController(buttonDescriptions: buttons.map { $0.descriptionDictionary })
    }
}

private func toBlock(_ closure: @escaping NavigationButton.HandlerClosure) -> Any {
    return unsafeBitCast(closure, to: AnyObject.self)
}
