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

    let currentLot = Signal<LiveAuctionLotViewModel>()
    var lots = [LiveAuctionLot]()
    // TODO: need to notify of updated lots externally somehow 🤔

    private var _state = [LotID: LiveAuctionLotViewModel]()

}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions {

    func updateState(state: AnyObject) {
        // TODO: don't fail silently on bad input
        guard let lotsJSON = state["lots"] as? ObjectJSON else { return }
        guard let saleJSON = state["sale"] as? [String: AnyObject] else { return }
        guard let orderedLotIDs = saleJSON["lots"] as? [String] else { return }
        guard let currentLotID = state["currentLotId"] as? String else { return }
        guard let eventsJSON = state["lotEvents"] as? ObjectJSON  else { return }

        // Convert Dictionary into array of individual lot dictionaries, according to lot ID.
        // This array will be sorted by correct lot IDs (as dictated by orderedLotIDs).
        let sortedLotsJSON = orderedLotIDs.flatMap { lotID in
            return lotsJSON[lotID]
        }

        // Convert the sortedLotsJSON into the existing, in-memory LotPairs
        let sortedLotIDs = sortedLotsJSON.flatMap { json in
            return json["id"] as? LotID
        }

        createOrUpdateLots(sortedLotsJSON, sortedLotIDs: sortedLotIDs)
        updateLotsWithEvents(eventsJSON, sortedLotsJSON: sortedLotsJSON, sortedLotIDs: sortedLotIDs)
        updateCurrentLotWithID(currentLotID)
    }

}


private typealias PrivateFunctions = LiveAuctionStateReconciler
private extension PrivateFunctions {
    typealias ObjectJSON = [String: [String: AnyObject]]
    typealias NewEventIDs = Set<String>

    /// Returns event IDs that need to be inserted into the lots.
    func createOrUpdateLots(sortedLotsJSON: [[String: AnyObject]], sortedLotIDs: [LotID]) {

        let sortedLotViewModels = sortedLotViewModelsFromLotIDs(sortedLotIDs)

        // If we have same lot counts, we can do a linear scan to update; otherwise, we replace.
        if sortedLotsJSON.count == sortedLotViewModels.count {
            // Loop through our json and in-memory models pairwise, updating the reserve status and asking price.

            for (json, lotViewModel) in zip(sortedLotsJSON, sortedLotViewModels) {
                guard let reserveStatusString = json["reserveStatus"] as? String else { continue }
                guard let askingPrice = json["onlineAskingPriceCents"] as? Int else { continue }

                lotViewModel.updateReserveStatus(reserveStatusString)
                lotViewModel.updateOnlineAskingPrice(askingPrice)
            }

        } else {
            // Create new lots, and corresponding view models
            let newViewModels = sortedLotsJSON
                .map { LiveAuctionLot(JSON: $0) }
                .map { LiveAuctionLotViewModel(lot: $0) }

            // Note: we're not adding event IDs here to the model we'll do that in updateLotsWithEvents()

            // Update state by zipping lots/view models, and then reducing them into a dictionary to satisfy _state type.
            self._state = newViewModels.reduce([:], combine: { (dict, lotViewModel) -> [LotID: LiveAuctionLotViewModel] in
                return dict + [lotViewModel.liveAuctionLotID: lotViewModel]
            })
        }
    }

    func updateLotsWithEvents(eventsJSON: ObjectJSON, sortedLotsJSON: [[String: AnyObject]], sortedLotIDs: [LotID]) {

        let sortedLotViewModels = sortedLotViewModelsFromLotIDs(sortedLotIDs)

        zip(sortedLotsJSON, sortedLotViewModels).forEach { (lotJSON, viewModel) in
            let jsonEventIDs = lotJSON["events"] as? [String] ?? []
            let newEventIDs = jsonEventIDs.subarrayFromFirstDifference(viewModel.eventIDs)

            let newEvents = newEventIDs
                .flatMap { eventID in
                    return eventsJSON[eventID]
                }
                .flatMap { eventJSON in
                    return LiveEvent(JSON: eventJSON)
                }

            viewModel.addEvents(newEvents)
        }

    }

    func updateCurrentLotWithID(currentLotID: LotID) {
        if let currentLotViewModel = _state[currentLotID] {
            self.currentLot.update(currentLotViewModel)
        }
    }

    func sortedLotViewModelsFromLotIDs(lotIDs: [LotID]) -> [LiveAuctionLotViewModel] {
        return lotIDs.flatMap { lotID in
            return _state[lotID]
        }
    }
}
