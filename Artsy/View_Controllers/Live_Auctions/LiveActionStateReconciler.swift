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
    var newLotsSignal: Observable<[LiveAuctionLotViewModelType]> { get }
    var currentLotSignal: Observable<LiveAuctionLotViewModelType> { get }
    var saleSignal: Observable<LiveAuctionViewModelType> { get }
}

class LiveAuctionStateReconciler: NSObject {
    typealias LotID = String

    // Updated when initial lots are ready, and if at any point we need to replace the lots completely (very rare, only if a lot is added/removed from sale).
    let newLotsSignal = Observable<[LiveAuctionLotViewModelType]>()

    private let _currentLotSignal = Observable<LiveAuctionLotViewModel>()
    private var _currentLotID: String?
    private let _saleSignal = Observable<LiveAuctionViewModel>()

    private var _state = [LotID: LiveAuctionLotViewModel]()
    private var _sale: LiveAuctionViewModel?
}


private typealias PublicFunctions = LiveAuctionStateReconciler
extension PublicFunctions: LiveAuctionStateReconcilerType {

    func updateState(state: AnyObject) {
        // TODO: don't fail silently on bad input
        guard let lotsJSON = state["lots"] as? ObjectJSON else { return }
        guard let saleJSON = state["sale"] as? [String: AnyObject] else { return }
        guard let orderedLotIDs = saleJSON["lots"] as? [String] else { return }
        guard let currentLotID = state["currentLotId"] as? String else { return }
        guard let eventsJSON = state["lotEvents"] as? ObjectJSON  else { return }

        // Convert the ordered lot IDs into an ordered list of lots in JSON form.
        let sortedLotsJSON = orderedLotIDs.flatMap { lotID in
            return lotsJSON[lotID]
        }

        let replacedLots = createOrUpdateLots(sortedLotsJSON, sortedLotIDs: orderedLotIDs)
        updateLotsWithEvents(eventsJSON, sortedLotsJSON: sortedLotsJSON, sortedLotIDs: orderedLotIDs)
        updateCurrentLots(replacedLots, sortedLotsIDs: orderedLotIDs)
        updateCurrentLotWithIDIfNecessary(currentLotID)
        updateSaleIfNecessary(saleJSON)
    }

    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return _currentLotSignal.map { $0 as LiveAuctionLotViewModelType }
    }
    
    var saleSignal: Observable<LiveAuctionViewModelType> {
        return _saleSignal.map { $0 as LiveAuctionViewModelType }
    }

}


private typealias PrivateFunctions = LiveAuctionStateReconciler
private extension PrivateFunctions {
    typealias ObjectJSON = [String: [String: AnyObject]]
    typealias NewEventIDs = Set<String>

    /// Returns true iff we've had to replace all lots.
    func createOrUpdateLots(sortedLotsJSON: [[String: AnyObject]], sortedLotIDs: [LotID]) -> Bool {
        let replaced: Bool
        let sortedLotViewModels = sortedLotViewModelsFromLotIDs(sortedLotIDs)

        // If we have same lot counts, we can do a linear scan to update; otherwise, we replace.
        if sortedLotsJSON.count == sortedLotViewModels.count {
            // Loop through our json and in-memory models pairwise, updating the reserve status and asking price.
            replaced = false

            for (json, lotViewModel) in zip(sortedLotsJSON, sortedLotViewModels) {
                guard let reserveStatusString = json["reserveStatus"] as? String else { continue }
                guard let askingPrice = json["onlineAskingPriceCents"] as? NSNumber else { continue }

                lotViewModel.updateReserveStatus(reserveStatusString)
                lotViewModel.updateOnlineAskingPrice(askingPrice.unsignedLongLongValue)
            }

        } else {
            replaced = true
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

        return replaced
    }

    func updateLotsWithEvents(lotEvents: ObjectJSON, sortedLotsJSON: [[String: AnyObject]], sortedLotIDs: [LotID]) {

        let sortedLotViewModels = sortedLotViewModelsFromLotIDs(sortedLotIDs)

        zip(sortedLotsJSON, sortedLotViewModels).forEach { (lotJSON, viewModel) in
            let jsonEventIDs = lotJSON["events"] as? [String] ?? []
            let newEventIDs = jsonEventIDs.subarrayFromFirstDifference(viewModel.eventIDs)

            let newEvents = newEventIDs
                .flatMap { eventID in
                    return lotEvents[eventID]
                }
                .flatMap { eventJSON in
                    return LiveEvent(JSON: eventJSON)
                }

            viewModel.addEvents(newEvents)
        }

    }

    func updateCurrentLots(replaced: Bool, sortedLotsIDs: [String]) {
        guard replaced else { return }

        let sortedLots = sortedLotsIDs.flatMap { lotID in
            return _state[lotID] as? LiveAuctionLotViewModelType
        }

        newLotsSignal.update(sortedLots)
    }

    func updateCurrentLotWithIDIfNecessary(newCurrentLotID: LotID) {
        guard newCurrentLotID != _currentLotID ?? "" else { return }

        if let currentLotViewModel = _state[newCurrentLotID] {
            self._currentLotSignal.update(currentLotViewModel)
            _currentLotID = newCurrentLotID
        }
    }

    func updateSaleIfNecessary(saleJSON: [String: AnyObject]) {
        let newSale = LiveSale(JSON: saleJSON)
        let currentLotID = saleJSON["currentLotId"] as? String

        // The first time we get a sale, we need to create a view model.
        guard let oldSale = _sale else {
            let saleViewModel = LiveAuctionViewModel(sale: newSale, currentLotID: currentLotID)
            self._sale = saleViewModel
            self._saleSignal.update(saleViewModel)
            return
        }

        oldSale.updateWithNewSale(newSale, currentLotID: currentLotID)
    }

    func sortedLotViewModelsFromLotIDs(lotIDs: [LotID]) -> [LiveAuctionLotViewModel] {
        return lotIDs.flatMap { lotID in
            return _state[lotID]
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
