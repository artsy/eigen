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
    func processNewEvents(events: AnyObject)

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
            guard let json = fullLotStateById[lot.liveAuctionLotID] else { continue }
            guard let derivedLotState = json["derivedLotState"] as? [String: AnyObject] else { continue }
            guard let eventHistory = json["eventHistory"] as? [[String: AnyObject]] else { continue }

            updateLotDerivedState(lot, derivedState: derivedLotState)
            updateLotWithEvents(lot, lotEvents: eventHistory)
        }

        updateCurrentLotWithIDIfNecessary(currentLotID)
    }

    func processNewEvents(events: AnyObject) {
        print(events)

        // TODO
    }

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return _currentLotSignal.map { $0 as LiveAuctionLotViewModelType }
    }
}


private typealias PrivateFunctions = LiveAuctionStateReconciler
private extension PrivateFunctions {
    typealias NewEventIDs = Set<String>

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


    func updateLotWithEvents(lot: LiveAuctionLotViewModel, lotEvents: [[String: AnyObject]]) {
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
