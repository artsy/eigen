import Foundation
import Interstellar

// Represents a single lot view

enum LotState {
    case UpcomingLot
    case LiveLot
    case ClosedLot
}

typealias CurrentBid = (bid: String, reserve: String?)

protocol LiveAuctionLotViewModelType: class {

    var numberOfDerivedEvents: Int { get }
    func derivedEventAtPresentationIndex(index: Int) -> LiveAuctionEventViewModel

    var lotArtist: String { get }
    var lotArtistBlurb: String? { get }
    var lotArtworkDescription: String? { get }
    var lotArtworkMedium: String? { get }
    var lotArtworkDimensions: String? { get }

    var estimateString: String { get }
    var lotName: String { get }
    var lotID: String { get }
    var lotArtworkCreationDate: String? { get }
    var urlForThumbnail: NSURL { get }
    var urlForProfile: NSURL { get }
    var lotIndex: Int { get }
    var currentLotValue: UInt64 { get }
    var currentLotValueString: String { get }
    var currencySymbol: String { get }
    var numberOfBids: Int { get }
    var imageAspectRatio: CGFloat { get }
    var liveAuctionLotID: String { get }
    var reserveStatusString: String { get }
    var dateLotOpened: NSDate? { get }

    var userIsHighestBidder: Bool { get }

    var reserveStatusSignal: Observable<ARReserveStatus> { get }
    var lotStateSignal: Observable<LotState> { get }
    var askingPriceSignal: Observable<UInt64> { get }
    var currentBidSignal: Observable<CurrentBid> { get }
    var newEventsSignal: Observable<[LiveAuctionEventViewModel]> { get }
}

extension LiveAuctionLotViewModelType {
    var lotIndexDisplayString: String {
        return "Lot \(lotIndex + 1)"
    }

    var currentBidSignal: Observable<CurrentBid> {
        let currencySymbol = self.currencySymbol
        return askingPriceSignal.merge(reserveStatusSignal).map { (askingPrice, reserveStatus) -> CurrentBid in
            let reserveString: String?

            switch reserveStatus {
            case .NoReserve: reserveString = nil
            case .ReserveMet: reserveString = "(Reserve met)"
            case .ReserveNotMet: reserveString = "(Reserve not met)"
            }

            return (
                bid: "Current Bid: \(askingPrice.convertToDollarString(currencySymbol))",
                reserve: reserveString
            )
        }
    }
}

class LiveAuctionLotViewModel: NSObject, LiveAuctionLotViewModelType {

    private let model: LiveAuctionLot
    private let bidderID: String?

    // This is the full event stream
    private var fullEventList = [LiveAuctionEventViewModel]()

    // This is the event stream once undos, and composite bids have
    // done their work on the events
    private var derivedEvents = [LiveAuctionEventViewModel]()

    private let biddingStatusSignal = Observable<ARLiveBiddingStatus>()

    let reserveStatusSignal = Observable<ARReserveStatus>()
    let lotStateSignal: Observable<LotState>
    let askingPriceSignal = Observable<UInt64>()

    let newEventsSignal = Observable<[LiveAuctionEventViewModel]>()

    init(lot: LiveAuctionLot, bidderID: String?) {
        self.model = lot
        self.bidderID = bidderID

        reserveStatusSignal.update(lot.reserveStatus)
        askingPriceSignal.update(lot.askingPriceCents)

        lotStateSignal = biddingStatusSignal.map { biddingStatus -> LotState in
            switch biddingStatus {
            case .Upcoming: fallthrough // Case that sale is not yet open
            case .Open:                 // Case that lot is open to leave max bids
                return .UpcomingLot
            case .OnBlock:              // Currently on the block
                return .LiveLot
            case .Complete:             // Closed
                return .ClosedLot
            }
        }
    }

    var lotArtworkDescription: String? {
        return model.artwork.blurb
    }

    var lotArtworkMedium: String? {
        return model.artwork.medium
    }

    var lotArtworkDimensions: String? {
        return model.artwork.dimensionsCM
    }

    var numberOfBids: Int {
        return fullEventList.filter { $0.isBid }.count
    }

    var urlForThumbnail: NSURL {
        return model.urlForThumbnail()
    }

    var urlForProfile: NSURL {
        return model.urlForProfile()
    }

    var imageAspectRatio: CGFloat {
        return model.imageAspectRatio() ?? 1
    }

    var lotName: String {
        return model.artworkTitle
    }

    var lotID: String {
        return model.liveAuctionLotID
    }

    var lotArtworkCreationDate: String? {
        return model.artworkDate
    }

    var lotArtist: String {
        return model.artistName
    }

    var lotArtistBlurb: String? {
        return model.artistBlurb
    }

    var lotIndex: Int {
        return model.position - 1
    }

    var liveAuctionLotID: String {
        return model.liveAuctionLotID
    }

