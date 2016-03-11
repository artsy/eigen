import Foundation

// Represents a single lot view

class LiveAuctionLotViewModel : NSObject {

    enum LotState {
        case ClosedLot
        case LiveLot
        case UpcomingLot(distanceFromLive: Int)
    }

    private let auction: LiveAuctionViewModel
    private let lot: LiveAuctionLot
    private let index: Int

    let events: [LiveAuctionEventViewModel] // Var?

    init(lot: LiveAuctionLot, auction: LiveAuctionViewModel, events: [LiveAuctionEventViewModel], index: Int) {
        self.lot = lot
        self.auction = auction
        self.index = index
        self.events = events
    }

    var lotState : LotState {
        guard let distance = auction.distanceFromCurrentLot(lot) else {
            return .ClosedLot
        }
        if distance == 0 { return .LiveLot }
        if distance < 0 { return .ClosedLot }
        return .UpcomingLot(distanceFromLive: distance)
    }

    var urlForThumbnail: NSURL {
        return lot.urlForThumbnail()
    }

    var urlForProfile: NSURL {
        return lot.urlForThumbnail()
    }

    var imageProfileSize: CGSize {
        return lot.imageProfileSize()
    }

    var lotName: String {
        return lot.artworkTitle
    }

    var lotArtist: String {
        return lot.artistName
    }

    var lotIndex: Int {
        return index + 1
    }

    var lotCount: Int {
        return auction.lotCount
    }

    // maybe depecated by currentLotviewModel?
    var currentLotValue: String {
        return "$10,000"
    }

    var bidButtonTitle: String {
        switch lotState {
        case .ClosedLot:   return "BIDDING CLOSED"
        case .LiveLot:  return "BID 20,000"
        case .UpcomingLot(_):  return "LEAVE MAX BID"
        }
    }

    var estimateString: String {
        return SaleArtwork.estimateStringForLowEstimate(lot.lowEstimateCents, highEstimateCents: lot.highEstimateCents, currencySymbol: lot.currencySymbol, currency: lot.currency)
    }
}

