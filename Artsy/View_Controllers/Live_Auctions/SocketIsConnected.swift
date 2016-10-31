import Foundation
import ReSwift

func socketIsConnected(state: Bool?, action: Action) -> Bool {
    switch action {
    case let action as ChangeSocketIsConnectedAction:
        return action.isConnected
    default: return false
    }
}