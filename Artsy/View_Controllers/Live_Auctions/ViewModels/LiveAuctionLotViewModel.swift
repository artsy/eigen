import Foundation
import Interstellar

// Represents a single lot view

class LiveAuctionLotViewModel : NSObject {

    enum LotState {
        case ClosedLot
        case LiveLot
        case UpcomingLot(distanceFromLive: Int)
    }

    private let model: LiveAuctionLot
    private var events = [LiveAuctionEventViewModel]()

    let reserveStatusSignal = Signal<ARReserveStatus>()
    let askingPriceSignal = Signal<Int>()

    let startEventUpdatesSignal = Signal<NSDate>()
    let endEventUpdatesSignal = Signal<NSDate>()
    let newEventSignal = Signal<LiveAuctionEventViewModel>()

    init(lot: LiveAuctionLot) {
        self.model = lot
    }

    var lotStateSignal: Signal<LotState> {
        return Signal<LotState>() // TODO: This needs to be updated
    }

    var bidButtonTitleSignal: Signal<String> {
        return lotStateSignal.map { lotState in
            switch lotState {
            case .ClosedLot: return "BIDDING CLOSED"
            case .LiveLot: return "BID 20,000"
            case .UpcomingLot(_): return "LEAVE MAX BID"
            }
        }
    }

//    func lotStateWithViewModel(viewModel: LiveAuctionViewModel) -> LotState {
//        guard let distance = viewModel.distanceFromCurrentLot(model) else {
//            return .ClosedLot
//        }
//        if distance == 0 { return .LiveLot }
//        if distance < 0 { return .ClosedLot }
//        return .UpcomingLot(distanceFromLive: distance)
//    }

    var urlForThumbnail: NSURL {
        return model.urlForThumbnail()
    }

    var urlForProfile: NSURL {
        return model.urlForThumbnail()
    }

    var imageProfileSize: CGSize {
        return model.imageProfileSize()
    }

    var lotName: String {
        return model.artworkTitle
    }

    var lotArtist: String {
        return model.artistName
    }

    var lotIndex: Int {
        return model.position
    }

    var liveAuctionLotID: String {
        return model.liveAuctionLotID
    }

    // maybe depecated by currentLotviewModel?
    var currentLotValue: String {
        return "$10,000"
    }

    var estimateString: String {
        return SaleArtwork.estimateStringForLowEstimate(model.lowEstimateCents, highEstimateCents: model.highEstimateCents, currencySymbol: model.currencySymbol, currency: model.currency)
    }

    var eventIDs: [String] {
        return model.eventIDs
    }

    var numberOfEvents: Int {
        return events.count
    }

    func eventAtIndex(index: Int) -> LiveAuctionEventViewModel {
        return events[index]
    }

    func updateReserveStatus(reserveStatusString: String) {
        model.updateReserveStatusWithString(reserveStatusString)
        reserveStatusSignal.update(model.reserveStatus)
    }

    func updateOnlineAskingPrice(askingPrice: Int) {
        model.updateOnlineAskingPrice(askingPrice)
        askingPriceSignal.update(askingPrice)
    }

    func addEvents(events: [LiveEvent]) {
        startEventUpdatesSignal.update(NSDate())
        defer { endEventUpdatesSignal.update(NSDate()) }

        model.addEvents(events.map { $0.eventID })
        let newEvents = events.map { LiveAuctionEventViewModel(event: $0) }
        newEvents.forEach { event in
            newEventSignal.update(event)
        }
        self.events += newEvents
    }
}

