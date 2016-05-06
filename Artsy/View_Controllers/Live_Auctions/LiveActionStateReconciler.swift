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

protocol LiveAuctionStateReconcilerType {
    func updateState(state: AnyObject)
    func processLotEventBroadcast(broadcast: AnyObject)
    func processCurrentLotUpdate(update: AnyObject)

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> { get }
}

class LiveAuctionStateReconciler: NSObject {
    typealias LotID = String

    private let saleArtworks: [LiveAuctionLotViewModel]

    init(saleArtworks: [LiveAuctionLotViewModel]) {
        self.saleArtworks = saleArtworks
        super.init()
    }

    private let _currentLotSignal = Observable<LiveAuctionLotViewModel>()
    private var _currentLotID: String?
}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions: LiveAuctionStateReconcilerType {

    func updateState(state: AnyObject) {
        // TODO: how to handle changes to start/end times? Necessary at all?

        guard let fullLotStateById = state["fullLotStateById"] as? [String: [String: AnyObject]] else { return }
        let currentLotID = state["currentLotId"] as? String

        for lot in saleArtworks {
            // TODO: How should we handle failed parsing? Not silently, that's for sure!
            guard let json = fullLotStateById[lot.liveAuctionLotID] else { continue }
            guard let derivedLotState = json["derivedLotState"] as? [String: AnyObject] else { continue }
            guard let eventHistory = json["eventHistory"] as? [[String: AnyObject]] else { continue } // TODO move to events

            updateLotDerivedState(lot, derivedState: derivedLotState)
            updateLotWithEvents(lot, lotEvents: eventHistory)
        }

        // TODO: This is always nil for some reason, but regardless, the UI looks terrible if it is nil. It will be nil sometimes in production, so we should operate without it!
        updateCurrentLotWithIDIfNecessary(currentLotID)
    }

    func processLotEventBroadcast(broadcast: AnyObject) {

        guard let json = broadcast as? [String: AnyObject],
              let events = json["events"] as? [String: [String: AnyObject]],
              let lotID = events.values.first?["lotId"] as? String,
              let lot = saleArtworks.filter({ $0.lotID == lotID }).first,
              let derivedLotState = json["derivedLotState"] as? [String: AnyObject],
              let fullEventOrder = json["fullEventOrder"] as? [String] else { return }

        updateLotDerivedState(lot, derivedState: derivedLotState)
        updateLotWithEvents(lot, lotEvents: Array(events.values), fullEventOrder: fullEventOrder)
    }

    func processCurrentLotUpdate(update: AnyObject) {
        // TODO: implement
    }

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return _currentLotSignal.map { $0 as LiveAuctionLotViewModelType }
    }
}


private typealias PrivateFunctions = LiveAuctionStateReconciler
private extension PrivateFunctions {

    func updateLotDerivedState(lot: LiveAuctionLotViewModel, derivedState: [String: AnyObject]) {
        guard let reserveStatusString = derivedState["reserveStatus"] as? String else { return }

        // OK, this looks weird. Let's unpack.
        // derivedState["askingPriceCents"] is an AnyObject?, and casting it conditionally to a UInt64 always fails.
        // Instead, we'll use the UInt64(_ text: String) initialzer, which means we need to unwrap the AnyObject? and
        // then stick it in a string so it's not "Optional(23000)", then initialize the UInt64
        guard let extractedAskingPrice = derivedState["askingPriceCents"] else { return }
        guard let askingPrice = UInt64("\(extractedAskingPrice)") else { return }

        lot.updateReserveStatus(reserveStatusString)
        lot.updateOnlineAskingPrice(askingPrice)
    }


    func updateLotWithEvents(lot: LiveAuctionLotViewModel, lotEvents: [[String: AnyObject]], fullEventOrder: [String]? = nil) {
        // TODO: fullEventOrder, if specified, yields the _exact_ history and order of events. We need to remove any local events not present in fullEventOrder in case they were undo'd by the operator.

        let existingEventIds = Set(lot.eventIDs)
        let newEvents = lotEvents.filter { existingEventIds.contains($0["eventId"] as? String ?? "") == false }
        lot.addEvents( newEvents.map { LiveEvent(JSON: $0) } )
    }

    func updateCurrentLotWithIDIfNecessary(newCurrentLotID: LotID?) {
        guard let newCurrentLotID = newCurrentLotID else { return }
        guard newCurrentLotID != _currentLotID ?? "" else { return }

        guard let newCurrentViewModel = saleArtworks.filter({ $0.lotID == newCurrentLotID }).first else { return }

        self._currentLotSignal.update(newCurrentViewModel)
        _currentLotID = newCurrentLotID
    }
}


private extension LiveSale {
    func needsUpdateToInstanceFromSale(otherSale: LiveSale) -> Bool {
        guard self.startDate == otherSale.startDate else { return true }
        guard self.endDate == otherSale.endDate else { return true }
        return false
    }
}