    var currentLotValue: UInt64 {
        // TODO: is askingPriceCents correct? not sure from JSON
        //       maybe we need to look through the events for the last bid?
        return LiveAuctionBidViewModel.nextBidCents(model.askingPriceCents)
    }

    var topBidEvent: LiveAuctionEventViewModel? {
        return fullEventList.filter({ $0.isBid }).last
    }

    var userIsHighestBidder: Bool {
        guard let bidderID = bidderID else { return false }
        guard let top = topBidEvent else { return false }
        return top.hasBidderID(bidderID)
    }

    func findBidWithValue(amountCents: UInt64) -> LiveAuctionEventViewModel? {
        return fullEventList.filter({ $0.isBid && $0.hasAmountCents(amountCents) }).first
    }

    // Want to avoid array searching + string->date processing every in timer loops
    // so pre-cache createdAt when found.
    private var _dateLotOpened: NSDate?

    var dateLotOpened: NSDate? {
        guard _dateLotOpened == nil else { return _dateLotOpened }
        guard let opening = fullEventList.filter({ $0.isLotOpening }).first else { return nil }
        _dateLotOpened = opening.dateEventCreated
        return _dateLotOpened
    }

    var currentLotValueString: String {
        return currentLotValue.convertToDollarString(model.currencySymbol)
    }

    var currencySymbol: String {
        return model.currencySymbol
    }

    var estimateString: String {
        return model.estimate
    }

    var eventIDs: [String] {
        return model.eventIDs
    }

    func eventWithID(string: String) -> LiveAuctionEventViewModel? {
        return fullEventList.filter { $0.event.eventID == string }.first
    }

    var numberOfDerivedEvents: Int {
        return derivedEvents.count
    }

    func derivedEventAtPresentationIndex(index: Int) -> LiveAuctionEventViewModel {
        // Events are ordered FIFO, need to inverse for presentation
        return derivedEvents[numberOfDerivedEvents - index - 1]
    }

    var reserveStatusString: String {
        guard let status = reserveStatusSignal.peek() else {
            return "unknown reserve"
        }

        switch status {
        case .NoReserve:
            return "no reserve"
        case .ReserveMet:
            return "reserve met"
        case .ReserveNotMet:
            return "reserve not yet met"
        }
    }

    func updateReserveStatus(reserveStatusString: String) {
        let updated = model.updateReserveStatusWithString(reserveStatusString)

        if updated {
            reserveStatusSignal.update(model.reserveStatus)
        }
    }

    func updateOnlineAskingPrice(askingPrice: UInt64) {
        let updated = model.updateOnlineAskingPrice(askingPrice)

        if updated {
            askingPriceSignal.update(askingPrice)
        }
    }

    func updateBiddingStatus(biddingStatus: String) {
        let updated = model.updateBiddingStatusWithString(biddingStatus)

        if updated {
            biddingStatusSignal.update(model.biddingStatus)
        }
    }

    func addEvents(newEvents: [LiveEvent]) {

        model.addEvents(newEvents.map { $0.eventID })
        let newEventViewModels = newEvents.map { LiveAuctionEventViewModel(event: $0, currencySymbol: model.currencySymbol) }

        fullEventList += newEventViewModels

        updateExistingEventsWithLotState(fullEventList)
        derivedEvents = fullEventList.filter { $0.isUserFacing }

        let newDerivedEvents = newEventViewModels.filter { $0.isUserFacing }
        newEventsSignal.update(newDerivedEvents)
    }


    /// This isn't really very efficient, lots of loops to do lookups, maybe n^n?

    private func updateExistingEventsWithLotState(events: [LiveAuctionEventViewModel]) {
        // Undoes need applying
        for undoEvent in events.filter({ $0.isUndo }) {
            guard let
                referenceEventID = undoEvent.undoLiveEventID,
                eventToUndo = eventWithID(referenceEventID) else { continue }
            eventToUndo.cancel()
        }

        /// Setup Pending
        for bidEvent in events.filter({ $0.isBidConfirmation }) {
            guard let
                amount = bidEvent.bidAmount,
                eventToConfirm = findBidWithValue(amount) else { continue }
            eventToConfirm.confirm()
        }

        /// Setup bidStatus, so an EventVM knows if it's top/owner by the user etc
        let topBid = topBidEvent
        for bidEvent in events.filter({ $0.isBid }) {

            let isTopBid = (bidEvent == topBid)
            let isUser: Bool
            if let bidderID = bidderID {
                isUser = bidEvent.hasBidderID(bidderID)
            } else {
                isUser = false
            }

            let status: BidEventBidStatus
            if bidEvent.isFloorBidder {
                status = .Bid(isMine: isUser, isTop: isTopBid)

            } else if bidEvent.isArtsyBidder && bidEvent.event.confirmed {
                status = .Bid(isMine: isUser, isTop: isTopBid)

            } else {
                status = .PendingBid(isMine: isUser)
            }
            bidEvent.bidStatus = status
        }

    }
}
