import Foundation
import Interstellar
import SwiftyJSON

/*
Independent of sockets:
- time elapsed

Based on socket events:
- lot state (bidding not yet, bidding open, bidding closed)
- reserve status
- # of bids
- # of watchers
- next bid amount $
- bid history
- bid request (command) success/failure
*/

class LiveAuctionStateManager: NSObject {
    typealias SocketCommunicatorCreator = (_ host: String, _ causalitySaleID: String, _ jwt: JWT) -> LiveAuctionSocketCommunicatorType
    typealias StateReconcilerCreator = (_ saleArtworks: [LiveAuctionLotViewModel]) -> LiveAuctionStateReconcilerType

    let sale: LiveSale
    let bidderCredentials: BiddingCredentials
    let operatorConnectedSignal = Observable<Bool>()
    let saleOnHoldSignal = Observable<(isOnHold: Bool, message: String?)>()
    let initialStateLoadedSignal = Observable<Void>(options: .Once)

    fileprivate let socketCommunicator: LiveAuctionSocketCommunicatorType
    fileprivate let stateReconciler: LiveAuctionStateReconcilerType
    fileprivate var biddingStates = [String: LiveAuctionBiddingViewModelType]()

    var socketConnectionSignal: Observable<Bool> {
        return socketCommunicator.socketConnectionSignal
    }

    init(host: String,
         sale: LiveSale,
         saleArtworks: [LiveAuctionLotViewModel],
         jwt: JWT,
         bidderCredentials: BiddingCredentials,
         socketCommunicatorCreator: SocketCommunicatorCreator = LiveAuctionStateManager.defaultSocketCommunicatorCreator(),
         stateReconcilerCreator: StateReconcilerCreator = LiveAuctionStateManager.defaultStateReconcilerCreator()) {

        self.sale = sale
        self.bidderCredentials = bidderCredentials
        self.socketCommunicator = socketCommunicatorCreator(host, sale.causalitySaleID, jwt)
        self.stateReconciler = stateReconcilerCreator(saleArtworks)

        super.init()

        socketCommunicator.updatedAuctionState.subscribe { [weak self] state in
            self?.stateReconciler.updateState(state)
            self?.handleOperatorConnectedState(state)
            self?.handleSaleOnHoldInitialState(state)
            self?.initialStateLoadedSignal.update(())
        }

        socketCommunicator.lotUpdateBroadcasts.subscribe { [weak self] broadcast in
            self?.stateReconciler.processLotEventBroadcast(broadcast)
        }

        socketCommunicator.currentLotUpdate.subscribe { [weak self] update in
            self?.stateReconciler.processCurrentLotUpdate(update)
        }

        socketCommunicator.postEventResponses.subscribe { [weak self] response in

            let json = JSON(response)
            let bidUUID = json["key"].stringValue
            let biddingViewModel = self?.biddingStates.removeValue(forKey: bidUUID)
//            So far this event isn 't needed anywhere, but keeping for prosperities sake
//            let eventJSON = json["event"].dictionaryObject
//            let liveEvent = LiveEvent(JSON: eventJSON)
            let confirmed: LiveAuctionBiddingProgressState
            let responseType = json["type"].stringValue
            if responseType == "CommandFailed" {
                let reason = json["reason"]["type"].string
                let userFacingError: String
                if reason != nil {
                    userFacingError = reason!
                } else {
                     userFacingError = "An unknown error occurred"
                }
                confirmed = LiveAuctionBiddingProgressState.bidFailed(reason: userFacingError)
            } else {
                confirmed = LiveAuctionBiddingProgressState.bidAcknowledged
            }


            biddingViewModel?.bidPendingSignal.update(confirmed)
        }

        socketCommunicator.saleOnHoldSignal.subscribe { [weak self] response in
            self?.handleSaleOnHoldState(response) 
        }

        socketCommunicator.operatorConnectedSignal.subscribe { [weak self] state in
            self?.handleOperatorConnectedState(state)
        }
    }
}

