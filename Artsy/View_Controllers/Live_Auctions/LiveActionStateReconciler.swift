import Foundation
import Interstellar

/*

State of a live auction includes:

- currentLotId
- lots
  - reserveStatus
  - events (and computed properties from them)
  - next bid amount (onlineAskingPriceCents)


State update includes:

1. Update current lot
2. For each lot:
  a. Update reserve status
  b. Insert new events
  c. Update next bid amount

*/

class LiveAuctionStateReconciler: NSObject {
    typealias LotID = String
    typealias LotPair = (lot: LiveAuctionLot, viewModel: LiveAuctionLotViewModel)

    let currentLot = Signal<LiveAuctionLotViewModel>()
    var lots = [LiveAuctionLot]()
    // TODO: need to notify of updated lots externally somehow 🤔

    private var _state = [LotID: LotPair]()
}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions {

    func updateState(state: AnyObject) {
        // TODO: don't fail silently on bad input
        guard let lotsJSON = state["lots"] as? ObjectJSON else { return }
        guard let saleJSON = state["sale"] as? [String: AnyObject] else { return }
        guard let orderedLots = saleJSON["lots"] as? [String] else { return }
        guard let currentLotID = state["currentLotId"] as? String else { return }
        guard let eventsJSON = state["lotEvents"] as? ObjectJSON  else { return }

        let newEventIDs = createOrUpdateLots(orderedLots, lotsJSON: lotsJSON)
        updateLotsWithEvents(newEventIDs, eventsJSON: eventsJSON)
        updateCurrentLotWithID(currentLotID)
    }

}


private typealias PrivateFunctions = LiveAuctionStateReconciler
private extension PrivateFunctions {
    typealias ObjectJSON = [String: [String: AnyObject]]
    typealias NewEventIDs = Set<String>

    /// Returns event IDs that need to be inserted into the lots.
    func createOrUpdateLots(orderedLotIDs: [LotID], lotsJSON: ObjectJSON) -> NewEventIDs {
        let newEventIDs: NewEventIDs

        // Convert Dictionary into array of individual lot dictionaries, according to lot ID.
        // This array will be sorted by correct lot IDs (as dictated by orderedLotIDs).
        let sortedLotsJSON = orderedLotIDs.flatMap { lotID in
            return lotsJSON[lotID]
        }

        // If we have same lot counts, we can do a linear scan to update; otherwise, we replace.
        if sortedLotsJSON.count == self._state.count {
            // TODO: create-or-update with a linear scan through self._state and sorted lotsJSON arrays.

            newEventIDs = NewEventIDs()
        } else {
            // Create new lots, and corresponding view models
            let newLots = sortedLotsJSON.map { LiveAuctionLot(JSON: $0) }
            let newViewModels = newLots.map { LiveAuctionLotViewModel(lot: $0) }

            // Update state by zipping lots/view models, and then reducing them into a dictionary to satisfy _state type.
            self._state = zip(newLots, newViewModels).reduce([:], combine: { (dict, lotPair) -> [LotID: LotPair] in
                let lot = lotPair.0
                let lotViewModel = lotPair.1
                return dict + [lot.liveAuctionLotID: (lot: lot, viewModel: lotViewModel)]
            })

            // Since we have all new lots, we also have all-new event IDs
            newEventIDs = Set(newLots.flatMap { $0.events })
        }

        return newEventIDs
    }

    func updateLotsWithEvents(newEventIDs: NewEventIDs, eventsJSON: ObjectJSON) {
        eventsJSON.forEach { (eventID, eventJSON) in
            // TODO: somehow inject any new events into lot pairs
            // TODO: take advantage of the fact that events don't change, and are never removed
        }
    }

    func updateCurrentLotWithID(currentLotID: LotID) {
        if let currentLot = _state[currentLotID] {
            self.currentLot.update(currentLot.viewModel)
        }
    }

}
