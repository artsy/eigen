import Foundation
import Interstellar

// Represents a single lot view

enum LotState {
    case UpcomingLot
    case LiveLot
    case ClosedLot
}

protocol LiveAuctionLotViewModelType: class {
    func eventAtPresentationIndex(index: Int) -> LiveAuctionEventViewModel

    var lotArtist: String { get }
    var lotArtistBlurb: String? { get }
    var estimateString: String { get }
    var lotPremium: String { get }
    var lotName: String { get }
    var lotID: String { get }
    var lotArtworkCreationDate: String? { get }
    var urlForThumbnail: NSURL { get }
    var urlForProfile: NSURL { get }
    var numberOfEvents: Int { get }
    var lotIndex: Int { get }
    var currentLotValue: UInt64 { get }
    var currentLotValueString: String { get }
    var currencySymbol: String { get }
    var numberOfBids: Int { get }
    var imageAspectRatio: CGFloat { get }
    var liveAuctionLotID: String { get }
    var reserveStatusString: String { get }
    var dateLotOpened: NSDate? { get }

    var reserveStatusSignal: Observable<ARReserveStatus> { get }
    var lotStateSignal: Observable<LotState> { get }
    var askingPriceSignal: Observable<UInt64> { get }
    var startEventUpdatesSignal: Observable<NSDate> { get }
    var endEventUpdatesSignal: Observable<NSDate> { get }
    var newEventSignal: Observable<LiveAuctionEventViewModel> { get }
}

extension LiveAuctionLotViewModelType {
    var lotIndexDisplayString: String {
        return "Lot \(lotIndex + 1)"
    }
}

class LiveAuctionLotViewModel: NSObject, LiveAuctionLotViewModelType {

    private let model: LiveAuctionLot
    private var events = [LiveAuctionEventViewModel]()
    private let biddingStatusSignal = Observable<ARLiveBiddingStatus>()

    let reserveStatusSignal = Observable<ARReserveStatus>()
    let lotStateSignal: Observable<LotState>
    let askingPriceSignal = Observable<UInt64>()

    let startEventUpdatesSignal = Observable<NSDate>()
    let endEventUpdatesSignal = Observable<NSDate>()
    let newEventSignal = Observable<LiveAuctionEventViewModel>()

    init(lot: LiveAuctionLot) {
        self.model = lot

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

    var numberOfBids: Int {
        return events.filter { $0.isBid }.count
    }

    var urlForThumbnail: NSURL {
        return model.urlForThumbnail()
    }

    var urlForProfile: NSURL {
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

    var lotPremium: String {
        return "Premium: WIP"
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

    // Want to avoid array searching + string->date processing every in timer loops
    // so pre-cache createdAt when found.
    private var _dateLotOpened: NSDate?

    var dateLotOpened: NSDate? {
        if (_dateLotOpened != nil) { return _dateLotOpened }
        guard let opening = events.filter({ $0.isLotOpening }).first else { return nil }
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

    var numberOfEvents: Int {
        return events.count
    }
    
    func eventAtPresentationIndex(index: Int) -> LiveAuctionEventViewModel {
        // Events are ordered FIFO, need to inverse for presentation
        return events[numberOfEvents - index - 1]
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

    func addEvents(events: [LiveEvent]) {
        startEventUpdatesSignal.update(NSDate())
        defer { endEventUpdatesSignal.update(NSDate()) }

        model.addEvents(events.map { $0.eventID })
        let newEvents = events.map { LiveAuctionEventViewModel(event: $0, currencySymbol: model.currencySymbol) }
        newEvents.forEach { event in
            newEventSignal.update(event)
        }
        self.events += newEvents
    }
}

