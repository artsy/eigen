import Foundation
import ReSwift

func operatorIsConnected(state: Bool?, action: Action) -> Bool {
    switch action {
    case let action as ChangeOperatorIsConnectedAction:
        return action.operatorIsConnected
    default:
        return state ?? true  // Defaulting to true in case the value isn't specified, we don't want to obstruct the user.
    }
}