private typealias PublicFunctions = LiveAuctionStateManager
extension PublicFunctions {

    func bidOnLot(_ lotID: String, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        if !bidderCredentials.canBid {
            return print("Tried to bid without a bidder ID on account")
        }

        biddingViewModel.bidPendingSignal.update(.biddingInProgress)

        let bidID = UUID().uuidString
        biddingStates[bidID] = biddingViewModel
        socketCommunicator.bidOnLot(lotID, amountCents: amountCents, bidderCredentials: bidderCredentials, bidUUID: bidID)
    }

    func leaveMaxBidOnLot(_ lotID: String, amountCents: UInt64, biddingViewModel: LiveAuctionBiddingViewModelType) {
        if !bidderCredentials.canBid {
            return print("Tried to leave a max bid without a bidder ID on account")
        }

        biddingViewModel.bidPendingSignal.update(.biddingInProgress)
        let bidID = UUID().uuidString
        biddingStates[bidID] = biddingViewModel
        socketCommunicator.leaveMaxBidOnLot(lotID, amountCents: amountCents, bidderCredentials: bidderCredentials, bidUUID: bidID)
    }

    var debugAllEventsSignal: Observable<LotEventJSON> {
        return stateReconciler.debugAllEventsSignal
    }
}

private typealias ComputedProperties = LiveAuctionStateManager
extension ComputedProperties {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType?> {
        return stateReconciler.currentLotSignal
    }
}

private typealias PrivateFunctions = LiveAuctionStateManager
private extension PrivateFunctions {
    func handleOperatorConnectedState(_ state: AnyObject) {
        let json = JSON(state)
        let operatorConnected = json["operatorConnected"].bool ?? true // Defaulting to true in case the value isn't specified, we don't want to obstruct the user.
        self.operatorConnectedSignal.update(operatorConnected)
    }

    func handleSaleOnHoldState(_ state: AnyObject) {
        let json = JSON(state)
        let saleOnHold = json["isOnHold"].boolValue
        let message = json["userMessage"].string
        saleOnHoldSignal.update((isOnHold: saleOnHold, message: message))
    }
    func handleSaleOnHoldInitialState(_ state: AnyObject) {
        let json = JSON(state)
        let saleOnHold = json["saleOnHold"].boolValue
        let message = json["saleOnHoldMessage"].string
        saleOnHoldSignal.update((isOnHold: saleOnHold, message: message))
    }
}


private typealias DefaultCreators = LiveAuctionStateManager
extension DefaultCreators {
    class func defaultSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, causalitySaleID, jwt in
            return LiveAuctionSocketCommunicator(host: host, causalitySaleID: causalitySaleID, jwt: jwt)
        }
    }

    class func stubbedSocketCommunicatorCreator() -> SocketCommunicatorCreator {
        return { host, causalitySaleID, jwt in
            return Stubbed_SocketCommunicator(state: loadJSON("live_auctions_socket"))
        }
    }

    class func defaultStateReconcilerCreator() -> StateReconcilerCreator {
        return { saleArtworks in
            return LiveAuctionStateReconciler(saleArtworks: saleArtworks)
        }
    }
}

private class Stubbed_SocketCommunicator: LiveAuctionSocketCommunicatorType {
    let updatedAuctionState: Observable<AnyObject>
    let lotUpdateBroadcasts = Observable<AnyObject>()
    let currentLotUpdate = Observable<AnyObject>()
    let postEventResponses = Observable<AnyObject>()
    let socketConnectionSignal = Observable<Bool>(true) // We're conencted by default.
    let operatorConnectedSignal = Observable<AnyObject>()
    let saleOnHoldSignal = Observable<AnyObject>()

    init (state: AnyObject) {
        updatedAuctionState = Observable(state)
    }

    func bidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {

    }

    func leaveMaxBidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {

    }

}
