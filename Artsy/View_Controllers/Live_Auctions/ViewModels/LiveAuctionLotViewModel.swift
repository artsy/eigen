import Foundation
import Interstellar

// Represents a single lot view

enum LotState {
    case ClosedLot
    case LiveLot
    case UpcomingLot(distanceFromLive: Int)
}

protocol LiveAuctionLotViewModelType: class {
    func bidButtonTitleWithState(state: LotState) -> String
    func eventAtIndex(index: Int) -> LiveAuctionEventViewModel
    func computedLotStateSignal(auctionViewModel: LiveAuctionViewModelType) -> Signal<LotState>

    var lotArtist: String { get }
    var estimateString: String { get }
    var lotName: String { get }
    var urlForThumbnail: NSURL { get }
    var numberOfEvents: Int { get }
    var lotIndex: Int { get }
    var currentLotValue: String { get }
    var imageProfileSize: CGSize { get }
    var liveAuctionLotID: String { get }

    var reserveStatusSignal: Signal<ARReserveStatus> { get }
    var askingPriceSignal: Signal<Int> { get }
    var startEventUpdatesSignal: Signal<NSDate> { get }
    var endEventUpdatesSignal: Signal<NSDate> { get }
    var newEventSignal: Signal<LiveAuctionEventViewModel> { get }
}

class LiveAuctionLotViewModel: NSObject, LiveAuctionLotViewModelType {

    private let model: LiveAuctionLot
    private var events = [LiveAuctionEventViewModel]()

    let reserveStatusSignal = Signal<ARReserveStatus>()
    let askingPriceSignal = Signal<Int>()

    let startEventUpdatesSignal = Signal<NSDate>()
    let endEventUpdatesSignal = Signal<NSDate>()
    let newEventSignal = Signal<LiveAuctionEventViewModel>()

    init(lot: LiveAuctionLot) {
        self.model = lot

        reserveStatusSignal.update(lot.reserveStatus)
        askingPriceSignal.update(lot.onlineAskingPriceCents)
    }

    func bidButtonTitleWithState(lotState: LotState) -> String {
        switch lotState {
        case .ClosedLot: return "BIDDING CLOSED"
        case .LiveLot: return "BID 20,000"
        case .UpcomingLot(_): return "LEAVE MAX BID"
        }
    }

    func lotStateWithViewModel(viewModel: LiveAuctionViewModelType) -> LotState {
        guard let distance = viewModel.distanceFromCurrentLot(model) else {
            return .ClosedLot
        }
        if distance == 0 { return .LiveLot }
        if distance < 0 { return .ClosedLot }
        return .UpcomingLot(distanceFromLive: distance)
    }

    func computedLotStateSignal(auctionViewModel: LiveAuctionViewModelType) -> Signal<LotState> {
        return auctionViewModel
            .currentLotIDSignal
            .map { [weak self, weak auctionViewModel] currentLotID -> LotState in
                guard let sSelf = self, sAuctionViewModel = auctionViewModel else { return .ClosedLot }
                return sSelf.lotStateWithViewModel(sAuctionViewModel)
            }
    }

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
        let updated = model.updateReserveStatusWithString(reserveStatusString)
        
        if updated {
            reserveStatusSignal.update(model.reserveStatus)
        }
    }

    func updateOnlineAskingPrice(askingPrice: Int) {
        let updated = model.updateOnlineAskingPrice(askingPrice)

        if updated {
            askingPriceSignal.update(askingPrice)
        }
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

