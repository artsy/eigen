import Foundation
import Interstellar

/*

State of a live auction includes:

- currentLotId
- lots
  - reserveStatus
  - events (and computed properties from them)
  - next bid amount (onlineAskingPriceCents)

*/

class LiveAuctionStateReconciler: NSObject {
    let updatedState = Signal<AnyObject>()

    // Updates the signal for us.
    private var state: AnyObject? {
        didSet {
            guard let state = state else { return }
            updatedState.update(state)
        }
    }
}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions {
    func updateState(state: AnyObject) {
        self.state = state
    }
}
