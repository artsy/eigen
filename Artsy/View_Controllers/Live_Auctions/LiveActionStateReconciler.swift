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

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> { get }
}

class LiveAuctionStateReconciler: NSObject {
    typealias LotID = String

    let saleArtworks: [LiveAuctionLotViewModel]

    init(saleArtworks: [LiveAuctionLotViewModel]) {
        self.saleArtworks = saleArtworks
        super.init()
    }

    private let _currentLotSignal = Observable<LiveAuctionLotViewModel>()
    private var _currentLotID: String?

    private var _state = [LiveAuctionLotViewModel]()
}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions: LiveAuctionStateReconcilerType {

    func updateState(state: AnyObject) {
        // TODO: how to handle changes to start/end times? Necessary at all?

        guard let fullLotStateById = state["fullLotStateById"] as? ObjectJSON else { return }
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

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return _currentLotSignal.map { $0 as LiveAuctionLotViewModelType }
    }
}


private typealias PrivateFunctions = LiveAuctionStateReconciler
private extension PrivateFunctions {
    typealias ObjectJSON = [String: [String: AnyObject]]
    typealias NewEventIDs = Set<String>

    func updateLotDerivedState(lot: LiveAuctionLotViewModel, derivedState: [String: AnyObject]) {
        guard let reserveStatusString = derivedState["reserveStatus"] as? String else { return }
        guard let askingPrice = derivedState["onlineAskingPriceCents"] as? UInt64 else { return }

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

        let newCurrentViewModel = _state.filter { $0.lotId == newCurrentLotID }.first

        if let newCurrentViewModel = newCurrentViewModel {
            self._currentLotSignal.update(newCurrentViewModel)
            _currentLotID = newCurrentLotID
        }
    }
}


private extension LiveSale {
    func needsUpdateToInstanceFromSale(otherSale: LiveSale) -> Bool {
        guard self.startDate == otherSale.startDate else { return true }
        guard self.endDate == otherSale.endDate else { return true }
        return false
    }
}
