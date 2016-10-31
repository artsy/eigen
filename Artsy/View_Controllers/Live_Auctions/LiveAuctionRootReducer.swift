import Foundation
import ReSwift

struct LiveAuctionRootReducer: Reducer {
    typealias ReducerStateType = LiveAuctionState
    
    func handleAction(action: Action, state: LiveAuctionState?) -> LiveAuctionState {
        return LiveAuctionState(
            operatorIsConnected: operatorIsConnected(state?.operatorIsConnected, action: action),
            socketIsConnected: socketIsConnected(state?.socketIsConnected, action: action)
        )
    }
}