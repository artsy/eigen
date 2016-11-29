import Foundation
import ReSwift

struct LiveAuctionState: StateType {
    var operatorIsConnected: Bool
    var socketIsConnected: Bool
    var isInitialStateLoaded: Bool
}
