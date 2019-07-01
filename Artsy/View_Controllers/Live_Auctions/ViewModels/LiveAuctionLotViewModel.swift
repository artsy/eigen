import Foundation
import Interstellar

// Represents a single lot view

enum LotState {
    case upcomingLot(isHighestBidder: Bool)
    case liveLot
    case closedLot(wasPassed: Bool)
}

func == (lhs: LotState, rhs: LotState) -> Bool {
    switch (lhs, rhs) {
    case (.upcomingLot, .upcomingLot): return true
    case (.liveLot, .liveLot): return true
    case let (.closedLot(lhsClosed), .closedLot(rhsClosed)) where lhsClosed == rhsClosed: return true
    default: return false
    }
}

typealias CurrentBid = (bid: String, reserve: String?)

protocol LiveAuctionLotViewModelType: class {

    var numberOfDerivedEvents: Int { get }
    func derivedEventAtPresentationIndex(_ index: Int) -> LiveAuctionEventViewModel

    var lotArtist: String { get }
    var lotArtistBlurb: String? { get }
    var lotArtworkDescription: String? { get }
    var lotArtworkMedium: String? { get }
    var lotArtworkDimensions: String? { get }

    var estimateString: String? { get }
    var highEstimateOrEstimateCents: UInt64? { get }
    var lotName: String { get }
    var lotID: String { get }
    var lotLabel: String? { get }
    var lotEditionInfo: String? { get }
    var lotArtworkCreationDate: String? { get }
    var urlForThumbnail: URL? { get }
    var urlForProfile: URL? { get }
    var askingPrice: UInt64 { get }
    var winningBidPrice: UInt64? { get }
    var currencySymbol: String { get }
    var numberOfBids: Int { get }
    var imageAspectRatio: CGFloat { get }
    var liveAuctionLotID: String { get }
    var reserveStatusString: String { get }
    var dateLotOpened: Date? { get }

    var userIsBeingSoldTo: Bool { get }
    var isBeingSold: Bool { get }
    var userIsWinning: Bool { get }
    var userIsFloorWinningBidder: Bool { get }
    var usersTopBidCents: UInt64? { get }

    var reserveStatusSignal: Observable<ARReserveStatus> { get }
    var lotStateSignal: Observable<LotState> { get }
    var askingPriceSignal: Observable<UInt64> { get }
    var numberOfBidsSignal: Observable<Int> { get }
    var currentBidSignal: Observable<CurrentBid> { get }
    var newEventsSignal: Observable<[LiveAuctionEventViewModel]> { get }
}

extension LiveAuctionLotViewModelType {

    var formattedLotIndexDisplayString: String {
        guard let lotLabel = lotLabel else { return "" }
        return "Lot \(lotLabel)"
    }

    var currentBidSignal: Observable<CurrentBid> {
        let currencySymbol = self.currencySymbol
        return askingPriceSignal.merge(reserveStatusSignal).map { (askingPrice, reserveStatus) -> CurrentBid in
            let reserveString: String?

            switch reserveStatus {
            case .unknown: fallthrough
            case .noReserve: reserveString = nil
            case .reserveMet: reserveString = "(Reserve met)"
            case .reserveNotMet: reserveString = "(Reserve not met)"
            }

            return (
                bid: "Current Ask: \(askingPrice.convertToDollarString(currencySymbol))",
                reserve: reserveString
            )
        }
    }
}

class LiveAuctionLotViewModel: NSObject, LiveAuctionLotViewModelType {

    fileprivate let model: LiveAuctionLot
    fileprivate let bidderCredentials: BiddingCredentials

    // This is the full event stream
    fileprivate var fullEventList = [LiveAuctionEventViewModel]()

    // This is the event stream once undos, and composite bids have
    // done their work on the events
    fileprivate var derivedEvents = [LiveAuctionEventViewModel]()

    fileprivate typealias BiddingStatus = (status: ARLiveBiddingStatus, wasPassed: Bool, isHighestBidder: Bool)
    fileprivate let biddingStatusSignal = Observable<BiddingStatus>()

    fileprivate var soldStatus: String?

    let reserveStatusSignal = Observable<ARReserveStatus>()
    let lotStateSignal: Observable<LotState>
    let askingPriceSignal = Observable<UInt64>()
    let numberOfBidsSignal = Observable<Int>()

    let newEventsSignal = Observable<[LiveAuctionEventViewModel]>()

