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

typealias LotEventJSON = [[String: AnyObject]]

protocol LiveAuctionStateReconcilerType {
    func updateState(_ state: AnyObject)
    func processLotEventBroadcast(_ broadcast: AnyObject)
    func processCurrentLotUpdate(_ update: AnyObject)

    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> { get }
    var debugAllEventsSignal: Observable<LotEventJSON> { get }
}

class LiveAuctionStateReconciler: NSObject {
    typealias LotID = String

    fileprivate let saleArtworks: [LiveAuctionLotViewModel]

    init(saleArtworks: [LiveAuctionLotViewModel]) {
        self.saleArtworks = saleArtworks
        super.init()
    }

    fileprivate let _currentLotSignal = Observable<LiveAuctionLotViewModel?>(nil)
    fileprivate let _debugAllEventsSignal = Observable<LotEventJSON>(options: [])

    fileprivate var _currentLotID: String?
}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions: LiveAuctionStateReconcilerType {

    func updateState(_ state: AnyObject) {
        // TODO: how to handle changes to start/end times? Necessary at all?

        guard let fullLotStateById = state["fullLotStateById"] as? [String: [String: AnyObject]] else { return }
        let currentLotID = state["currentLotId"] as? String

        for lot in saleArtworks {
            // TODO: How should we handle failed parsing? Not silently, that's for sure!
            guard let json = fullLotStateById[lot.liveAuctionLotID] else { continue }
            guard let derivedLotState = json["derivedLotState"] as? [String: AnyObject] else { continue }
            guard let eventHistory = json["eventHistory"] as? [[String: AnyObject]] else { continue } // TODO move to events

            updateUserSpecificLotState(lot, derivedState: derivedLotState)
            updateLotWithEvents(lot, lotEvents: eventHistory)
            updateLotDerivedState(lot, derivedState: derivedLotState)
        }

        // TODO: This is always nil for some reason, but regardless, the UI looks terrible if it is nil. It will be nil sometimes in production, so we should operate without it!
        updateCurrentLotWithIDIfNecessary(currentLotID)
    }

    func processLotEventBroadcast(_ broadcast: AnyObject) {

        guard let
            json = broadcast as? [String: AnyObject],
            let events = json["events"] as? [String: [String: AnyObject]],
            let lotID = events.values.first?["lotId"] as? String,
            let lot = saleArtworks.filter({ $0.lotID == lotID }).first,
            let derivedLotState = json["derivedLotState"] as? [String: AnyObject],
            let fullEventOrder = json["fullEventOrder"] as? [String] else { return }

        updateUserSpecificLotState(lot, derivedState: derivedLotState)
        updateLotWithEvents(lot, lotEvents: Array(events.values), fullEventOrder: fullEventOrder)
        updateLotDerivedState(lot, derivedState: derivedLotState)
    }

    func processCurrentLotUpdate(_ update: AnyObject) {
        let currentLotID = update["lotId"] as? String
        updateCurrentLotWithIDIfNecessary(currentLotID)
    }

    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> {
        return _currentLotSignal.map { $0 as LiveAuctionLotViewModelType? }
    }

    var debugAllEventsSignal: Observable<LotEventJSON> {
        return _debugAllEventsSignal
    }
}


private typealias PrivateFunctions = LiveAuctionStateReconciler
private extension PrivateFunctions {

    func updateUserSpecificLotState(_ lot: LiveAuctionLotViewModel, derivedState: [String: AnyObject]) {

        let winningBidEventID = derivedState["winningBidEventId"] as? String
        lot.updateWinningBidEventID(winningBidEventID)

        let floorWinningBidder = derivedState["floorWinningBidder"] as? [String: AnyObject]
        let floorWinningBidderID = floorWinningBidder?["bidderId"] as? String
        lot.updateFloorWinningBidderID(floorWinningBidderID)

        let bidder = derivedState["sellingToBidder"] as? [String: AnyObject]
        let bidderID = bidder?["bidderId"] as? String
        lot.updateSellingToBidder(bidderID)
    }

    func updateLotDerivedState(_ lot: LiveAuctionLotViewModel, derivedState: [String: AnyObject]) {

        if let reserveStatusString = derivedState["reserveStatus"] as? String {
            lot.updateReserveStatus(reserveStatusString)
        }

        // OK, this looks weird. Let's unpack.
        // derivedState["askingPriceCents"] is an AnyObject?, and casting it conditionally to a UInt64 always fails.
        // Instead, we'll use the UInt64(_ text: String) initialzer, which means we need to unwrap the AnyObject? and
        // then stick it in a string so it's not "Optional(23000)", then initialize the UInt64
        if let extractedAskingPrice = derivedState["askingPriceCents"],
           let askingPrice = UInt64("\(extractedAskingPrice)") {
            lot.updateOnlineAskingPrice(askingPrice)
        }

        if let biddingStatus = derivedState["biddingStatus"] as? String {
            let soldStatus = derivedState["soldStatus"] as? String
            let passed = soldStatus == "Passed"

            lot.updateBiddingStatus(biddingStatus, wasPassed: passed)
        }

        if let onlineBidCount = derivedState["onlineBidCount"] as? Int {
            lot.updateOnlineBidCount(onlineBidCount)
        }
    }

    func updateLotWithEvents(_ lot: LiveAuctionLotViewModel, lotEvents: [[String: AnyObject]], fullEventOrder: [String]? = nil) {
        // TODO: fullEventOrder, if specified, yields the _exact_ history and order of events. We need to remove any local events not present in fullEventOrder in case they were undo'd by the operator.

        let existingEventIds = Set(lot.eventIDs)
        let newEvents = lotEvents.filter { existingEventIds.contains($0["eventId"] as? String ?? "") == false }

        if ARDeveloperOptions.keyExists("log_live_events" as NSCopying) {
            for event in newEvents {
                print("Event: \(event)\n\n")
            }
        }
        _debugAllEventsSignal.update(newEvents)

        // TODO: is this a good idea? This will remove events we don't know yet
        let events = newEvents.compactMap { LiveEvent(json: $0) }
        lot.addEvents(events)
    }

    func updateCurrentLotWithIDIfNecessary(_ newCurrentLotID: LotID?) {
        guard let newCurrentLotID = newCurrentLotID else {
            return _currentLotSignal.update(nil)
        }
        guard newCurrentLotID != _currentLotID ?? "" else { return }

        guard let newCurrentViewModel = saleArtworks.filter({ $0.lotID == newCurrentLotID }).first else { return }

        self._currentLotSignal.update(newCurrentViewModel)
        _currentLotID = newCurrentLotID
    }
}


private extension LiveSale {
    func needsUpdateToInstanceFromSale(_ otherSale: LiveSale) -> Bool {
        guard self.startDate == otherSale.startDate else { return true }
        guard self.saleState == otherSale.saleState else { return true }
        return false
    }
}
