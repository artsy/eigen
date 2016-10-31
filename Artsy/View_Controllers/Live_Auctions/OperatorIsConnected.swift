import Foundation
import ReSwift

func operatorIsConnected(state: Bool?, action: Action) -> Bool {
    switch action {
    case let action as ChangeOperatorIsConnectedAction:
        return action.operatorIsConnected
    default:
        return false
    }
}