    var sellingToBidderID: String? = nil
    var winningBidEventID: String? = nil
    /// So you can differentiate whether your bid has been confirmed
    /// by the floor or not
    var floorWinningBidderID: String? = nil

    /// The value of the highest bid the user has placed on this lot
    var userTopBidCents: UInt64? = nil

    /// Used to format dimensions as inches or centimeters. Do no modify this except under unit tests
    var usersLocale = NSLocale.autoupdatingCurrent

    init(lot: LiveAuctionLot, bidderCredentials: BiddingCredentials) {
        self.model = lot
        self.bidderCredentials = bidderCredentials

        reserveStatusSignal.update(lot.reserveStatus)
        askingPriceSignal.update(lot.askingPriceCents)

        lotStateSignal = biddingStatusSignal.map { (biddingStatus, passed, isHighestBidder) -> LotState in
            switch biddingStatus {
            case .upcoming: fallthrough // Case that sale is not yet open
            case .open:                 // Case that lot is open to leave max bids
                return .upcomingLot(isHighestBidder: isHighestBidder)
            case .onBlock:              // Currently on the block
                return .liveLot
            case .complete:             // Closed
                return .closedLot(wasPassed: passed)
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
        if self.usersLocale.usesMetricSystem {
            // TODO: Test this!
            return model.artwork.dimensionsCM
        } else {
            return model.artwork.dimensionsInches
        }
    }

    var lotLabel: String? {
        return model.lotLabel as String?
    }

    var lotEditionInfo: String? {
        return model.artwork.editionOf
    }

    var winningBidPrice: UInt64? {
        return self.winningBidEvent?.bidAmountCents
    }

    var usersTopBidCents: UInt64? {
        return userTopBidCents
    }

    var askingPrice: UInt64 {
        return model.askingPriceCents
    }

    var numberOfBids: Int {
        return model.onlineBidCount
    }

    var urlForThumbnail: URL? {
        return model.urlForThumbnail()
    }

    var urlForProfile: URL? {
        return model.urlForProfile()
    }

    var imageAspectRatio: CGFloat {
        return model.imageAspectRatio()
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

    var liveAuctionLotID: String {
        return model.liveAuctionLotID
    }

    var winningBidEvent: LiveAuctionEventViewModel? {
        return fullEventList.filter({ $0.eventID == winningBidEventID }).last
    }

    var isBeingSold: Bool {
        return sellingToBidderID != nil
    }

    var userIsBeingSoldTo: Bool {
        guard let
            bidderID = bidderCredentials.bidderID,
            let sellingToBidderID = sellingToBidderID else { return false }
        return bidderID == sellingToBidderID
    }

    var userIsWinning: Bool {
        guard let
            bidderID = bidderCredentials.bidderID,
            let winningBidEvent = winningBidEvent else { return false }
        return winningBidEvent.hasBidderID(bidderID)
    }

    var userIsFloorWinningBidder: Bool {
        return bidderCredentials.bidderID == floorWinningBidderID
    }

    func findBidWithValue(_ amountCents: UInt64) -> LiveAuctionEventViewModel? {
        return fullEventList.filter({ $0.isBid && $0.hasAmountCents(amountCents) }).first
    }

    // Want to avoid array searching + string->date processing every in timer loops
    // so pre-cache createdAt when found.
    fileprivate var _dateLotOpened: Date?

    var dateLotOpened: Date? {
        guard _dateLotOpened == nil else { return _dateLotOpened }
        guard let opening = fullEventList.filter({ $0.isLotOpening }).first else { return nil }
        _dateLotOpened = opening.dateEventCreated as Date
        return _dateLotOpened
    }

    var currencySymbol: String {
        return model.currencySymbol
    }

    var estimateString: String? {
        return model.estimate
    }

    var highEstimateOrEstimateCents: UInt64? {
        return model.highEstimateCents?.uint64Value ?? model.estimateCents?.uint64Value
    }

    var eventIDs: [String] {
        return model.eventIDs
    }

    func eventWithID(_ string: String) -> LiveAuctionEventViewModel? {
        return fullEventList.filter { $0.event.eventID == string }.first
    }

    var numberOfDerivedEvents: Int {
        return derivedEvents.count
    }

    func derivedEventAtPresentationIndex(_ index: Int) -> LiveAuctionEventViewModel {
        // Events are ordered FIFO, need to inverse for presentation
        return derivedEvents[numberOfDerivedEvents - index - 1]
    }

    var reserveStatusString: String {
        guard let status = reserveStatusSignal.peek() else {
            return "unknown reserve"
        }

        switch status {
        case .unknown: fallthrough
        case .noReserve:
            return "no reserve"
        case .reserveMet:
            return "reserve met"
        case .reserveNotMet:
            return "reserve not yet met"
        }
    }

    func updateReserveStatus(_ reserveStatusString: String) {
        let updated = model.updateReserveStatus(with: reserveStatusString)

        if updated {
            reserveStatusSignal.update(model.reserveStatus)
        }
    }

    func updateOnlineAskingPrice(_ askingPrice: UInt64) {
        let updated = model.updateOnlineAskingPrice(askingPrice)

        if updated {
            askingPriceSignal.update(askingPrice)
        }
    }

    func updateBiddingStatus(_ biddingStatus: String, wasPassed: Bool) {
        let updated = model.updateBiddingStatus(with: biddingStatus)

        if updated {
            biddingStatusSignal.update((status: model.biddingStatus, wasPassed: wasPassed, isHighestBidder: self.userIsWinning))
        }
    }

    func updateOnlineBidCount(_ onlineBidCount: Int) {
        model.onlineBidCount = onlineBidCount
        numberOfBidsSignal.update(onlineBidCount)
    }

    func updateFloorWinningBidderID(_ floorWinningBidderID: String?) {
        self.floorWinningBidderID = floorWinningBidderID
    }

    func updateSellingToBidder(_ sellingToBidderID: String?) {
        self.sellingToBidderID = sellingToBidderID
    }

    func updateWinningBidEventID(_ winningBidEventId: String?) {
        self.winningBidEventID = winningBidEventId
    }

    func addEvents(_ newEvents: [LiveEvent]) {

        model.addEvents(newEvents.map { $0.eventID })
        let newEventViewModels = newEvents.map { LiveAuctionEventViewModel(event: $0, currencySymbol: model.currencySymbol) }

        fullEventList += newEventViewModels

        updateExistingEventsWithLotState()

        var allUserFacingEvents = fullEventList.filter { $0.isUserFacing }
        if let winningBidEvent = allUserFacingEvents.remove(matching: { event in
            guard let winningBidEventID = self.winningBidEventID else { return false }
            return event.eventID == winningBidEventID
        }) {
            derivedEvents = allUserFacingEvents + [winningBidEvent]
        } else {
            derivedEvents = allUserFacingEvents
        }

        let newDerivedEvents = newEventViewModels.filter { $0.isUserFacing }
        newEventsSignal.update(newDerivedEvents)
    }


    /// This isn't really very efficient, lots of loops to do lookups, maybe n^n?

    fileprivate func updateExistingEventsWithLotState() {
        // Undoes need applying
        for undoEvent in fullEventList.filter({ $0.isUndo }) {
            guard let
                referenceEventID = undoEvent.undoLiveEventID,
                let eventToUndo = eventWithID(referenceEventID) else { continue }
            eventToUndo.cancel()
        }

        /// Setup Pending
        for bidEvent in fullEventList.filter({ $0.isBidConfirmation }) {
            guard let
                amount = bidEvent.bidConfirmationAmount,
                let eventToConfirm = findBidWithValue(amount) else { continue }
            eventToConfirm.confirm()
        }

        /// Setup bidStatus, so an EventVM knows if it's top/owner by the user etc
        for bidEvent in fullEventList.filter({ $0.isBid }) {

            let isTopBid = (bidEvent.eventID == winningBidEvent?.eventID)
            let isUser: Bool
            if let bidderID = bidderCredentials.bidderID, bidderCredentials.canBid {
                isUser = bidEvent.hasBidderID(bidderID)
            } else {
                isUser = false
            }

            if isUser && (userTopBidCents ?? 0) < (bidEvent.bidAmountCents ?? 0) {
                 userTopBidCents = bidEvent.bidAmountCents
            }

            let status: BidEventBidStatus
            if bidEvent.isFloorBidder {
                status = .bid(isMine: isUser, isTop: isTopBid, userIsFloorWinningBidder: false)

            } else { // if bidEvent.isArtsyBidder {
                status = .bid(isMine: isUser, isTop: isTopBid, userIsFloorWinningBidder: userIsFloorWinningBidder)
            }
            bidEvent.bidStatus = status
        }

    }
}
