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
    // TODO: Remove once we have our state broken into constituent pieces.
    let updatedState = Signal<AnyObject>()

    let currentLot = Signal<LiveAuctionLot>()
    var lots = [LiveAuctionLot]()

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