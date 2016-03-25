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

    // TODO: Remove once we have our state broken into constituent pieces.
    let updatedState = Signal<AnyObject>()

    let currentLot = Signal<LiveAuctionLotViewModel>()
    var lots = [LiveAuctionLot]()

    private var _state = [LotID: LotPair]()
}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions {
    func updateState(state: AnyObject) {
        guard let lotsJSON = state["lots"] as? [String: [String: AnyObject]] else { return }
        guard let currentLotID = state["currentLotId"] as? String else { return }
        guard let eventsJSON = state["lotEvents"] as? [String: [String: AnyObject]]  else { return }

        // TODO: state["lots"] is a dictionary, but state["sale"]["lots"] is an array of _ordered_ lot IDs, so sorting the lotsJSON would be a good idea.

        lotsJSON.forEach { (lotID, lotJSON) in
            // TODO: create-or-update with a linear scan through self._state and sorted lotsJSON arrays.
        }

        eventsJSON.forEach { (eventID, eventJSON) in
            // TODO: somehow inject any new events into lot pairs
            // TODO: take advantage of the fact that events don't change, and are never removed
        }

        if let currentLot = _state[currentLotID] {
            self.currentLot.update(currentLot.viewModel)
        }
    }
}

//func update(json: AnyObject) {
//
//    guard let lotsJSON = json["lots"] as? [String: [String: AnyObject]] else { return }
//    guard let saleJSON = json["sale"] as? [String: AnyObject] else { return }
//    guard let eventsJSON = json["lotEvents"] as? [String: [String: AnyObject]]  else { return }
//
//    let sale = LiveSale(JSON: saleJSON)
//    self.sale = sale
//    let unordered_lots: [LiveAuctionLot] = lotsJSON.values.map { LiveAuctionLot(JSON: $0) }
//    self.lots = unordered_lots.sort { return $0.position < $1.position }
//
//    let eventModels: [LiveEvent] = eventsJSON.values.flatMap { LiveEvent(JSON: $0) }
//    var eventDictionary: [String: LiveEvent] = [:]
//    for event in eventModels {
//        eventDictionary[event.eventID] = event
//    }
//    self.events = eventDictionary
//
//}